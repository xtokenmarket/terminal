import { Button, makeStyles, Typography } from '@material-ui/core'
import { ITerminalPool } from 'types'

import { OutputEstimation } from '../index'
import { IUnstakeState } from '../..'

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
  deposit: {},
  buy: { marginTop: 8 },
  actions: {
    padding: 32,
    backgroundColor: theme.colors.primary500,
  },
}))

interface IProps {
  onClose: () => void
  unstakeState: IUnstakeState
  poolData: ITerminalPool
}

export const SuccessSection = (props: IProps) => {
  const classes = useStyles()
  const { unstakeState, poolData, onClose } = props

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <img
          alt="check"
          src="/assets/icons/confirmed.png"
          className={classes.img}
        />
        <Typography className={classes.title}>Withdraw confirmed!</Typography>
        <Typography className={classes.description}>
          You have successfully finished your withdraw process! Below you can
          see details of your transaction.
        </Typography>
      </div>
      <OutputEstimation
        poolData={poolData}
        amount0={unstakeState.amountWithdrawn}
        isEstimation={false}
        earned={unstakeState.claimedEarn}
      />
      <div className={classes.actions}>
        <Button
          color="primary"
          variant="contained"
          fullWidth
          className={classes.deposit}
          onClick={onClose}
        >
          DONE
        </Button>
      </div>
    </div>
  )
}
