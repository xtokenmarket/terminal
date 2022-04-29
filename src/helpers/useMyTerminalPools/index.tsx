import axios from 'axios'
import { useConnectedWeb3Context } from 'contexts'
import { useEffect, useState } from 'react'
import { waitSeconds } from 'utils'
import { TERMINAL_API_URL } from 'config/constants'
import { ITerminalPool } from 'types'

interface IState {
  loading: boolean
  pools: ITerminalPool[]
}

export const useMyTerminalPools = () => {
  const [state, setState] = useState<IState>({ pools: [], loading: true })
  const { account, networkId } = useConnectedWeb3Context()

  const loadPools = async () => {
    setState((prev) => ({ ...prev, loading: true }))
    try {
      await waitSeconds(1)

      if (account) {
        let userPools = (
          await axios.get<any[]>(
            `${TERMINAL_API_URL}/pools?userAddress=${account}`
          )
        ).data
        userPools = userPools.map(({ poolAddress: address, ...pool }) => ({
          address,
          ...pool,
        }))

        setState((prev) => ({
          ...prev,
          pools: userPools as ITerminalPool[],
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
