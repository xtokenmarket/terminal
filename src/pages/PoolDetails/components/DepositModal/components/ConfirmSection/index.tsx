import { Button, IconButton, makeStyles, Typography } from '@material-ui/core'
import { IDepositState } from 'pages/PoolDetails/components'
import { ITerminalPool } from 'types'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'

import { OutputEstimation, OutputEstimationInfo } from '..'

const useStyles = makeStyles((theme) => ({
  root: { backgroundColor: theme.colors.primary500 },
  header: {
    padding: 32,
    position: 'relative',
    paddingBottom: 16,
  },
  title: {
    color: theme.colors.white,
    fontWeight: 600,
    fontSize: 22,
    marginBottom: 8,
  },
  description: {
    marginBottom: 24,
    color: theme.colors.white,
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 12,
    color: theme.colors.white1,
  },
  deposit: { marginTop: 32 },
  buy: { marginTop: 8 },
  actions: {
    padding: 32,
  },
}))

interface IProps {
  onClose: () => void

  onNext: () => void
  depositState: IDepositState
  poolData: ITerminalPool
}

export const ConfirmSection = (props: IProps) => {
  const classes = useStyles()
  const { onNext, depositState, poolData, onClose } = props

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>Confirm your deposit</Typography>
        <Typography className={classes.description}>
          Please confirm your deposit transaction information to proceed with
          deposit process.
        </Typography>
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
      </div>
      <OutputEstimation
        poolData={poolData}
        amount0={depositState.amount0Estimation}
        amount1={depositState.amount1Estimation}
        lpValue={depositState.lpEstimation}
        totalLiquidity={depositState.totalLiquidity}
      />
      <div className={classes.actions}>
        <OutputEstimationInfo />
        <Button
          color="primary"
          variant="contained"
          fullWidth
          className={classes.deposit}
          onClick={onNext}
        >
          CONFIRM DEPOSIT
        </Button>
      </div>
    </div>
  )
}
