import { useConnectedWeb3Context } from 'contexts'
import { useTerminalPool } from 'helpers'
import React, { useEffect, useState } from 'react'
import { ITerminalPool } from 'types'

import { createContextWithDefault } from 'utils/reactContext'
import { usePoolsApi } from './api'

interface PoolsContextType {
  pools: ITerminalPool[]
  isLoading: boolean
}

const [PoolsContext, usePoolsContext] = createContextWithDefault<PoolsContextType>()

const PoolsContextProvider: React.FC = ({ children }) => {
  const { account } = useConnectedWeb3Context()
  const [isLoading, setIsLoading] = useState(true)
  const [pools, setPools] = useState<ITerminalPool[]>([])

  const testPool = useTerminalPool('0x85c5000b1e3cA99278edE665585b0d3e9f0bC6BD')
  const { pool } = testPool
  if (pool) {
    console.log('old pool:', pool)
  }

  const poolsApi = usePoolsApi()
  useEffect(() => {
    poolsApi.fetchAllPools().then(pools => {
      console.log('new pool:', pools[0])
      // TODO: This is commented to prevent runtime errors temporarily
      // setIsLoading(false)
      // setPools(pools)
    })
  }, [])

  const value = {
    pools,
    isLoading,
  }
  return (
    <PoolsContext.Provider value={value}>
      {children}
    </PoolsContext.Provider>
  )
}

export { PoolsContextProvider, usePoolsContext }