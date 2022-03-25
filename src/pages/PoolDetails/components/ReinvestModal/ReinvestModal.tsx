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
import { SuccessSection } from './SuccessSection'
import { CollectableFees } from './CollectableFees'

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
  const [state, setState] = useState<IState>({
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
        txState: TxState.InProgress,
      }))

      const clr = new CLRService(provider, account, poolData.address)

      const txId = await clr.reinvest()

      const finalTxId = await clr.waitUntilReinvest(account, txId)

      setState((prev) => ({
        ...prev,
        txState: TxState.Complete,
        reinvestTx: finalTxId,
      }))
    } catch (error) {
      console.error(error)
      setState((prev) => ({
        ...prev,
        txState: TxState.None,
      }))
    }
  }

  return (
    <Modal open={open} onClose={_onClose} className={classes.modal}>
      {state.txState === TxState.Complete ? (
        <SuccessSection
          reinvestState={state.txState}
          poolData={poolData}
          onClose={_onClose}
        />
      ) : (
        <div className={classes.content}>
          <Typography className={classes.title}>Reinvest</Typography>
          {!(state.txState === TxState.InProgress) && (
            <IconButton className={classes.closeButton} onClick={onClose}>
              <CloseOutlinedIcon />
            </IconButton>
          )}
          <CollectableFees poolData={poolData} reinvestState={state.txState} />

          <div className={classes.buttonWrapper}>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              className={clsx(
                classes.button,
                state.txState === TxState.InProgress && 'pending'
              )}
              onClick={onReinvest}
            >
              {state.txState === TxState.InProgress ? 'Pending' : 'REINVEST'}
              {state.txState === TxState.InProgress && (
                <>
                  &nbsp;
                  <CircularProgress className={classes.progress} size={10} />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
