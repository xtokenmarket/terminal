import axios from 'axios'
import { ChainId, ORIGINATION_API_URL } from 'config/constants'
import { useNetworkContext } from 'contexts/networkContext'
import { useEffect, useState } from 'react'
import { IOriginationPool } from 'types'
import { isTestnet, isTestNetwork } from 'utils/network'
import { fetchQuery } from 'utils/thegraph'
import { Network } from 'utils/enums'

import { parseTokenOffers, TOKEN_OFFERS_QUERY } from './helper'

interface IState {
  isLoading: boolean
  tokenOffers: IOriginationPool[]
}

const ORIGINATION_NETWORKS = [
  Network.MAINNET,
  Network.ARBITRUM,
  Network.OPTIMISM,
  Network.POLYGON,
  Network.GOERLI,
]

export const useOriginationPools = () => {
  const [state, setState] = useState<IState>({
    tokenOffers: [],
    isLoading: true,
  })
  const { chainId } = useNetworkContext()

  const loadTokenOffers = async () => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const { data: pools } = await axios.get<any[]>(
        `${ORIGINATION_API_URL}/pools`
      )

      const tokenOffers = getFilteredOffers(pools, chainId)

      setState((prev) => ({
        ...prev,
        tokenOffers,
        isLoading: false,
      }))
    } catch (error) {
      try {
        const graphqlUrls = ORIGINATION_NETWORKS.map(
          (network: string) =>
            `https://api.thegraph.com/subgraphs/name/xtokenmarket/origination-${network}`
        )
        let pools = await Promise.all(
          graphqlUrls.map((url: string) =>
            fetchQuery(TOKEN_OFFERS_QUERY, {}, url)
          )
        )
        pools = pools
          .map((p: any, index: number) => {
            const _network = graphqlUrls[index].split('origination-')[1]
            return parseTokenOffers(p, _network as Network)
          })
          .flat()

        const tokenOffers = getFilteredOffers(pools, chainId)

        setState((prev) => ({
          ...prev,
          tokenOffers,
          isLoading: false,
        }))
      } catch (e) {
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    }
  }

  useEffect(() => {
    loadTokenOffers()
  }, [chainId])

  return state
}

const getFilteredOffers = (offers: IOriginationPool[], chainId: ChainId) =>
  offers.filter((offer: IOriginationPool) =>
    isTestnet(chainId)
      ? isTestNetwork(offer.network)
      : !isTestNetwork(offer.network)
  )
