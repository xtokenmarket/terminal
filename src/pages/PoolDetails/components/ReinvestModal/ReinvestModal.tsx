import React, { useState } from 'react'
import {
  Modal,
  makeStyles,
  Typography,
  IconButton,
  Button,
  CircularProgress,
} from '@material-ui/core'
import { ITerminalPool } from 'types'
import { useConnectedWeb3Context } from 'contexts'
import { TxState } from 'utils/enums'
import clsx from 'clsx'
import { CLRService } from 'services'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import { TokenIcon } from 'components'
import { formatBigNumber } from 'utils'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
    backgroundColor: theme.colors.primary500,
    outline: 'none',
    userSelect: 'none',
    overflowY: 'visible',
    maxHeight: '80vh',
    width: '70vw',
    maxWidth: 600,
    [theme.breakpoints.down('xs')]: {
      width: '90vw',
    },
  },
  title: {
    color: theme.colors.white,
    fontWeight: 600,
    fontSize: 22,
    marginBottom: 8,
    padding: 32,
  },
  subheader: {
    color: theme.colors.primary100,
    fontWeight: 700,
    fontSize: '12px',
    marginBottom: theme.spacing(1),
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    color: theme.colors.white1,
  },
  button: {
    height: 48,
    minWidth: 132,
    '&.pending': {
      color: theme.colors.white,
    },
  },
  progress: { color: theme.colors.white },
  collectableFee: {
    backgroundColor: theme.colors.primary400,
    padding: '24px 32px',
  },
  label: {
    color: theme.colors.primary100,
    marginBottom: 8,
  },
  amount: {
    fontSize: 24,
    fontWeight: 600,
    color: theme.colors.white,
    '& span': {
      fontSize: 14,
      fontWeight: 600,
      color: theme.colors.primary100,
    },
  },
  infoRow: {
    margin: '0 -4px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8,
  },
  tokenIcon: {
    width: 36,
    height: 36,
    border: `4px solid ${theme.colors.transparent}`,
    '&+&': {
      borderColor: theme.colors.primary500,
      position: 'relative',
      left: -12,
    },
  },
  buttonWrapper: {
    backgroundColor: theme.colors.primary500,
    padding: 32,
    width: '100%',
  },
}))

interface IProps {
  open: boolean
  onClose: () => void
  poolData: ITerminalPool
}

interface IState {
  reinvestDone: boolean
  reinvesting: boolean
  reinvestTx: string
  txState: TxState
}

export const ReinvestModal: React.FC<IProps> = ({
  open,
  onClose,
  poolData,
}) => {
  const classes = useStyles()
  const { account, library: provider } = useConnectedWeb3Context()
  const { user } = poolData
  const [state, setState] = useState<IState>({
    reinvestDone: false,
    reinvesting: false,
    reinvestTx: '',
    txState: TxState.None,
  })

  const _clearTxState = () => {
    setState((prev) => ({
      ...prev,
      reinvestTx: '',
      txState: TxState.None,
    }))
  }

  const _onClose = () => {
    if (state.txState === TxState.Complete) {
      _clearTxState()
    }
    onClose()
  }

  const onReinvest = async () => {
    if (!account || !provider) {
      return
    }
    try {
      setState((prev) => ({
        ...prev,
        reinvesting: true,
      }))

      const clr = new CLRService(provider, account, poolData.address)

      const txId = await clr.reinvest()

      const finalTxId = await clr.waitUntilReinvest(account, txId)

      setState((prev) => ({
        ...prev,
        reinvesting: false,
        reinvestTx: txId,
        reinvestDone: true,
      }))
    } catch (error) {
      console.error(error)
      setState((prev) => ({
        ...prev,
        reinvesting: false,
      }))
    }
  }

  return (
    <Modal open={open} onClose={_onClose} className={classes.modal}>
      <div className={classes.content}>
        <Typography className={classes.title}>Reinvest</Typography>
        {!state.reinvesting && (
          <IconButton className={classes.closeButton} onClick={onClose}>
            <CloseOutlinedIcon />
          </IconButton>
        )}
        <div className={classes.collectableFee}>
          <Typography className={classes.label}>COLLECTABLE FEES </Typography>
          <div className={classes.infoRow}>
            <TokenIcon token={poolData.token0} className={classes.tokenIcon} />
            &nbsp;&nbsp;
            <Typography className={classes.amount}>
              {formatBigNumber(
                user.collectableFees0,
                poolData.token0.decimals,
                4
              )}
              &nbsp;
              {poolData.token0.symbol}
            </Typography>
          </div>

          <div className={classes.infoRow}>
            <TokenIcon token={poolData.token1} className={classes.tokenIcon} />
            &nbsp;&nbsp;
            <Typography className={classes.amount}>
              {formatBigNumber(
                user.collectableFees1,
                poolData.token1.decimals,
                4
              )}
              &nbsp;
              {poolData.token1.symbol}
            </Typography>
          </div>
        </div>
        <div className={classes.buttonWrapper}>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            className={clsx(
              classes.button,
              (state.reinvesting || state.reinvestDone) && 'pending'
            )}
            onClick={onReinvest}
          >
            {state.reinvesting ? 'Pending' : 'REINVEST'}
            {state.reinvesting && (
              <>
                &nbsp;
                <CircularProgress className={classes.progress} size={10} />
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
