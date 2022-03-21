import { SimpleLoader, HeaderSection, PoolTable } from 'components'
import { IS_PROD, PROD_TESTNET_DISCOVER_PAGE_SIZE } from 'config/constants'
import { useNetworkContext } from 'contexts/networkContext'
import { useTerminalPools } from 'helpers'
import { isTestNet } from 'utils/network'

const Discover = () => {
  const { isLoading, pools } = useTerminalPools()
  const loading = isLoading && pools.length === 0

  const { chainId } = useNetworkContext()
  const isProdTestNet = IS_PROD && isTestNet(chainId)

  return (
    <div>
      <HeaderSection />
      {loading ? (
        <SimpleLoader />
      ) : (
        <PoolTable
          pools={
            isProdTestNet
              ? pools.slice(0, PROD_TESTNET_DISCOVER_PAGE_SIZE)
              : pools
          }
        />
      )}
    </div>
  )
}

export default Discover
