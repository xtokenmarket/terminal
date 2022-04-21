import { useEffect, useState } from 'react'
import Abi from 'abis'
import axios from 'axios'
import { constants } from 'ethers'
import { knownTokens } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { useNetworkContext } from 'contexts/networkContext'
import { useServices } from 'helpers'
import { Network } from 'utils/enums'
import { fetchUnknownToken } from 'utils/token'
import { getOffersDataMulticall } from './helper'
import { IToken, ITokenOffer } from 'types'

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
  }

  useEffect(() => {
    loadInfo()
    const interval = setInterval(loadInfo, 2 * 1000)

    return () => clearInterval(interval)
  }, [networkId, tokenOfferPoolAddress, account])

  return { ...state, loadInfo }
}
