import { useEffect, useState } from 'react'
import Abi from 'abis'
import axios from 'axios'
import { BigNumber, constants, Contract, ethers } from 'ethers'
import {
  knownTokens,
  getTokenFromAddress,
  getContractAddress,
} from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { useNetworkContext } from 'contexts/networkContext'
import { useServices } from 'helpers'
import { Network, OriginationLabels } from 'utils/enums'
import { getOffersDataMulticall, ITokenOfferDetails } from './helper'
import { IToken, ITokenOffer } from 'types'
import { FungiblePoolService } from 'services'

interface IState {
  tokenOffer?: ITokenOffer
  loading: boolean
}

export const useOriginationPool = (poolAddress?: string, network?: Network) => {
  const { account, networkId, library: provider } = useConnectedWeb3Context()
  const { chainId } = useNetworkContext()
  const { multicall } = useServices(network)

  const [state, setState] = useState<IState>({ loading: true })

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

      const nonfungiblePositionManagerAddress = getContractAddress(
        'vestingEntryNFT',
        provider?.network.chainId
      )

      const vestingEntryNFTContract = new Contract(
        nonfungiblePositionManagerAddress,
        Abi.vestingEntryNFT,
        provider
      )

      const [
        token0,
        token1,
        offerTokenAmountPurchased,
        purchaseTokenContribution,
        entryId,
      ] = await Promise.all([
        getTokenFromAddress(_offerData?.offerToken as string, networkId),
        getTokenFromAddress(_offerData?.purchaseToken as string, networkId),
        fungiblePool.contract.offerTokenAmountPurchased(account),
        fungiblePool.contract.purchaseTokenContribution(account),
        fungiblePool.contract.userToVestingId(account),
      ])

      const nftInfo = await vestingEntryNFTContract.tokenIdVestingAmounts(
        entryId
      )

      const { tokenAmount, tokenAmountClaimed } = nftInfo

      const ETH: IToken = {
        ...knownTokens.eth,
        address: constants.AddressZero,
      }

      const {
        offerTokenAmountSold,
        totalOfferingAmount,
        reserveAmount,
        vestingPeriod,
        cliffPeriod,
        saleInitiatedTimestamp,
        saleEndTimestamp,
        publicStartingPrice,
        whitelistStartingPrice,
        whitelistEndingPrice,
        whitelistSaleDuration,
        publicSaleDuration,
        whitelistMerkleRoot,
        getOfferTokenPrice,
        publicEndingPrice,
      } = _offerData as ITokenOfferDetails

      const offeringOverview = {
        label: OriginationLabels.OfferingOverview,
        offerToken: token0 || ETH,
        purchaseToken: token1 || ETH,
        offeringReserve: reserveAmount,
        vestingPeriod,
        cliffPeriod,
        salesBegin: saleInitiatedTimestamp,
        salesEnd: saleEndTimestamp,
        salesPeriod: publicSaleDuration,
        offerTokenAmountSold,
        totalOfferingAmount,
        poolAddress,
      }

      const endOfWhitelistPeriod = saleInitiatedTimestamp.add(
        (whitelistSaleDuration as BigNumber) || BigNumber.from(0)
      )
      const whitelistTimeRemaining = !endOfWhitelistPeriod.isZero()
        ? endOfWhitelistPeriod.sub(BigNumber.from(Date.now()))
        : BigNumber.from('0')

      const timeRemaining = !saleEndTimestamp.isZero()
        ? saleEndTimestamp.sub(BigNumber.from(Date.now()))
        : BigNumber.from('0')

      const isSetWhitelist = () => {
        if (
          whitelistMerkleRoot &&
          whitelistMerkleRoot.some((x) => x !== ethers.constants.AddressZero)
        ) {
          return true
        }

        return false
      }

      const _whitelist = {
        label: OriginationLabels.WhitelistSale,
        currentPrice: getOfferTokenPrice,
        pricingFormular: whitelistStartingPrice?.gt(
          whitelistEndingPrice as BigNumber
        )
          ? 'Ascending'
          : 'Descending',
        startingPrice: whitelistStartingPrice,
        endingPrice: whitelistEndingPrice,
        whitelist: isSetWhitelist(),
        addressCap: '',
        timeRemaining: whitelistTimeRemaining,
        salesPeriod: whitelistSaleDuration,
        offerToken: token0,
        purchaseToken: token1 || ETH,
      }

      const publicSale = {
        label: OriginationLabels.PublicSale,
        currentPrice: getOfferTokenPrice,
        pricingFormular: publicStartingPrice?.gt(publicEndingPrice as BigNumber)
          ? 'Ascending'
          : 'Descending',
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
      }

      return {
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
