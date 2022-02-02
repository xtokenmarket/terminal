import { SimpleLoader, HeaderSection, PoolTable } from 'components'
import { usePoolsContext } from 'contexts/pools'

const Discover = () => {
  const { poolsLoading, pools } = usePoolsContext()
  const isLoading = poolsLoading && pools.length === 0
  return (
    <div>
      <HeaderSection />
      {isLoading ? <SimpleLoader /> : <PoolTable addresses={pools} />}
    </div>
  )
}

export default Discover
