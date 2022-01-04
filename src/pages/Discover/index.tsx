import { SimpleLoader, HeaderSection, PoolTable } from 'components'
import { useTerminalPools } from 'helpers'

const Discover = () => {
  const { pools: poolAddresses, loading } = useTerminalPools()
  return (
    <div>
      <HeaderSection />
      <PoolTable poolAddresses={poolAddresses} />
      {loading && poolAddresses.length === 0 && <SimpleLoader />}
    </div>
  )
}

export default Discover
