import Abi from 'abis'
import axios from 'axios'
<<<<<<< HEAD
import { getNetworkProvider, getTokenFromAddress } from 'config/networks'
=======
>>>>>>> 34f2682 (Bootstrapped token offer details page)
import { useConnectedWeb3Context } from 'contexts'
import { useServices } from 'helpers'
import { useEffect, useState } from 'react'
import { Network } from 'utils/enums'
import { getOffersDataMulticall } from './helper'
import { BigNumber, constants } from 'ethers'
import moment from 'moment'
import { ETH } from 'config/constants'

interface IState {
  // todo: fix typing
  tokenOffer?: any
  loading: boolean
}

export const useTokenOffer = (
  tokenOfferPoolAddress?: string,
  network?: Network
) => {
  const [state, setState] = useState<IState>({
    loading: true,
    tokenOffer: undefined,
  })
  const { account, networkId } = useConnectedWeb3Context()
  const { multicall } = useServices(network)

  const loadInfo = async () => {
    if (!tokenOfferPoolAddress) return

    setState((prev) => ({ ...prev, loading: true }))

<<<<<<< HEAD
    if ((!tokenOffer && tokenOfferAddress) || isReloadTokenOffer) {
      try {
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

        // TODO: force-fallback can be removed later
        tokenOffer = await getOffersDataMulticall(
          tokenOfferAddress as string,
          multicall
        )
      } catch (e) {
        console.error('Error fetching token offer details', e)
        // Fallback in case API doesn't return token offer details
        tokenOffer = await getOffersDataMulticall(
          tokenOfferAddress as string,
          multicall
        )
      }
    }

    let timeRemaining = BigNumber.from(0)
    let remainingOfferingAmount = BigNumber.from(0)
    let purchaseToken

    // Fetch offer details if API fails
    const isSaleInitiated = !tokenOffer.saleInitiatedTimestamp.isZero()

    const elapsedTime = moment()
      .subtract(tokenOffer.saleInitiatedTimestamp.toString())
      .toString()

    timeRemaining = isSaleInitiated
      ? moment(tokenOffer.saleDuration.toString())
          .subtract(elapsedTime)
          .toString()
      : tokenOffer.saleDuration.toString()

    remainingOfferingAmount = tokenOffer.totalOfferingAmount.sub(
      tokenOffer.offerTokenAmountSold
    )

    const offerToken = getTokenFromAddress(tokenOffer.offerToken, networkId)

    if (tokenOffer.purchaseToken !== constants.AddressZero) {
      purchaseToken = getTokenFromAddress(tokenOffer.purchaseToken, networkId)
    } else {
      purchaseToken = ETH
    }

    try {
      setState({
        loading: false,
        tokenOffer: {
          totalOfferingAmount: tokenOffer.totalOfferingAmount,
          offerToken,
          remainingOfferingAmount,
          pricePerToken: tokenOffer.endingPrice,
          purchaseToken,
          timeRemaining,
          vestingPeriod: tokenOffer.vestingPeriod,
          cliffPeriod: tokenOffer.cliffPeriod,
        },
      })
    } catch (error) {
      console.error(error)
      setState(() => ({ loading: false }))
    }
    // console.timeEnd(`loadInfo ${tokenOfferAddress}`)
=======
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
    const tokenOffer = await getOffersDataMulticall(
      tokenOfferPoolAddress,
      multicall
    )
    // }

    setState({
      loading: false,
      tokenOffer,
    })
>>>>>>> 34f2682 (Bootstrapped token offer details page)
  }

  useEffect(() => {
    loadInfo()
    const interval = setInterval(loadInfo, 2 * 1000)

    return () => clearInterval(interval)
  }, [networkId, tokenOfferPoolAddress, account])

  return { ...state, loadInfo }
}
