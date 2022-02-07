import axios from 'axios'
import { useConnectedWeb3Context } from 'contexts'
import { useEffect, useState } from 'react'
import { waitSeconds } from 'utils'
import { TERMINAL_API_URL } from 'config/constants'

interface IState {
  pools: any[]
  loading: boolean
}

export const useMyTerminalPools = () => {
  const [state, setState] = useState<IState>({ pools: [], loading: true })
  const { account, networkId } = useConnectedWeb3Context()

  const loadPools = async () => {
    setState((prev) => ({ ...prev, loading: true }))
    try {
      await waitSeconds(1)
      if (account) {
        const userPools = await axios.get(
          `${TERMINAL_API_URL}/pools?userAddress=${account}`
        )
        console.log('userPools', userPools.data)

        setState((prev) => ({
          ...prev,
          pools: userPools.data,
          loading: false,
        }))
      } else {
        setState((prev) => ({ ...prev, loading: false }))
      }
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }

  useEffect(() => {
    setState((prev) => ({ ...prev, pools: [], loading: true }))
    loadPools()
  }, [networkId])

  return state
}
