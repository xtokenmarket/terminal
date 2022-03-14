import { SimpleLoader, HeaderSection, PoolTable } from 'components'
import { useMyTerminalPools } from 'helpers'
import { makeStyles, Button } from '@material-ui/core'
import { useHistory } from 'react-router'
import { useConnectedWeb3Context } from 'contexts'

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
}))

const MyPools = () => {
  const { pools, loading } = useMyTerminalPools()
  const history = useHistory()
  const classes = useStyles()
  const isLoading = loading && pools.length === 0

  const { account } = useConnectedWeb3Context()
  const isConnected = !!account

  const onCreatePool = () => {
    history.push('/mining/new-pool')
  }

  const onBrowsePool = () => {
    history.push('/mining/discover')
  }

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

  // TODO: Display `Connect Wallet` button, if not logged in
  return (
    <div>
      <HeaderSection />
      {isLoading ? (
        <SimpleLoader />
      ) : pools.length === 0 ? (
        <NoPools />
      ) : (
        <PoolTable pools={pools} />
      )}
    </div>
  )
}

export default MyPools
