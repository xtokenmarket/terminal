import { PageWrapper, PageHeader, PageContent, SimpleLoader } from 'components'
import { useConnectedWeb3Context } from 'contexts'
import { useTerminalPool } from 'helpers'
import { useEffect } from 'react'
import { useHistory, useParams } from 'react-router'
import { isAddress } from 'utils/tools'
import { getNetworkFromId } from 'utils/network'
import { NetworkId } from 'types'

import { Content } from './components'
import { Typography } from '@material-ui/core'

const PoolDetails = () => {
  const history = useHistory()
  const params = useParams()
  const { account, networkId } = useConnectedWeb3Context()

  const { id: poolAddress, network } = params as any

  const {
    loadInfo,
    loading,
    pool: poolData,
  } = useTerminalPool(undefined, poolAddress, network, true)

  const onBack = () => {
    history.push('/mining/discover')
  }

  useEffect(() => {
    if (!isAddress(poolAddress)) {
      onBack()
    }
    // Redirect user back to `Discover` page, if user isn't logged in
    if (!loading && !poolData && !account) {
      onBack()
    }
  }, [account, poolAddress, loading, poolData])

  // TODO: Display switch `network` button
  if (networkId && getNetworkFromId(networkId as NetworkId) !== network) {
    return (
      <Typography color="error">
        Switch network to {network.toUpperCase()}
      </Typography>
    )
  }

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
