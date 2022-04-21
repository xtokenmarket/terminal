import Abi from 'abis'
import axios from 'axios'
import { getNetworkProvider } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { useServices } from 'helpers'
import { useEffect, useState } from 'react'
import { ITokenOffer } from 'types'
import { Network } from 'utils/enums'
import { getIdFromNetwork } from 'utils/network'
import _ from 'lodash'
import { getOffersDataMulticall } from './helper'

interface IState {
  tokenOffer?: ITokenOffer
  loading: boolean
}

export const useTokenOffer = (
  tokenOffer?: any,
  tokenOfferAddress?: string,
  network?: Network,
  isTokenOfferDetails = false
) => {
  const [state, setState] = useState<IState>({
    loading: true,
    tokenOffer: undefined,
  })
  const { account, library: provider, networkId } = useConnectedWeb3Context()
  const { multicall } = useServices(network)

  let readonlyProvider = provider

  const isWrongNetwork = networkId !== getIdFromNetwork(network)
  if (isWrongNetwork) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    readonlyProvider = getNetworkProvider(network)
  }

  const loadInfo = async (isReloadTokenOffer = false) => {
    if (!tokenOffer && !tokenOfferAddress) return

    setState((prev) => ({ ...prev, loading: true }))

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
      } catch (e) {
        console.error('Error fetching token offer details', e)
        // Fallback in case API doesn't return token offer details
        tokenOffer = await getOffersDataMulticall(
          tokenOfferAddress as string,
          multicall
        )
      }
    }

    try {
      setState({
        loading: false,
        tokenOffer,
      })
    } catch (error) {
      console.error(error)
      setState(() => ({ loading: false }))
    }
    // console.timeEnd(`loadInfo ${tokenOfferAddress}`)
  }

  useEffect(() => {
    loadInfo()
    const interval = setInterval(() => loadInfo(true))

    return () => {
      clearInterval(interval)
    }
  }, [networkId, tokenOffer, tokenOfferAddress, account])

  return { ...state, loadInfo }
}
