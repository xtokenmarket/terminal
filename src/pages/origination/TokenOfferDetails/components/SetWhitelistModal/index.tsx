import React, { ChangeEvent, useState, useRef, useReducer } from 'react'
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
import { Input } from 'pages/origination/CreateTokenSale/components'
import { ChainId, CHAIN_NAMES, ORIGINATION_API_URL } from 'config/constants'
import { useSnackbar } from 'notistack'
import axios from 'axios'
import { FungibleOriginationPoolService } from 'services/fungibleOriginationPool'

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
    marginTop: 14,
    '&:hover': {
      opacity: 0.7,
      backgroundColor: theme.colors.secondary,
    },
    '&.pending': {
      color: theme.colors.primary700,
    },
    '&.disabled': {
      opacity: 0.3,
      backgroundColor: theme.colors.secondary,
    },
    padding: '8px 20px',
    backgroundColor: theme.colors.secondary,
    borderRadius: 4,
  },
  buttonText: {
    color: theme.colors.primary700,
    fontWeight: 600,
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
  poolAddress: string
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
  poolAddress,
  open,
  onClose,
  onSuccess,
}) => {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const { account, networkId, library: provider } = useConnectedWeb3Context()

  const hiddenFileInput = useRef<HTMLInputElement>(null)
  const [state, setState] = useReducer(
    (prevState: IState, newState: Partial<IState>) => ({
      ...prevState,
      ...newState,
    }),
    {
      setWhitelistTx: '',
      txState: TxState.None,
      whitelistFile: null,
      value: '',
    }
  )

  const fungibleOriginationPool = new FungibleOriginationPoolService(
    provider,
    account,
    poolAddress
  )

  const generateMerkleTreeRoot = async (signedPoolAddress: string) => {
    const requestData = new FormData()
    requestData.append('file', state.whitelistFile as File)
    requestData.append('poolAddress', poolAddress)
    requestData.append(
      'network',
      CHAIN_NAMES[networkId as ChainId]?.toLowerCase()
    )
    requestData.append('maxAmountPerAddress', state.value)
    requestData.append('signedPoolAddress', signedPoolAddress)

    const { merkleRoot } = await axios
      .post(`${ORIGINATION_API_URL}/generateMerkleRoot`, requestData)
      .then((response) => response.data)
      .catch(({ response }) => {
        throw Error(
          response.data.error ||
            'Unknown error occurred while registering whitelist'
        )
      })

    return merkleRoot
  }

  const _clearTxState = () =>
    setState({ setWhitelistTx: '', txState: TxState.None })

  const _onClose = () => {
    if (state.txState === TxState.Complete) {
      _clearTxState()
    }
    setState({ whitelistFile: null })
    onClose()
  }

  const handleSetWhitelistClick = async () => {
    if (!account || !provider || !canSetWhitelist()) {
      return
    }

    setState({ txState: TxState.InProgress })

    const signedPoolAddress = await provider
      .getSigner()
      .signMessage(poolAddress)

    let merkleTreeRoot
    try {
      merkleTreeRoot = await generateMerkleTreeRoot(signedPoolAddress)
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: 'error' })
      resetTxState()

      return
    }

    try {
      const txHash = await fungibleOriginationPool.setWhitelist(merkleTreeRoot)
      setState({ txState: TxState.Complete, setWhitelistTx: txHash })
    } catch (err) {
      enqueueSnackbar('Transaction execution failed', { variant: 'error' })
      resetTxState()
    }
  }

  const resetTxState = () => setState({ txState: TxState.None })

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) =>
    setState({ value: event.target.value })

  const onFileInputClick = () => {
    if (!hiddenFileInput.current) return
    hiddenFileInput.current.click()
  }

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    const fileUploaded = event.target?.files[0]

    setState({ whitelistFile: fileUploaded })
  }

  const canSetWhitelist = () => {
    return state.whitelistFile && state.value && parseFloat(state.value) > 0
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
            <Input
              inputLabel="Max Sale Per whitelist address"
              value={state.value}
              onChange={onInputChange}
            />
          </div>

          <div className={classes.buttonWrapper}>
            <Button
              disabled={!state.whitelistFile}
              color="primary"
              variant="contained"
              className={clsx(
                classes.button,
                state.txState === TxState.InProgress && 'pending',
                !canSetWhitelist() && 'disabled'
              )}
              onClick={handleSetWhitelistClick}
            >
              <Typography className={classes.buttonText}>
                {state.txState === TxState.InProgress
                  ? 'Pending'
                  : state.whitelistFile
                  ? 'SET WHITELIST'
                  : 'Approve  WHITELIST'}
              </Typography>
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
