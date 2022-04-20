import { HeaderSection, PoolTable } from './components/table'
import { SimpleLoader } from 'components'
import { IS_PROD, PROD_TESTNET_DISCOVER_PAGE_SIZE } from 'config/constants'
import { useNetworkContext } from 'contexts/networkContext'
import { useTerminalPools } from 'helpers'
import { isTestnet } from 'utils/network'

const pools = [
  {
    offerToken: {
      address: '0x016750ac630f711882812f24dba6c95b9d35856d',
      decimals: 6,
      image: '/assets/tokens/usdt.png',
      name: 'Tether USD',
      symbol: 'USDT',
    },
    purchaseToken: {
      address: '0x90410304D88E333710703aF6Ed6A14d5ef74575F',
      decimals: 18,
      image: '/assets/tokens/dai.png',
      name: 'DAI',
      symbol: 'DAI',
    },
    maxOffering: '1500000',
    remainingOffering: '497303',
    pricePerToken: '1.25',
    timeRemaining: '6D 19H 30M',
    vestingPeriod: '1 Year',
    vestingCliff: '3 Months',
  },
]

const Discover = () => {
  const { isLoading } = useTerminalPools()
  const loading = isLoading && pools.length === 0

  const { chainId } = useNetworkContext()
  const isProdTestNet = IS_PROD && isTestnet(chainId)

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
