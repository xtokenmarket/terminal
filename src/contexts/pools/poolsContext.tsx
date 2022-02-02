import { useConnectedWeb3Context } from 'contexts'
import { useTerminalPools } from 'helpers'
import React from 'react'

import { createContextWithDefault } from 'utils/reactContext'

interface PoolsContextType {
  pools: string[]
  loading: boolean
}

const [PoolsContext, usePoolsContext] = createContextWithDefault<PoolsContextType>()

const PoolsContextProvider: React.FC = ({ children }) => {
  const { account } = useConnectedWeb3Context()
  const { pools, loading } = useTerminalPools()

  const value = {
    loading,
    pools,
  }
  return (
    <PoolsContext.Provider value={value}>
      {children}
    </PoolsContext.Provider>
  )
}

export { PoolsContextProvider, usePoolsContext }