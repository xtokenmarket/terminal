import { SimpleLoader } from 'components'
import { IS_PROD, PROD_TESTNET_DISCOVER_PAGE_SIZE } from 'config/constants'
import { useNetworkContext } from 'contexts'
import { useOriginationPools } from 'helpers'
import { isTestnet } from 'utils/network'

import { HeaderSection, OfferingTable } from './components'

const Discover = () => {
  const { tokenOffers, isLoading } = useOriginationPools()
  const loading = isLoading && tokenOffers.length === 0

  const { chainId } = useNetworkContext()
  const isProdTestNet = IS_PROD && isTestnet(chainId)

  return (
    <div>
      <HeaderSection />
      {loading ? (
        <SimpleLoader />
      ) : (
        <OfferingTable
          offerings={
            isProdTestNet
              ? tokenOffers.slice(0, PROD_TESTNET_DISCOVER_PAGE_SIZE)
              : tokenOffers
          }
        />
      )}
    </div>
  )
}

export default Discover
