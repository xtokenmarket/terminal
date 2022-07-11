import axios from 'axios'
import { ChainId, TERMINAL_API_URL } from 'config/constants'
import { useNetworkContext } from 'contexts/networkContext'
import { useEffect, useState } from 'react'
import { ITerminalPool } from 'types'
import { Network } from 'utils/enums'
import { isTestnet } from 'utils/network'
import { fetchQuery } from 'utils/thegraph'
import { parsePools, POOLS_QUERY } from './helper'

interface IState {
  isLoading: boolean
  pools: ITerminalPool[]
}

const testNetworks = [Network.KOVAN, Network.GOERLI]
const MINING_NETWORKS = [
  Network.MAINNET,
  Network.ARBITRUM,
  Network.OPTIMISM,
  Network.POLYGON,
  Network.KOVAN,
  Network.GOERLI,
]

export const useTerminalPools = () => {
  const [state, setState] = useState<IState>({ pools: [], isLoading: true })
  const { chainId } = useNetworkContext()

  const loadPools = async () => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const { data: pools } = await axios.get<any[]>(
        `${TERMINAL_API_URL}/pools`
      )

      const filteredPools = getFilteredPools(pools, chainId, true)

      setState((prev) => ({
        ...prev,
        pools: filteredPools as ITerminalPool[],
        isLoading: false,
      }))
    } catch (error) {
      try {
        const graphqlUrls = MINING_NETWORKS.map(
          (network: string) =>
            `https://api.thegraph.com/subgraphs/name/xtokenmarket/terminal-${network}`
        )
        let pools = await Promise.all(
          graphqlUrls.map((url: string) => fetchQuery(POOLS_QUERY, {}, url))
        )
        pools = pools
          .map((p: any, index: number) => {
            const _network = graphqlUrls[index].split('terminal-')[1]
            return parsePools(p, _network as Network)
          })
          .flat()
        const filteredPools = getFilteredPools(pools, chainId, false)
        setState((prev) => ({
          ...prev,
          pools: filteredPools,
          isLoading: false,
        }))
      } catch (e) {
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    }
  }

  useEffect(() => {
    setState((prev) => ({ ...prev, pools: [], isLoading: true }))
    loadPools()
  }, [chainId])

  return state
}

const getFilteredPools = (
  pools: any[],
  chainId: ChainId,
  isApiData: boolean
) => {
  if (isApiData) {
    pools = pools.map(({ poolAddress: address, ...pool }) => ({
      address,
      ...pool,
    }))
  }
  // Filter testnet pools on production and parse pool data
  let filteredPools = isTestnet(chainId)
    ? pools.filter((pool) => testNetworks.includes(pool.network as Network))
    : pools.filter((pool) => !testNetworks.includes(pool.network as Network))
  if (!isTestnet(chainId)) {
    filteredPools = filteredPools.filter(
      (pool) =>
        !(
          pool.network === Network.MAINNET &&
          pool.address.toLowerCase() ===
            '0x6148a1bd2be586e981115f9c0b16a09bbc271e2c'
        ) // CitaDAO Mainnet pool
    )
  }
  return filteredPools
}
