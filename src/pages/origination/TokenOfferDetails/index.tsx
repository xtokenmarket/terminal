import { PageWrapper, PageHeader, PageContent, SimpleLoader } from 'components'
import { useOriginationPool } from 'helpers/useOriginationPool'
import { useHistory, useParams } from 'react-router'

type RouteParams = {
  network: string
  poolAddress: string
}

const TokenSaleDetails = () => {
  const history = useHistory()
  const { poolAddress } = useParams<RouteParams>()
  const { tokenOffer } = useOriginationPool(poolAddress)

  return (
    <PageWrapper>
      <PageHeader
        headerTitle=" "
        backVisible
        onBack={() => history.push('/origination/discover')}
      />
      <PageContent>
        {!tokenOffer ? (
          <SimpleLoader />
        ) : (
          <div>{JSON.stringify(tokenOffer)}</div>
        )}
      </PageContent>
    </PageWrapper>
  )
}

export default TokenSaleDetails
