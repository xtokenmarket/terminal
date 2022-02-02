import { useConnectedWeb3Context } from 'contexts'
import { useMyTerminalPools, useTerminalPools } from 'helpers'
import React from 'react'

import { createContextWithDefault } from 'utils/reactContext'

interface PoolsContextType {
  poolsLoading: boolean
  pools: string[]
  myPoolsLoading: boolean
  myPools: string[]
}

const [PoolsContext, usePoolsContext] = createContextWithDefault<PoolsContextType>()

const PoolsContextProvider: React.FC = ({ children }) => {
  const { account } = useConnectedWeb3Context()
  // all of this will be replaced. for now it is used
  // to make sure everything works in the meantime
  const { pools, loading: poolsLoading } = useTerminalPools()
  const { pools: myPools, loading: myPoolsLoading } = useMyTerminalPools()

  const value = {
    poolsLoading,
    pools,
    myPools,
    myPoolsLoading,
  }
  return (
    <PoolsContext.Provider value={value}>
      {children}
    </PoolsContext.Provider>
  )
}

export { PoolsContextProvider, usePoolsContext }