import { Button, makeStyles, Typography } from '@material-ui/core'
import { IOfferingOverview } from 'types'
import { TokenIcon, ViewTransaction } from 'components'

const ICON_SIZE = 150

const useStyles = makeStyles((theme) => ({
  root: { paddingTop: ICON_SIZE / 2 },
  header: {
    backgroundColor: theme.colors.primary500,
    padding: 32,
    paddingBottom: 2,
    paddingTop: ICON_SIZE / 2,
    textAlign: 'center',
    position: 'relative',
    width: 600,
  },
  logos: {
    lineHeight: '48px',
    margin: '0 auto',
    verticalAlign: 'middle',
  },
  tokenIcon: {
    width: 48,
    height: 48,
    border: `6px solid ${theme.colors.primary400}`,
    position: 'relative',
    borderRadius: '50%',
    '&+&': {
      left: -16,
    },
  },
  img: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    position: 'absolute',
    top: -ICON_SIZE / 2,
    left: `calc(50% - ${ICON_SIZE / 2}px)`,
  },
  title: {
    color: theme.colors.white,
    fontWeight: 600,
    fontSize: 28,
    marginBottom: 24,
  },
  description: {
    fontSize: 15,
    marginBottom: 24,
    color: theme.colors.white,
  },
  transaction: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
  actions: {
    padding: 32,
    paddingTop: 2,
    backgroundColor: theme.colors.primary500,
  },
}))

interface IProps {
  onClose: () => void
  offerData: IOfferingOverview
  txHash: string
}

export const SuccessSection = (props: IProps) => {
  const classes = useStyles()
  const { offerData, onClose, txHash } = props

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <img
          alt="check"
          src="/assets/icons/confirmed.png"
          className={classes.img}
        />
        <div className={classes.logos}>
          <TokenIcon
            className={classes.tokenIcon}
            token={offerData.offerToken}
          />
          <TokenIcon
            className={classes.tokenIcon}
            token={offerData.purchaseToken}
          />
        </div>
        <Typography className={classes.title}>
          {`${offerData.offerToken.symbol}/${offerData.purchaseToken.symbol}`}{' '}
          offering invested!
        </Typography>
        <Typography className={classes.description}>
          You have successfully invested 100 {offerData.offerToken.symbol} for
          100 {offerData.purchaseToken?.symbol}.
        </Typography>
      </div>
      <div className={classes.actions}>
        <div className={classes.transaction}>
          <ViewTransaction txId={txHash} />
        </div>
        <Button color="primary" variant="contained" fullWidth onClick={onClose}>
          DONE
        </Button>
      </div>
    </div>
  )
}
