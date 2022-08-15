import { Button, makeStyles, Typography } from '@material-ui/core'
import { ViewTransaction } from 'components'

const ICON_SIZE = 150

const useStyles = makeStyles((theme) => ({
  root: { paddingTop: ICON_SIZE / 2 },
  header: {
    backgroundColor: theme.colors.primary500,
    padding: 32,
    paddingBottom: 16,
    paddingTop: ICON_SIZE / 2,
    textAlign: 'center',
    position: 'relative',
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
  actions: {
    padding: 32,
    backgroundColor: theme.colors.primary500,
  },
  transaction: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary500,
  },
}))

interface IProps {
  onClose: () => void
  tx: string
  resetTxState: () => void
}

export const SuccessSection = (props: IProps) => {
  const classes = useStyles()
  const { tx, onClose, resetTxState } = props
  const _onClose = () => {
    onClose()
    resetTxState()
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <img
          alt="check"
          src="/assets/icons/confirmed.png"
          className={classes.img}
        />
        <Typography className={classes.title}>Allowlist set!</Typography>
        <Typography className={classes.description}>
          You have successfully set your allowlist! Below you can see details of
          your transaction.
        </Typography>
      </div>
      <div className={classes.transaction}>
        <ViewTransaction txId={tx} />
      </div>
      <div className={classes.actions}>
        <Button
          color="primary"
          variant="contained"
          fullWidth
          onClick={_onClose}
        >
          DONE
        </Button>
      </div>
    </div>
  )
}
