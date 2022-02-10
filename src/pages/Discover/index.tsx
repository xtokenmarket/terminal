import { SimpleLoader, HeaderSection, PoolTable } from 'components'
import { useTerminalPools } from 'helpers'

const Discover = () => {
  const { isLoading, pools } = useTerminalPools()
  const loading = isLoading && pools.length === 0

  return (
    <div>
      <HeaderSection />
      {loading ? <SimpleLoader /> : <PoolTable pools={pools} />}
    </div>
  )
}

export default Discover
