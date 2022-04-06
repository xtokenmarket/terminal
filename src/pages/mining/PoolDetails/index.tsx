import { Button, makeStyles } from '@material-ui/core'
import { PageWrapper, PageHeader, PageContent, SimpleLoader } from 'components'
import { useConnectedWeb3Context } from 'contexts'
import { useTerminalPool } from 'helpers'
import { useCallback, useEffect } from 'react'
import { useHistory, useParams } from 'react-router'
import { useNetworkContext } from 'contexts'
import { isAddress } from 'utils/tools'
import { getIdFromNetwork, getNetworkFromId } from 'utils/network'
import { NetworkId } from 'types'

import { Content } from './components'

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    height: '300px',
  },
  button: { height: 48, margin: 20, width: 220 },
}))

const PoolDetails = () => {
  const history = useHistory()
  const params = useParams()
  const classes = useStyles()
  const { account, networkId } = useConnectedWeb3Context()
  const { switchChain } = useNetworkContext()

  const { id: poolAddress, network } = params as any

  const {
    clrService,
    loadInfo,
    loading,
    pool: poolData,
  } = useTerminalPool(undefined, poolAddress, network, true)

  const onBack = () => {
    history.push('/mining/discover')
  }

  const handleNetworkChange = useCallback(async () => {
    await switchChain(getIdFromNetwork(network))
  }, [switchChain])

  useEffect(() => {
    if (!isAddress(poolAddress)) {
      onBack()
    }
    // Redirect user back to `Discover` page, if user isn't logged in
    if (!loading && !poolData && !account) {
      onBack()
    }
  }, [account, poolAddress, loading, poolData])

  if (networkId && getNetworkFromId(networkId as NetworkId) !== network) {
    return (
      <div className={classes.root}>
        <Button
          className={classes.button}
          color="primary"
          fullWidth
          onClick={handleNetworkChange}
          variant="contained"
        >
          SWITCH TO {network.toUpperCase()}
        </Button>
      </div>
    )
  }

  return (
    <PageWrapper>
      <PageHeader headerTitle=" " backVisible onBack={onBack} />
      <PageContent>
        {isAddress(poolAddress) &&
          (!poolData || !clrService ? (
            <SimpleLoader />
          ) : (
            <Content
              poolData={poolData}
              reloadTerminalPool={loadInfo}
              clrService={clrService}
            />
          ))}
      </PageContent>
    </PageWrapper>
  )
}

export default PoolDetails
