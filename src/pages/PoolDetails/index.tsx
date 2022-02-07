import { PageWrapper, PageHeader, PageContent, SimpleLoader } from 'components'
import { useTerminalPool, useTerminalPoolV2 } from 'helpers'
import { useEffect } from 'react'
import { useHistory, useParams } from 'react-router'
import { isAddress } from 'utils/tools'
import { Content } from './components'

const PoolDetails = () => {
  const history = useHistory()
  const params = useParams()

  const poolAddress = (params as any).id

  const { pool: poolData, loading, loadInfo } = useTerminalPool(poolAddress)

  // TODO: Replace `poolData` and `loadInfo`
  const { pool: poolDataV2 } = useTerminalPoolV2(undefined, poolAddress)

  const onBack = () => {
    history.push('/terminal/discover')
  }

  useEffect(() => {
    if (!isAddress(poolAddress)) {
      onBack()
    }
    if (!loading && !poolData) {
      onBack()
    }
  }, [poolAddress, loading, poolData])

  return (
    <PageWrapper>
      <PageHeader headerTitle=" " backVisible onBack={onBack} />
      <PageContent>
        {isAddress(poolAddress) &&
          (!poolData ? (
            <SimpleLoader />
          ) : (
            <Content poolData={poolData} reloadTerminalPool={loadInfo} />
          ))}
      </PageContent>
    </PageWrapper>
  )
}

export default PoolDetails
