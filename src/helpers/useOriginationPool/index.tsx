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
import { IOriginationPool, IToken, ITokenOffer } from 'types'
import { ERC20Service, FungiblePoolService } from 'services'
import { getCurrentTimeStamp, getRemainingTimeSec } from 'utils'
import {
  ChainId,
  NULL_ADDRESS_WHITELIST,
  ORIGINATION_API_URL,
} from 'config/constants'
import { ZERO } from 'utils/number'
import { getIdFromNetwork, isTestnet } from 'utils/network'
import { getAddress } from 'ethers/lib/utils'
import {
  getCoinGeckoIDs,
  getTokenExchangeRate,
} from 'helpers/useTerminalPool/helper'

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

  const ETH: IToken = {
    ...knownTokens.eth,
    address: constants.AddressZero,
  }
  const defaultTokenLogo = '/assets/tokens/unknown.png'

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

  const fungiblePool = new FungiblePoolService(provider, account, poolAddress)

  const loadInfo = async () => {
    if (!poolAddress) return

    setState((prev) => ({ ...prev, loading: true }))

    let offerData
    let _sponsorTokensClaimed
    let whitelistMerkleRoot
    try {
      offerData = (
        await axios.get(
          `${ORIGINATION_API_URL}/pool/${getAddress(poolAddress)}`,
          {
            params: {
              network,
            },
          }
        )
      ).data

      // TODO: temporary workaround
      const [
        whitelistStartingPrice,
        whitelistEndingPrice,
        publicStartingPrice,
        publicEndingPrice,
        saleInitiatedTimestamp,
        saleEndTimestamp,
        sponsorTokensClaimed,
        offerTokenAmountSold,
        purchaseTokensAcquired,
      ] = await Promise.all([
        fungiblePool.contract.whitelistStartingPrice(),
        fungiblePool.contract.whitelistEndingPrice(),
        fungiblePool.contract.publicStartingPrice(),
        fungiblePool.contract.publicEndingPrice(),
        fungiblePool.contract.saleInitiatedTimestamp(),
        fungiblePool.contract.saleEndTimestamp(),
        fungiblePool.contract.sponsorTokensClaimed(),
        fungiblePool.contract.offerTokenAmountSold(),
        fungiblePool.contract.purchaseTokensAcquired(),
      ])

      _sponsorTokensClaimed = sponsorTokensClaimed

      offerData.whitelistStartingPrice = whitelistStartingPrice
      offerData.whitelistEndingPrice = whitelistEndingPrice
      offerData.publicStartingPrice = publicStartingPrice
      offerData.publicEndingPrice = publicEndingPrice
      offerData.saleInitiatedTimestamp = saleInitiatedTimestamp
      offerData.saleEndTimestamp = saleEndTimestamp
      offerData.offerTokenAmountSold = offerTokenAmountSold
      offerData.purchaseTokensAcquired = purchaseTokensAcquired

      for (const key in offerData) {
        if (!isNaN(offerData[key]) && typeof offerData[key] !== 'object') {
          offerData[key] = BigNumber.from(offerData[key])
        }
      }
    } catch (e) {
      console.error('Error fetching token offer details', e)
      //Fallback in case API doesn't return token offer details
      offerData = await getOffersDataMulticall(poolAddress, multicall)
      // TODO: temporary workaround
      _sponsorTokensClaimed = offerData?.sponsorTokensClaimed
    }

    if (!offerData) return
    if (offerData && !offerData?.offerToken.address) {
      const [token0, token1] = await Promise.all([
        getTokenDetails(offerData?.offerToken),
        getTokenDetails(offerData?.purchaseToken),
      ])
      offerData.offerToken = token0
      offerData.purchaseToken = token1

      let rates = undefined
      if (!isTestnet(readonlyProvider?.network.chainId as ChainId)) {
        const ids = await getCoinGeckoIDs([token0.symbol, token1.symbol])
        rates = await getTokenExchangeRate(ids)
      }

      offerData.offerToken.price = rates && rates[0] ? rates[0].toString() : '0'
      offerData.purchaseToken.price =
        rates && rates[1] ? rates[1].toString() : '0'
    }

    offerData.offerToken.image = offerData.offerToken?.image
      ? offerData.offerToken?.image
      : defaultTokenLogo
    offerData.purchaseToken.image = offerData.purchaseToken?.image
      ? offerData.purchaseToken?.image
      : defaultTokenLogo

    try {
      const [
        offerTokenAmountPurchased,
        purchaseTokenContribution,
        userToVestingId, // TODO: need to be refactored later after graph is ready
        isOwnerOrManager,
        vestingEntryNFTAddress,
      ] = await Promise.all([
        fungiblePool.contract.offerTokenAmountPurchased(account),
        fungiblePool.contract.purchaseTokenContribution(account),
        fungiblePool.contract.userToVestingId(account),
        fungiblePool.contract.isOwnerOrManager(account),
        fungiblePool.contract.vestingEntryNFT(),
      ])

      try {
        whitelistMerkleRoot = (
          await axios.get(
            `${ORIGINATION_API_URL}/whitelistMerkleRoot?network=${network}&poolAddress=${poolAddress}`
          )
        ).data
      } catch (error) {
        whitelistMerkleRoot = {}
        console.log('fetch whitelistMerkleRoot error')
      }

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
        whitelistSaleDuration,
        whitelistStartingPrice,
        sponsorTokensClaimed,
        offerToken,
        purchaseToken,
      } = offerData

      const _publicSaleDuration = BigNumber.from(Number(publicSaleDuration))
      const _whitelistSaleDuration = BigNumber.from(
        Number(whitelistSaleDuration)
      )

      const offeringOverview = {
        label: OriginationLabels.OfferingOverview,
        offerToken: offerToken || ETH,
        purchaseToken: purchaseToken || ETH,
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

      let addressCap = ZERO
      let isAddressWhitelisted = false
      let whitelistedAcccountDetails

      if (whitelistMerkleRoot.data?.hasSetWhitelistMerkleRoot) {
        try {
          // `maxContributionAmount` doesn't exist on contract level. Can only get from API.
          // TODO: network is hardcoded for now
          whitelistedAcccountDetails = (
            await axios.get(
              `${ORIGINATION_API_URL}/whitelistedAcccountDetails/?accountAddress=${account}&poolAddress=${poolAddress}&network=${network}`
            )
          ).data

          addressCap = BigNumber.from(
            whitelistedAcccountDetails.maxContributionAmount
          )
          isAddressWhitelisted = whitelistedAcccountDetails.isAddressWhitelisted
        } catch (e) {
          whitelistedAcccountDetails = {}
          isAddressWhitelisted = false
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
            : whitelistStartingPrice?.gt(whitelistEndingPrice)
            ? EPricingFormula.Descending
            : EPricingFormula.Ascending,
        startingPrice: whitelistStartingPrice,
        endingPrice: whitelistEndingPrice,
        whitelist: whitelistMerkleRoot.data?.hasSetWhitelistMerkleRoot,
        addressCap,
        timeRemaining: whitelistTimeRemaining,
        salesPeriod: whitelistSaleDuration,
        offerToken: offerToken,
        purchaseToken: purchaseToken || ETH,
        whitelistMerkleRoot: whitelistMerkleRoot.data?.merkleRoot,
        isAddressWhitelisted,
        endOfWhitelistPeriod,
      }

      const publicSale = {
        label: OriginationLabels.PublicSale,
        currentPrice: getOfferTokenPrice,
        pricingFormula:
          publicStartingPrice.toString() === publicEndingPrice.toString()
            ? EPricingFormula.Standard
            : publicStartingPrice?.gt(publicEndingPrice)
            ? EPricingFormula.Descending
            : EPricingFormula.Ascending,
        salesPeriod: publicSaleDuration,
        timeRemaining,
        offerToken: offerToken,
        purchaseToken: purchaseToken || ETH,
        startingPrice: publicStartingPrice,
        endingPrice: publicEndingPrice,
        saleEndTimestamp,
      }

      const myPosition = {
        label: OriginationLabels.MyPosition,
        tokenPurchased: offerTokenAmountPurchased,
        amountInvested: purchaseTokenContribution,
        amountvested: tokenAmountClaimed,
        amountAvailableToVest: tokenAmount.sub(tokenAmountClaimed),
        offerToken: offerToken,
        purchaseToken: purchaseToken || ETH,
        vestableTokenAmount,
        userToVestingId: [userToVestingId.toNumber()],
      }

      const offeringSummary = {
        label: OriginationLabels.OfferingSummary,
        offerToken: offerToken,
        purchaseToken: purchaseToken || ETH,
        tokensSold: offerTokenAmountSold,
        amountsRaised: purchaseTokensAcquired,
        vestingPeriod,
        cliffPeriod,
        salesCompleted: saleEndTimestamp,
        timeSinceCompleted: BigNumber.from(getCurrentTimeStamp()).sub(
          saleEndTimestamp
        ),
      }

      const _offerData: ITokenOffer = {
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
        network,
        // TODO: temporary workaround
        sponsorTokensClaimed: _sponsorTokensClaimed,
      }

      setState({
        loading: false,
        tokenOffer: _offerData,
      })
    } catch (error) {
      console.log('handling offer data error', error)
      setState({
        loading: false,
      })
    }
  }

  useEffect(() => {
    loadInfo()
  }, [networkId, poolAddress, account])

  return { ...state, loadInfo }
}
