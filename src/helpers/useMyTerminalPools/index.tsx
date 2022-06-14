import axios from 'axios'
import { useConnectedWeb3Context, useNetworkContext } from 'contexts'
import { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import { TERMINAL_API_URL } from 'config/constants'
import { ITerminalPool } from 'types'
import { isTestnet } from 'utils/network'
import { Network } from 'utils/enums'

interface IState {
  loading: boolean
  pools: ITerminalPool[]
}

const testNetworks = [Network.KOVAN, Network.GOERLI]

export const useMyTerminalPools = () => {
  const [state, setState] = useState<IState>({ pools: [], loading: true })
  const { account, networkId } = useConnectedWeb3Context()
  const { chainId } = useNetworkContext()
  const { enqueueSnackbar } = useSnackbar()

  const loadPools = async () => {
    setState((prev) => ({ ...prev, loading: true }))

    try {
      if (account) {
        const userPools = (
          await axios.get<any[]>(
            `${TERMINAL_API_URL}/pools?userAddress=${account}`
          )
        ).data

        // Filter testnet pools on production and parse API data
        let filteredPools = isTestnet(chainId)
          ? userPools.filter((pool) =>
              testNetworks.includes(pool.network as Network)
            )
          : userPools.filter(
              (pool) => !testNetworks.includes(pool.network as Network)
            )
        filteredPools = filteredPools.map(
          ({ poolAddress: address, ...pool }) => ({
            address,
            ...pool,
          })
        )

        setState((prev) => ({
          ...prev,
          pools: filteredPools as ITerminalPool[],
          loading: false,
        }))
      } else {
        setState((prev) => ({ ...prev, loading: false }))
      }
    } catch (error) {
      enqueueSnackbar('Error while fetching pools data. Please try again!', {
        variant: 'error',
      })
      setState((prev) => ({ ...prev, loading: false }))
    }
  }

  useEffect(() => {
    setState((prev) => ({ ...prev, pools: [], loading: true }))
    loadPools()
  }, [networkId])

  return state
}
