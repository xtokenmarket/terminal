import axios from 'axios'
import { ChainId, GRAPHQL_URLS, TERMINAL_API_URL } from 'config/constants'
import { useNetworkContext } from 'contexts/networkContext'
import { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import { ITerminalPool } from 'types'
import { Network } from 'utils/enums'
import { isTestnet } from 'utils/network'
import { fetchQuery } from 'utils/thegraph'

import { parsePools, POOLS_QUERY } from './helper'

interface IState {
  isLoading: boolean
  pools: ITerminalPool[]
}

const testNetworks = [Network.KOVAN, Network.RINKEBY, Network.GOERLI]

export const useTerminalPools = () => {
  const [state, setState] = useState<IState>({ pools: [], isLoading: true })
  const { chainId } = useNetworkContext()
  const { enqueueSnackbar } = useSnackbar()

  const loadPools = async () => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const { data: pools } = await axios.get<any[]>(
        `${TERMINAL_API_URL}/pools`
      )

      const filteredPools = getFilteredPools(pools, chainId, true)

      setState({
        pools: filteredPools as ITerminalPool[],
        isLoading: false,
      })
    } catch (error) {
      try {
        const graphqlUrls = Object.values(GRAPHQL_URLS).filter(
          (url: string) => !!url
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
        setState({
          pools: filteredPools,
          isLoading: false,
        })
      } catch (e) {
        enqueueSnackbar('Error while fetching pools data. Please try again!', {
          variant: 'error',
        })
        setState((prev) => ({
          ...prev,
          isLoading: false,
        }))
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
          (
            (pool.network === Network.MAINNET &&
              [
                '0x6148a1bd2be586e981115f9c0b16a09bbc271e2c', // CitaDAO pool
                '0xc5f0237a2a2bb9dc60da73491ad39a1afc4c8b63', // frETH-WETH pool
                '0x7fc70abe76605d1ef1f7a5ddc5e2ad35a43a6949', // PONY-USDC pool
              ].includes(pool.address.toLowerCase())) ||
            (pool.network === Network.OPTIMISM &&
              pool.address.toLowerCase() ===
                '0x6148a1bd2be586e981115f9c0b16a09bbc271e2c')
          ) // OP-WETH pool
        )
    )
  }
  return filteredPools
}
