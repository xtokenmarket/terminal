import React, { useState } from 'react'

import { createContextWithDefault } from 'utils/reactContext'

interface PoolsContextType {
  pools: any[]
}

const [PoolsContext, usePoolsContext] = createContextWithDefault<PoolsContextType>()

const PoolsContextProvider: React.FC = ({ children }) => {
  const [pools, setPools] = useState([])

  const value = {
    pools
  }
  return (
    <PoolsContext.Provider value={value}>
      {children}
    </PoolsContext.Provider>
  )
}

export { PoolsContextProvider, usePoolsContext }