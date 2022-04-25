import { useEffect, useState } from 'react'
import Abi from 'abis'
import axios from 'axios'
import { constants } from 'ethers'
import { knownTokens, getTokenFromAddress } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { useNetworkContext } from 'contexts/networkContext'
import { useServices } from 'helpers'
import { Network } from 'utils/enums'
import { getOffersDataMulticall } from './helper'
import { IToken, ITokenOffer } from 'types'

interface IState {
  tokenOffer?: ITokenOffer
  loading: boolean
}

export const useTokenOffer = (poolAddress?: string, network?: Network) => {
  const { account, networkId, library: provider } = useConnectedWeb3Context()
  const { chainId } = useNetworkContext()
  const { multicall } = useServices(network)

  const [state, setState] = useState<IState>({ loading: true })

  const getContractTokenOfferData = async (
    poolAddress: string
  ): Promise<ITokenOffer> => {
    const _offerData = await getOffersDataMulticall(poolAddress, multicall)
    const tokens = await Promise.all([
      getTokenFromAddress(_offerData?.offerToken, networkId),
      getTokenFromAddress(_offerData?.purchaseToken, networkId),
    ])
    const ETH: IToken = {
      ...knownTokens.eth,
      address: constants.AddressZero,
    }

    return {
      ..._offerData,
      // TODO: remove this hardcoded value
      network: Network.KOVAN,
      offerToken: tokens[0] ? tokens[0] : ETH,
      purchaseToken: tokens[1] ? tokens[1] : ETH,
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
    const interval = setInterval(loadInfo, 2 * 1000)

    return () => clearInterval(interval)
  }, [networkId, poolAddress, account])

  return { ...state, loadInfo }
}
