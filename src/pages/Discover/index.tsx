import { SimpleLoader, HeaderSection, PoolTable } from 'components'
import { usePoolsContext } from 'contexts/pools'

const Discover = () => {
  const { isLoading, pools } = usePoolsContext()
  const loading = isLoading && pools.length === 0
  return (
    <div>
      <HeaderSection />
      {loading ? <SimpleLoader /> : <PoolTable pools={pools} />}
    </div>
  )
}

export default Discover
