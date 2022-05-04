import React, { ChangeEvent, useState, useRef } from 'react'
import {
  makeStyles,
  Typography,
  IconButton,
  Button,
  CircularProgress,
} from '@material-ui/core'
import { useConnectedWeb3Context } from 'contexts'
import { TxState } from 'utils/enums'
import clsx from 'clsx'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import { SuccessSection } from './SuccessSection'
import { Modal } from 'components/Common/Modal'
import { useServices } from 'helpers'
import { Input } from 'pages/origination/CreateTokenSale/components'

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
    fontWeight: 700,
    fontSize: 18,
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
  plus: {
    marginLeft: 32,
  },
  text: {
    color: theme.colors.white,
    fontWeight: 700,
    fontSize: 14,
    marginLeft: 19,
  },
  plusWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  inputWrapper: {
    margin: 32,
  },
  underline: {
    height: 1,
    width: '90%',
    background: theme.colors.primary200,
    position: 'absolute',
    top: '82px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  file: {
    display: 'none',
  },
}))

interface IProps {
  open: boolean
  onClose: () => void
  onSuccess: () => Promise<void>
}

interface IState {
  setWhitelistTx: string
  txState: TxState
  whitelistFile: File | null
  value: string
}

export const SetWhitelistModal: React.FC<IProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const classes = useStyles()
  const { account, library: provider } = useConnectedWeb3Context()
  const { originationService } = useServices()
  const hiddenFileInput = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<IState>({
    setWhitelistTx: '',
    txState: TxState.None,
    whitelistFile: null,
    value: '',
  })

  const _clearTxState = () => {
    setState((prev) => ({
      ...prev,
      setWhitelistTx: '',
      txState: TxState.None,
    }))
  }

  const _onClose = () => {
    if (state.txState === TxState.Complete) {
      _clearTxState()
    }
    setState((prev) => ({
      ...prev,
      whitelistFile: null,
    }))
    onClose()
  }

  const onSetWhitelist = async () => {
    if (!account || !provider) {
      return
    }
    try {
      setState((prev) => ({
        ...prev,
        txState: TxState.InProgress,
      }))

      // TODO: whitelist format need to be handled
      const txId = await originationService.setWhitelist(['test'])

      const finalTxId = await originationService.waitUntilSetWhitelist(
        account,
        txId
      )

      setState((prev) => ({
        ...prev,
        txState: TxState.Complete,
        setWhitelistTx: finalTxId,
      }))
    } catch (error) {
      console.error(error)
      setState((prev) => ({
        ...prev,
        txState: TxState.None,
      }))
    }
  }

  const resetTxState = () => {
    setState((prev) => ({
      ...prev,
      txState: TxState.None,
    }))
  }

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      value: event.target.value,
    }))
  }

  const onFileInputClick = () => {
    if (!hiddenFileInput.current) return
    hiddenFileInput.current.click()
  }

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    const fileUploaded = event.target?.files[0]
    setState((prev) => ({
      ...prev,
      whitelistFile: fileUploaded,
    }))

    // TODO: whitelist format need to be handled
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
          tx={state.setWhitelistTx}
          onClose={onSuccess}
          resetTxState={resetTxState}
        />
      ) : (
        <div className={classes.content}>
          <Typography className={classes.title}>SET WHITELIST</Typography>
          <div className={classes.underline} />
          {!(state.txState === TxState.InProgress) && (
            <IconButton className={classes.closeButton} onClick={_onClose}>
              <CloseOutlinedIcon />
            </IconButton>
          )}
          <div className={classes.plusWrapper}>
            <Button onClick={onFileInputClick} disableRipple>
              <img
                alt="plus"
                className={classes.plus}
                src="/assets/icons/plus.svg"
              />
              <input
                type="file"
                onChange={handleFileInputChange}
                className={classes.file}
                ref={hiddenFileInput}
              />
              {state.whitelistFile ? (
                <>
                  <img
                    alt="plus"
                    className={classes.plus}
                    src="/assets/icons/file.svg"
                  />
                  <Typography className={classes.text}>
                    {state.whitelistFile.name}
                  </Typography>
                </>
              ) : (
                <Typography className={classes.text}>
                  Upload a CSV File with Whitelist addresses
                </Typography>
              )}
            </Button>
          </div>

          <div className={classes.inputWrapper}>
            <Input value={state.value} onChange={onInputChange} />
          </div>

          <div className={classes.buttonWrapper}>
            <Button
              disabled={!state.whitelistFile}
              fullWidth
              color="primary"
              variant="contained"
              className={clsx(
                classes.button,
                state.txState === TxState.InProgress && 'pending'
              )}
              onClick={onSetWhitelist}
            >
              {state.txState === TxState.InProgress
                ? 'Pending'
                : 'SET WHITELIST'}
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
