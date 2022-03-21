import axios from 'axios'
import { TERMINAL_API_URL } from 'config/constants'
import { useConnectedWeb3Context } from 'contexts'
import { useEffect, useState } from 'react'
import { NetworkId } from 'types'
import { waitSeconds } from 'utils'
import { getNetworkFromId } from 'utils/network'

interface IState {
  isLoading: boolean
  pools: any[]
}

export const useTerminalPools = () => {
  const [state, setState] = useState<IState>({ pools: [], isLoading: true })
  const { networkId } = useConnectedWeb3Context()

  const loadPools = async (network: string) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      await waitSeconds(1)
      const pools = (
        await axios.get(`${TERMINAL_API_URL}/pools?network=${network}`)
      ).data
      setState((prev) => ({
        ...prev,
        pools,
        isLoading: false,
      }))
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  useEffect(() => {
    setState((prev) => ({ ...prev, pools: [], isLoading: true }))
    loadPools(getNetworkFromId(networkId as NetworkId))
  }, [networkId])

  return state
}
