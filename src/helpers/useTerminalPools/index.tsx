import axios from 'axios'
import { TERMINAL_API_URL } from 'config/constants'
import { useNetworkContext } from 'contexts/networkContext'
import { useEffect, useState } from 'react'
import { ITerminalPool } from 'types'
import { Network } from 'utils/enums'
import { isTestnet } from 'utils/network'
import { fetchQuery } from 'utils/thegraph'
import { GRAPHQL_URLS, NETWORKS, parsePools, POOLS_QUERY } from './helper'

interface IState {
  isLoading: boolean
  pools: ITerminalPool[]
}

const testNetworks = [Network.KOVAN, Network.RINKEBY]

export const useTerminalPools = () => {
  const [state, setState] = useState<IState>({ pools: [], isLoading: true })
  const { chainId } = useNetworkContext()

  const loadPools = async () => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const { data: pools } = await axios.get<ITerminalPool[]>(
        `${TERMINAL_API_URL}/pools`
      )
      const filteredPools = isTestnet(chainId)
        ? pools.filter((pool) => testNetworks.includes(pool.network as Network))
        : pools.filter(
            (pool) => !testNetworks.includes(pool.network as Network)
          )
      setState((prev) => ({
        ...prev,
        pools: filteredPools,
        isLoading: false,
      }))
    } catch (error) {
      try {
        let pools = await Promise.all(
          GRAPHQL_URLS.map((url: string) => fetchQuery(POOLS_QUERY, {}, url))
        )
        pools = pools
          .map((p: any, index: number) => parsePools(p, NETWORKS[index]))
          .flat()
        const filteredPools = isTestnet(chainId)
          ? pools.filter((pool) =>
              testNetworks.includes(pool.network as Network)
            )
          : pools.filter(
              (pool) => !testNetworks.includes(pool.network as Network)
            )
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
