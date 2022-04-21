import Abi from 'abis'
import axios from 'axios'
import { useConnectedWeb3Context } from 'contexts'
import { useServices } from 'helpers'
import { useEffect, useState } from 'react'
import { Network } from 'utils/enums'
import { getOffersDataMulticall } from './helper'

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
  }

  useEffect(() => {
    loadInfo()
    const interval = setInterval(loadInfo, 2 * 1000)

    return () => clearInterval(interval)
  }, [networkId, tokenOfferPoolAddress, account])

  return { ...state, loadInfo }
}
