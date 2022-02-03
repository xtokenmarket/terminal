import { useConnectedWeb3Context } from 'contexts'
import { useMyTerminalPools, useTerminalPools } from 'helpers'
import React from 'react'

import { createContextWithDefault } from 'utils/reactContext'

interface PoolsContextType {
  pools: string[]
  isLoading: boolean
}

const [PoolsContext, usePoolsContext] = createContextWithDefault<PoolsContextType>()

const PoolsContextProvider: React.FC = ({ children }) => {
  const { account } = useConnectedWeb3Context()
  // all of this will be replaced. for now it is used
  // to make sure everything works in the meantime
  const { pools, loading: isLoading } = useTerminalPools()

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