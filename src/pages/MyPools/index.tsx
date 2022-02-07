import { SimpleLoader, HeaderSection, PoolTable } from 'components'
import { useMyTerminalPools } from 'helpers'

const MyPools = () => {
  const { pools, loading } = useMyTerminalPools()

  const isLoading = loading && pools.length === 0
  const addresses = pools.map((pool) => pool.address)

  // TODO: Display `Connect Wallet` button, if not logged in
  return (
    <div>
      <HeaderSection />
      {isLoading ? (
        <SimpleLoader />
      ) : (
        <PoolTable addresses={addresses} pools={pools} />
      )}
    </div>
  )
}

export default MyPools
