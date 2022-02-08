import { SimpleLoader, HeaderSection, PoolTable } from 'components'
import { useMyTerminalPools } from 'helpers'

const MyPools = () => {
  const { pools, loading } = useMyTerminalPools()

  const isLoading = loading && pools.length === 0
  return (
    <div>
      <HeaderSection />
      {/* TODO: this is commented out to stop runtime errors temporarily */}
      {/* {isLoading ? <SimpleLoader /> : <PoolTable addresses={pools} />} */}
    </div>
  )
}

export default MyPools
