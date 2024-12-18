import { Button, makeStyles, Typography } from '@material-ui/core'
import { IDepositState } from 'pages/mining/PoolDetails/components/index'
import { ViewTransaction } from 'components'
import { ITerminalPool } from 'types'

import { OutputEstimation } from '../index'

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
  transaction: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    marginTop: 20,
  },
}))

interface IProps {
  onClose: () => void
  depositState: IDepositState
  poolData: ITerminalPool
}

export const SuccessSection = (props: IProps) => {
  const classes = useStyles()
  const { depositState, poolData, onClose } = props

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <img
          alt="check"
          src="/assets/icons/confirmed.png"
          className={classes.img}
        />
        <Typography className={classes.title}>Deposit confirmed!</Typography>
        <Typography className={classes.description}>
          You have successfully finished your deposit process! Below you can see
          details of your transaction.
        </Typography>
      </div>
      <OutputEstimation
        poolData={poolData}
        amount0={depositState.amount0Used}
        amount1={depositState.amount1Used}
        isEstimation={false}
      />
      <div className={classes.actions}>
        <div className={classes.transaction}>
          <ViewTransaction txId={depositState.depositTx} />
        </div>
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
