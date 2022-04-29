import { SimpleLoader, HeaderSection, PoolTable } from 'components'
import { IS_PROD, PROD_TESTNET_DISCOVER_PAGE_SIZE } from 'config/constants'
import { useNetworkContext } from 'contexts/networkContext'
import { useTerminalPools } from 'helpers'
import { isTestnet } from 'utils/network'
import { useState } from 'react'

const Discover = () => {
  const [search, setSearch] = useState('')
  const { isLoading, pools } = useTerminalPools()
  const { chainId } = useNetworkContext()

  const loading = isLoading && pools.length === 0
  const isProdTestNet = IS_PROD && isTestnet(chainId)

  return (
    <div>
      <HeaderSection onSearch={setSearch} />
      {loading ? (
        <SimpleLoader />
      ) : (
        <PoolTable
          pools={
            isProdTestNet
              ? pools.slice(0, PROD_TESTNET_DISCOVER_PAGE_SIZE)
              : pools
          }
          search={search}
        />
      )}
    </div>
  )
}

export default Discover
