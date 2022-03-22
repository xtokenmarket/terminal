import axios from 'axios'
import { TERMINAL_API_URL } from 'config/constants'
import { useNetworkContext } from 'contexts/networkContext'
import { useEffect, useState } from 'react'
import { ITerminalPool } from 'types'
import { waitSeconds } from 'utils'
import { Network } from 'utils/enums'
import { isTestnet } from 'utils/network'

interface IState {
  isLoading: boolean
  pools: ITerminalPool[]
}

export const useTerminalPools = () => {
  const [state, setState] = useState<IState>({ pools: [], isLoading: true })
  const { chainId } = useNetworkContext()

  const loadPools = async (testnet: boolean) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      await waitSeconds(1)
      const { data: pools } = await axios.get<ITerminalPool[]>(
        `${TERMINAL_API_URL}/pools`
      )
      const testNetworks = [Network.KOVAN, Network.RINKEBY]
      const filteredPools = testnet
        ? pools.filter((pool) => testNetworks.includes(pool.network!))
        : pools.filter((pool) => !testNetworks.includes(pool.network!))
      setState((prev) => ({
        ...prev,
        pools: filteredPools,
        isLoading: false,
      }))
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  useEffect(() => {
    setState((prev) => ({ ...prev, pools: [], isLoading: true }))
    loadPools(isTestnet(chainId))
  }, [chainId])

  return state
}
