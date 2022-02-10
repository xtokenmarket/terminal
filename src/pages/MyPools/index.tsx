import { SimpleLoader, HeaderSection, PoolTable } from 'components'
import { useMyTerminalPools } from 'helpers'

const MyPools = () => {
  const { pools, loading } = useMyTerminalPools()

  const isLoading = loading && pools.length === 0

  // TODO: Display `Connect Wallet` button, if not logged in
  return (
    <div>
      <HeaderSection />
      {isLoading ? <SimpleLoader /> : <PoolTable pools={pools} />}
    </div>
  )
}

export default MyPools
