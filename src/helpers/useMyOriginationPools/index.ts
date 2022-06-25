import axios from 'axios'
import { ORIGINATION_API_URL, TEST_NETWORKS } from 'config/constants'
import { useConnectedWeb3Context } from 'contexts'
import { useNetworkContext } from 'contexts/networkContext'
import { useEffect, useState } from 'react'
import { IOriginationPool } from 'types'
import { isTestnet } from 'utils/network'
import { Network } from 'utils/enums'

interface IState {
  isLoading: boolean
  tokenOffers: IOriginationPool[]
}

export const useMyTokenOffers = () => {
  const [state, setState] = useState<IState>({
    tokenOffers: [],
    isLoading: false,
  })

  const { chainId } = useNetworkContext()
  const { account } = useConnectedWeb3Context()

  const loadTokenOffers = async () => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const userTokenOffers = (
        await axios.get<any[]>(
          `${ORIGINATION_API_URL}/pools?userAddress=${account}`
        )
      ).data

      // Filter testnet pools on production and parse API data
      const filteredTokenOffers = isTestnet(chainId)
        ? userTokenOffers.filter((tokenOffer) =>
            TEST_NETWORKS.includes(tokenOffer.network as Network)
          )
        : userTokenOffers.filter(
            (tokenOffer) =>
              !TEST_NETWORKS.includes(tokenOffer.network as Network)
          )

      setState((prev) => ({
        ...prev,
        tokenOffers: filteredTokenOffers as IOriginationPool[],
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
