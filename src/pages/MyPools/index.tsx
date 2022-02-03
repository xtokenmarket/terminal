import { SimpleLoader, HeaderSection, PoolTable } from 'components'
import { useMyTerminalPools } from 'helpers'

const MyPools = () => {
  const { pools, loading } = useMyTerminalPools()

  const isLoading = loading && pools.length === 0
  return (
    <div>
      <HeaderSection />
      {isLoading ? <SimpleLoader /> : <PoolTable addresses={pools} />}
    </div>
  )
}

export default MyPools
