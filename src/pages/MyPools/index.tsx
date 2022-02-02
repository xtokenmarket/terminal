import { SimpleLoader, HeaderSection, PoolTable } from 'components'
import { usePoolsContext } from 'contexts/pools'

const MyPools = () => {
  const { myPoolsLoading, myPools } = usePoolsContext()

  const isLoading = myPoolsLoading && myPools.length === 0
  return (
    <div>
      <HeaderSection />
      {isLoading ? <SimpleLoader /> : <PoolTable addresses={myPools} />}
    </div>
  )
}

export default MyPools
