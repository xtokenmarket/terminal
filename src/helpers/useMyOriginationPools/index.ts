import axios from 'axios'
import { ORIGINATION_API_URL } from 'config/constants'
import { useConnectedWeb3Context } from 'contexts'
import { useNetworkContext } from 'contexts/networkContext'
import { useEffect, useState } from 'react'
import { IOriginationPool, ITokenOffer } from 'types'
import { isTestnet, isTestNetwork } from 'utils/network'

interface IState {
  isLoading: boolean
  tokenOffers: IOriginationPool[]
}

export const useMyTokenOffers = () => {
  const [state, setState] = useState<IState>({
    tokenOffers: [],
    isLoading: true,
  })

  const { chainId } = useNetworkContext()
  const { account, library: provider } = useConnectedWeb3Context()

  const getFilteredOffers = (offers: ITokenOffer[] = []) =>
    offers.filter((offer: ITokenOffer) =>
      isTestnet(chainId)
        ? isTestNetwork(offer.network)
        : !isTestNetwork(offer.network)
    )

  const loadTokenOffers = async () => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const { data: pools } = await axios.get<any[]>(
        `${ORIGINATION_API_URL}/pools`
      )

      const userTokenOffers = pools.filter(
        (offer) =>
          offer.owner.toLowerCase() === account?.toLowerCase() ||
          offer.manager.toLowerCase() === account?.toLowerCase()
      )

      setState((prev) => ({
        ...prev,
        tokenOffers: userTokenOffers,
        isLoading: false,
      }))
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  useEffect(() => {
    loadTokenOffers()
  }, [chainId, account])

  return state
}
