import React, { useState } from 'react'
import {
  makeStyles,
  Typography,
  IconButton,
  Button,
  CircularProgress,
} from '@material-ui/core'
import { ICollectableFees, ITerminalPool, PoolService } from 'types'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import clsx from 'clsx'
import { BigNumber } from 'ethers'
import { useConnectedWeb3Context } from 'contexts'
import { TxState } from 'utils/enums'
import { Modal } from 'components/Common/Modal'
import { WarningInfo } from 'components/Common/WarningInfo'

import { SuccessSection } from './SuccessSection'
import { CollectableFees } from './CollectableFees'
import { ChainId } from 'config/constants'

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
  warning: {
    margin: '32px 32px 0 32px',
  },
  link: {
    textDecoration: 'none',
    color: theme.colors.primary100,
  },
}))

interface IProps {
  open: boolean
  onClose: () => void
  clrService: PoolService
  poolData: ITerminalPool
  onSuccess: () => Promise<void>
}

interface IState {
  reinvestTx: string
  txState: TxState
  collectableFees: ICollectableFees
}

export const ReinvestModal: React.FC<IProps> = ({
  open,
  onClose,
  clrService,
  poolData,
  onSuccess,
}) => {
  const classes = useStyles()
  const { account, library: provider, networkId } = useConnectedWeb3Context()

  const [state, setState] = useState<IState>({
    reinvestTx: '',
    txState: TxState.None,
    collectableFees: {
      token0Fee: BigNumber.from(0),
      token1Fee: BigNumber.from(0),
    },
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
        collectableFees: {
          token0Fee: poolData.user.collectableFees0,
          token1Fee: poolData.user.collectableFees1,
        },
      }))

      const txId = await clrService.reinvest()
      const finalTxId = await clrService.waitUntilReinvest(txId)

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

  const isDisable =
    poolData.user.collectableFees0.isZero() ||
    poolData.user.collectableFees1.isZero()

  const resetTxState = () => {
    setState((prev) => ({
      ...prev,
      txState: TxState.None,
    }))
  }

  return (
    <Modal
      open={open}
      onClose={_onClose}
      className={classes.modal}
      disableBackdropClick
      disableEscapeKeyDown
    >
      {state.txState === TxState.Complete ? (
        <SuccessSection
          reinvestState={state.txState}
          poolData={poolData}
          onClose={onSuccess}
          collectableFees={state.collectableFees}
          resetTxState={resetTxState}
        />
      ) : (
        <div className={classes.content}>
          <Typography className={classes.title}>Reinvest</Typography>
          {!(state.txState === TxState.InProgress) && (
            <IconButton className={classes.closeButton} onClick={onClose}>
              <CloseOutlinedIcon />
            </IconButton>
          )}
          <CollectableFees
            poolData={poolData}
            reinvestState={state.txState}
            token0Fee={poolData.user.collectableFees0}
            token1Fee={poolData.user.collectableFees1}
          />

          {networkId === ChainId.Mainnet && (
            <WarningInfo
              className={classes.warning}
              title="Important"
              description={
                <>
                  Please connect to the Flashbots RPC in Metamask by following
                  the guide{' '}
                  <a
                    className={classes.link}
                    href="https://docs.flashbots.net/flashbots-protect/rpc/quick-start/#how-to-use-flashbots-protect-rpc-in-metamask"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    here
                  </a>{' '}
                  to avoid risk of frontrunning
                </>
              }
            />
          )}

          <div className={classes.buttonWrapper}>
            <Button
              disabled={isDisable}
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
