import { HeaderSection, OfferingTable } from './components/table'
import { SimpleLoader } from 'components'
import { IS_PROD, PROD_TESTNET_DISCOVER_PAGE_SIZE } from 'config/constants'
import { useNetworkContext } from 'contexts/networkContext'
import { isTestnet } from 'utils/network'
import { useTokenOffers } from 'helpers/useTokenOffers'

const Discover = () => {
  const { tokenOffers, isLoading } = useTokenOffers()
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
