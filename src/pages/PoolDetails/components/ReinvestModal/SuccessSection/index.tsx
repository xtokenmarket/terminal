import { Button, makeStyles, Typography } from '@material-ui/core'
import { ICollectableFees, ITerminalPool } from 'types'
import { TxState } from 'utils/enums'
import { CollectableFees } from '../CollectableFees'

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
}))

interface IProps {
  onClose: () => void
  reinvestState: TxState
  poolData: ITerminalPool
  collectableFees: ICollectableFees
  resetTxState: () => void
}

export const SuccessSection = (props: IProps) => {
  const classes = useStyles()
  const { reinvestState, poolData, onClose, collectableFees, resetTxState } =
    props
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
        <Typography className={classes.title}>Reinvest confirmed!</Typography>
        <Typography className={classes.description}>
          You have successfully finished your Reinvest process! Below you can
          see details of your transaction.
        </Typography>
      </div>
      <CollectableFees
        token0Fee={collectableFees.token0Fee}
        token1Fee={collectableFees.token1Fee}
        poolData={poolData}
        reinvestState={reinvestState}
      />
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
