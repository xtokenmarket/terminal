import { useEffect, useState } from 'react'
import Abi from 'abis'
import axios from 'axios'
<<<<<<< HEAD
<<<<<<< HEAD
import { getNetworkProvider, getTokenFromAddress } from 'config/networks'
=======
>>>>>>> 34f2682 (Bootstrapped token offer details page)
=======
import { constants } from 'ethers'
import { knownTokens } from 'config/networks'
>>>>>>> 399d09b (Fixed discover page data wiring setup)
import { useConnectedWeb3Context } from 'contexts'
import { useNetworkContext } from 'contexts/networkContext'
import { useServices } from 'helpers'
import { Network } from 'utils/enums'
import { fetchUnknownToken } from 'utils/token'
import { getOffersDataMulticall } from './helper'
<<<<<<< HEAD
import { BigNumber, constants } from 'ethers'
import moment from 'moment'
import { ETH } from 'config/constants'
=======
import { IToken, ITokenOffer } from 'types'
>>>>>>> 399d09b (Fixed discover page data wiring setup)

interface IState {
  tokenOffer?: ITokenOffer
  loading: boolean
}

export const useTokenOffer = (
  tokenOfferPoolAddress?: string,
  network?: Network
) => {
  const { account, networkId, library: provider } = useConnectedWeb3Context()
  const { chainId } = useNetworkContext()
  const { multicall } = useServices(network)

  const [state, setState] = useState<IState>({ loading: true })

  const getContractTokenOfferData = async (
    poolAddress: string
  ): Promise<ITokenOffer> => {
    const contractOferingData = await getOffersDataMulticall(
      poolAddress,
      multicall
    )
    const tokens = await Promise.all([
      fetchUnknownToken(
        provider,
        chainId,
        contractOferingData?.offerToken,
        multicall
      ),
      fetchUnknownToken(
        provider,
        chainId,
        contractOferingData?.purchaseToken,
        multicall
      ),
    ])
    const defaultToken: IToken = {
      ...knownTokens.eth,
      address: constants.AddressZero,
    }

    return {
      ...contractOferingData,
      offerToken: tokens[0] ? tokens[0] : defaultToken,
      purchaseToken: tokens[1] ? tokens[1] : defaultToken,
    }
  }

  const loadInfo = async () => {
    if (!tokenOfferPoolAddress) return

    setState((prev) => ({ ...prev, loading: true }))
<<<<<<< HEAD

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
=======
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
      const offerData = await getContractTokenOfferData(tokenOfferPoolAddress)
      setState({
        loading: false,
        tokenOffer: offerData,
      })
    } catch (e) {
      setState((prev) => ({ ...prev, loading: false }))
    }
>>>>>>> 399d09b (Fixed discover page data wiring setup)
  }

  useEffect(() => {
    loadInfo()
    const interval = setInterval(loadInfo, 2 * 1000)

    return () => clearInterval(interval)
  }, [networkId, tokenOfferPoolAddress, account])

  return { ...state, loadInfo }
}
