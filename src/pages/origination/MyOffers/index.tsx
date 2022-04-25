import { SimpleLoader } from 'components'
import { makeStyles, Button } from '@material-ui/core'
import { useHistory } from 'react-router'
import { useConnectedWeb3Context } from 'contexts'
import { useNetworkContext } from 'contexts/networkContext'
import { IS_PROD } from 'config/constants'
import { isTestnet } from 'utils/network'
import { useMyTokenOffers } from 'helpers/useMyOriginationPools'
import { OfferingTable, HeaderSection } from '../Discover/components/table'

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

const MyOffers = () => {
  const { tokenOffers, isLoading } = useMyTokenOffers()
  const { account, setWalletConnectModalOpened } = useConnectedWeb3Context()
  const { chainId } = useNetworkContext()
  const loading = isLoading && tokenOffers.length === 0
  const isProdTestNet = IS_PROD && isTestnet(chainId)
  const classes = useStyles()
  const history = useHistory()
  const isConnected = !!account

  const onCreateTokenSale = () => {
    history.push('/origination/new-token-sale')
  }

  const onBrowseSales = () => {
    history.push('/origination/discover')
  }

  const NoTestNetSupport = () => (
    <div className={classes.root}>
      <div className={classes.title}>We don't support it on this network</div>
    </div>
  )

  const NoPools = () => (
    <div className={classes.root}>
      <div className={classes.title}>You have no sales yet.</div>{' '}
      <div className={classes.description}>
        Browse token offers, or Create your own sales.
      </div>
      <div>
        <Button
          className={classes.button}
          color="secondary"
          fullWidth
          onClick={onBrowseSales}
          variant="contained"
        >
          BROWSE OFFERS
        </Button>
        {isConnected && (
          <Button
            className={classes.button}
            color="primary"
            fullWidth
            onClick={onCreateTokenSale}
            variant="contained"
          >
            CREATE SALE
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
              <HeaderSection />
              {loading ? (
                <SimpleLoader />
              ) : tokenOffers.length === 0 ? (
                <NoPools />
              ) : (
                <OfferingTable offerings={tokenOffers} />
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

export default MyOffers
