import React, { ChangeEvent, useRef, useReducer, useEffect } from 'react'
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
import { ChainId, CHAIN_NAMES, ORIGINATION_API_URL } from 'config/constants'
import { useSnackbar } from 'notistack'
import axios from 'axios'
import { FungiblePoolService } from 'services'
import { IToken } from 'types'
import { BigNumber } from 'ethers'
import { ZERO } from 'utils/number'

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
      opacity: 1,
      backgroundColor: 'none',
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
    justifyContent: 'space-between',
    alignItems: 'baseline',
    display: 'flex',
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
  buttonTextPending: {
    color: theme.colors.white,
    fontWeight: 'normal',
  },
  downloadFileText: {
    textDecoration: 'underline',
    color: theme.colors.primary100,
    fontSize: 12,
  },
  errorMessage: {
    color: theme.colors.warn,
    marginTop: 10,
  },
}))

interface IProps {
  poolAddress: string
  open: boolean
  onClose: () => void
  onSuccess: () => Promise<void>
  purchaseToken: IToken
  totalOfferingAmount: BigNumber
}

interface IState {
  setWhitelistTx: string
  txState: TxState
  whitelistFile: File | null
  maxLimit: BigNumber
}

export const SetWhitelistModal: React.FC<IProps> = ({
  poolAddress,
  open,
  onClose,
  onSuccess,
  totalOfferingAmount,
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
      maxLimit: ZERO,
    }
  )

  const fungibleOriginationPool = new FungiblePoolService(
    provider,
    account,
    poolAddress
  )

  useEffect(() => {
    const getMaxLimit = async () => {
      let maxLimit
      try {
        maxLimit =
          await fungibleOriginationPool.getPurchaseAmountFromOfferAmount(
            totalOfferingAmount
          )
      } catch (error) {
        console.error('getPurchaseAmountFromOfferAmount error', error)
      }
      setState({ maxLimit })
    }

    if (provider) {
      getMaxLimit()
    }
  }, [])

  const generateMerkleTreeRoot = async (signedPoolAddress: string) => {
    const requestData = new FormData()
    requestData.append('file', state.whitelistFile as File)
    requestData.append('poolAddress', poolAddress)
    requestData.append(
      'network',
      CHAIN_NAMES[networkId as ChainId]?.toLowerCase()
    )
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
    if (!account || !provider || !state.whitelistFile) {
      return
    }

    let merkleTreeRoot
    try {
      setState({ txState: TxState.InProgress })

      const signedPoolAddress = await provider
        .getSigner()
        .signMessage(poolAddress)

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

  const onFileInputClick = () => {
    if (!hiddenFileInput.current) return
    hiddenFileInput.current.click()
  }

  const handleFileInputChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return
    const fileUploaded = event.target?.files[0]
    setState({ whitelistFile: fileUploaded })
  }

  const isDisabled =
    !state.whitelistFile || state.txState === TxState.InProgress

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
          <Typography className={classes.title}>SET ALLOWLIST</Typography>
          <div className={classes.underline} />
          {!(state.txState === TxState.InProgress) && (
            <IconButton className={classes.closeButton} onClick={_onClose}>
              <CloseOutlinedIcon />
            </IconButton>
          )}
          <div className={classes.plusWrapper}>
            <Button
              id="uploadWhitelist"
              onClick={onFileInputClick}
              disableRipple
            >
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
                accept=".csv"
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
                  Upload a CSV File with allowlist addresses
                </Typography>
              )}
            </Button>
          </div>

          <div className={classes.buttonWrapper}>
            <Button
              disabled={isDisabled}
              color="primary"
              variant="contained"
              className={clsx(
                classes.button,
                state.txState === TxState.InProgress && 'pending',
                !state.whitelistFile && 'disabled'
              )}
              onClick={handleSetWhitelistClick}
            >
              <Typography
                className={clsx([
                  classes.buttonText,
                  state.txState === TxState.InProgress &&
                    classes.buttonTextPending,
                ])}
              >
                {state.txState === TxState.InProgress
                  ? 'Pending'
                  : 'Set Allowlist'}
              </Typography>
              {state.txState === TxState.InProgress && (
                <>
                  &nbsp;
                  <CircularProgress className={classes.progress} size={10} />
                </>
              )}
            </Button>
            <a
              className={classes.downloadFileText}
              href="/assets/allowlistSample.csv"
              download
            >
              Allowlist CSV sample file
            </a>
          </div>
        </div>
      )}
    </Modal>
  )
}
