import { useEffect, useState } from 'react'
import Abi from 'abis'
import axios from 'axios'
import { BigNumber, constants, Contract, ethers } from 'ethers'
import {
  knownTokens,
  getTokenFromAddress,
  getNetworkProvider,
} from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { useNetworkContext } from 'contexts/networkContext'
import { useServices } from 'helpers'
import { EPricingFormula, Network, OriginationLabels } from 'utils/enums'
import { getOffersDataMulticall, ITokenOfferDetails } from './helper'
import { IToken, ITokenOffer } from 'types'
import { ERC20Service, FungiblePoolService } from 'services'
import { getCurrentTimeStamp, getRemainingTimeSec } from 'utils'
import { NULL_ADDRESS_WHITELIST, ORIGINATION_API_URL } from 'config/constants'
import { ZERO } from 'utils/number'
import { getIdFromNetwork } from 'utils/network'

interface IState {
  tokenOffer?: ITokenOffer
  loading: boolean
}

export const useOriginationPool = (poolAddress: string, network: Network) => {
  const { account, networkId, library: provider } = useConnectedWeb3Context()
  const { multicall } = useServices(network)

  const [state, setState] = useState<IState>({ loading: true })

  let readonlyProvider = provider

  const isWrongNetwork = networkId !== getIdFromNetwork(network)
  if (isWrongNetwork) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    readonlyProvider = getNetworkProvider(network)
  }

  const getTokenDetails = async (address: string) => {
    try {
      return getTokenFromAddress(address, readonlyProvider?.network.chainId)
    } catch (error) {
      const erc20 = new ERC20Service(
        readonlyProvider,
        isWrongNetwork ? null : account,
        address
      )
      return erc20.getDetails()
    }
  }

  const getContractTokenOfferData = async (
    poolAddress: string
  ): Promise<ITokenOffer | undefined> => {
    try {
      const _offerData = await getOffersDataMulticall(poolAddress, multicall)

      const fungiblePool = new FungiblePoolService(
        provider,
        account,
        poolAddress
      )

      const [
        token0,
        token1,
        offerTokenAmountPurchased,
        purchaseTokenContribution,
        userToVestingId, // TODO: need to be refactored later after graph is ready
        isOwnerOrManager,
        vestingEntryNFTAddress,
      ] = await Promise.all([
        getTokenDetails(_offerData?.offerToken as string),
        getTokenDetails(_offerData?.purchaseToken as string),
        fungiblePool.contract.offerTokenAmountPurchased(account),
        fungiblePool.contract.purchaseTokenContribution(account),
        fungiblePool.contract.userToVestingId(account),
        fungiblePool.contract.isOwnerOrManager(account),
        fungiblePool.contract.vestingEntryNFT(),
      ])

      const vestingEntryNFTContract = new Contract(
        vestingEntryNFTAddress,
        Abi.vestingEntryNFT,
        provider
      )

      let nftInfo = {
        tokenAmount: BigNumber.from(0),
        tokenAmountClaimed: BigNumber.from(0),
      }

      if (vestingEntryNFTAddress !== ethers.constants.AddressZero) {
        nftInfo = await vestingEntryNFTContract.tokenIdVestingAmounts(
          userToVestingId
        )
      }

      const { tokenAmount, tokenAmountClaimed } = nftInfo

      const ETH: IToken = {
        ...knownTokens.eth,
        address: constants.AddressZero,
      }

      const {
        cliffPeriod,
        getOfferTokenPrice,
        offerTokenAmountSold,
        publicEndingPrice,
        publicSaleDuration,
        publicStartingPrice,
        purchaseTokensAcquired,
        reserveAmount,
        saleEndTimestamp,
        saleInitiatedTimestamp,
        totalOfferingAmount,
        vestableTokenAmount,
        vestingPeriod,
        whitelistEndingPrice,
        whitelistMerkleRoot,
        whitelistSaleDuration,
        whitelistStartingPrice,
        sponsorTokensClaimed,
      } = _offerData as ITokenOfferDetails

      const _publicSaleDuration = BigNumber.from(Number(publicSaleDuration))
      const _whitelistSaleDuration = BigNumber.from(
        Number(whitelistSaleDuration)
      )

      const offeringOverview = {
        label: OriginationLabels.OfferingOverview,
        offerToken: token0 || ETH,
        purchaseToken: token1 || ETH,
        offeringReserve: reserveAmount,
        vestingPeriod,
        cliffPeriod,
        salesBegin: saleInitiatedTimestamp,
        salesEnd: saleEndTimestamp,
        salesPeriod: _publicSaleDuration.add(_whitelistSaleDuration),
        offerTokenAmountSold,
        totalOfferingAmount,
        poolAddress,
        isOwnerOrManager,
      }

      const endOfWhitelistPeriod = saleInitiatedTimestamp.add(
        whitelistSaleDuration || BigNumber.from(0)
      )
      const whitelistTimeRemaining = !endOfWhitelistPeriod.isZero()
        ? getRemainingTimeSec(endOfWhitelistPeriod)
        : BigNumber.from('0')

      const timeRemaining = !saleEndTimestamp.isZero()
        ? getRemainingTimeSec(saleEndTimestamp)
        : BigNumber.from('0')

      const isSetWhitelist = () =>
        whitelistMerkleRoot &&
        whitelistMerkleRoot.some(
          (x) =>
            x !== ethers.constants.AddressZero && x !== NULL_ADDRESS_WHITELIST
        )

      let addressCap = ZERO
      let isAddressWhitelisted = false

      if (isSetWhitelist()) {
        try {
          // `maxContributionAmount` doesn't exist on contract level. Can only get from API.
          // TODO: network is hardcoded for now
          addressCap = BigNumber.from(
            (
              await axios.get(
                `${ORIGINATION_API_URL}/whitelistedAcccountDetails/?accountAddress=${account}&poolAddress=${poolAddress}&network=kovan`
              )
            ).data.maxContributionAmount
          )

          isAddressWhitelisted = (
            await axios.get(
              `http://originationstage.xtokenapi.link/api/whitelistedAcccountDetails/?accountAddress=${account}&poolAddress=${poolAddress}&network=kovan`
            )
          ).data.isAddressWhitelisted
        } catch (e) {
          // Whitelist detail for pool is missing
        }
      }

      const _whitelist = {
        label: OriginationLabels.WhitelistSale,
        currentPrice: getOfferTokenPrice,
        pricingFormula:
          whitelistStartingPrice?.toString() ===
          whitelistEndingPrice?.toString()
            ? EPricingFormula.Standard
            : whitelistStartingPrice?.gt(whitelistEndingPrice as BigNumber)
            ? EPricingFormula.Ascending
            : EPricingFormula.Descending,
        startingPrice: whitelistStartingPrice,
        endingPrice: whitelistEndingPrice,
        whitelist: isSetWhitelist(),
        addressCap,
        timeRemaining: whitelistTimeRemaining,
        salesPeriod: whitelistSaleDuration,
        offerToken: token0,
        purchaseToken: token1 || ETH,
        whitelistMerkleRoot,
        isAddressWhitelisted,
      }

      const publicSale = {
        label: OriginationLabels.PublicSale,
        currentPrice: getOfferTokenPrice,
        pricingFormula:
          publicStartingPrice.toString() === publicEndingPrice.toString()
            ? EPricingFormula.Standard
            : publicStartingPrice?.gt(publicEndingPrice as BigNumber)
            ? EPricingFormula.Ascending
            : EPricingFormula.Descending,
        salesPeriod: publicSaleDuration,
        timeRemaining,
        offerToken: token0,
        purchaseToken: token1 || ETH,
        startingPrice: publicStartingPrice,
        endingPrice: publicEndingPrice,
      }

      const myPosition = {
        label: OriginationLabels.MyPosition,
        tokenPurchased: offerTokenAmountPurchased,
        amountInvested: purchaseTokenContribution,
        amountvested: tokenAmountClaimed,
        amountAvailableToVest: tokenAmount.sub(tokenAmountClaimed),
        offerToken: token0,
        purchaseToken: token1 || ETH,
        vestableTokenAmount,
        userToVestingId: [userToVestingId.toNumber()],
      }

      const offeringSummary = {
        label: OriginationLabels.OfferingSummary,
        offerToken: token0,
        purchaseToken: token1 || ETH,
        tokensSold: offerTokenAmountSold,
        amountsRaised: purchaseTokensAcquired,
        vestingPeriod,
        cliffPeriod,
        salesCompleted: saleEndTimestamp,
        timeSinceCompleted: BigNumber.from(getCurrentTimeStamp()).sub(
          saleEndTimestamp
        ),
      }

      return {
        offeringSummary,
        myPosition,
        whitelist: _whitelist,
        offeringOverview,
        publicSale,
        originationRow: {
          ...offeringOverview,
          startingPrice: publicStartingPrice,
          saleDuration: publicSaleDuration,
        },
        // TODO: remove this hardcoded value
        network: Network.KOVAN,
        sponsorTokensClaimed,
      }
    } catch (error) {
      console.log(error)
    }
  }

  const loadInfo = async () => {
    if (!poolAddress) return

    setState((prev) => ({ ...prev, loading: true }))
    try {
      // try {
      // pool = (
      //   await axios.get(
      //     `${TERMINAL_API_URL}/pool/${getAddress(tokenOfferAddress as string)}`,
      //     {
      //       params: {
      //         network,
      //       },
      //     }
      //   )
      // ).data
      // } catch (e) {
      // console.error('Error fetching token offer details', e)
      // Fallback in case API doesn't return token offer details
      const offerData = await getContractTokenOfferData(poolAddress)
      setState({
        loading: false,
        tokenOffer: offerData,
      })
    } catch (e) {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }

  useEffect(() => {
    loadInfo()
  }, [networkId, poolAddress, account])

  return { ...state, loadInfo }
}
