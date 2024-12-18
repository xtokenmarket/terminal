import { SimpleLoader, HeaderSection, PoolTable } from 'components'
import { useMyTerminalPools } from 'helpers'
import { makeStyles, Button } from '@material-ui/core'
import { useHistory } from 'react-router'
import { useConnectedWeb3Context } from 'contexts'
import { useNetworkContext } from 'contexts/networkContext'
import { IS_PROD } from 'config/constants'
import { isTestnet } from 'utils/network'
import { useState } from 'react'

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    height: '300px',
  },
  title: {
    color: theme.colors.white,
    fontFamily: 'Gilmer',
    fontWeight: 700,
    fontSize: 25,
  },
  description: {
    color: theme.colors.primary100,
    fontFamily: 'Gilmer Regular',
    fontSize: 15,
    margin: 20,
  },
  button: { height: 48, margin: 20, width: 180 },
  connect: {
    marginTop: 100,
    background: theme.colors.primary,
    borderRadius: 4,
    height: 40,
    [theme.breakpoints.down(theme.custom.xsss)]: {
      height: 36,
    },
  },
}))

const MyPools = () => {
  const [search, setSearch] = useState('')
  const { pools, loading } = useMyTerminalPools()
  const { account, setWalletConnectModalOpened } = useConnectedWeb3Context()
  const { chainId } = useNetworkContext()
  const history = useHistory()
  const classes = useStyles()

  const isLoading = loading && pools.length === 0
  const isConnected = !!account
  const isProdTestNet = IS_PROD && isTestnet(chainId)

  const onCreatePool = () => {
    history.push('/mining/new-pool')
  }

  const onBrowsePool = () => {
    history.push('/mining/discover')
  }

  const NoTestNetSupport = () => (
    <div className={classes.root}>
      <div className={classes.title}>We don't support it on this network</div>
    </div>
  )

  const NoPools = () => (
    <div className={classes.root}>
      <div className={classes.title}>You have no pools yet.</div>{' '}
      <div className={classes.description}>
        Browse pools, add liquidity and earn rewards, or Create your own pool.
      </div>
      <div>
        <Button
          className={classes.button}
          color="secondary"
          fullWidth
          onClick={onBrowsePool}
          variant="contained"
        >
          BROWSE POOLS
        </Button>
        {isConnected && (
          <Button
            className={classes.button}
            color="primary"
            fullWidth
            onClick={onCreatePool}
            variant="contained"
          >
            CREATE POOL
          </Button>
        )}
      </div>
    </div>
  )

  const ConnectButton = () => {
    return (
      <div className={classes.root}>
        <Button
          className={classes.connect}
          color="primary"
          variant="contained"
          onClick={() => setWalletConnectModalOpened(true)}
        >
          CONNECT WALLET
        </Button>
      </div>
    )
  }

  return (
    <div>
      {isProdTestNet ? (
        <NoTestNetSupport />
      ) : (
        <>
          {isConnected ? (
            <>
              <HeaderSection onSearch={setSearch} />
              {isLoading ? (
                <SimpleLoader />
              ) : pools.length === 0 ? (
                <NoPools />
              ) : (
                <PoolTable pools={pools} search={search} />
              )}
            </>
          ) : (
            <ConnectButton />
          )}
        </>
      )}
    </div>
  )
}

export default MyPools
