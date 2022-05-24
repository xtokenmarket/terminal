import {
  makeStyles,
  Typography,
  IconButton,
  Button,
  CircularProgress,
} from '@material-ui/core'
import { useConnectedWeb3Context } from 'contexts'
import { useIsMountedRef } from 'helpers'
import { useEffect, useState } from 'react'
import { ERC20Service, FungiblePoolService } from 'services'
import { IOfferingOverview } from 'types'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'

import { TokenInfo } from '../index'

const useStyles = makeStyles((theme) => ({
  root: {},
  header: {
    padding: 32,
    position: 'relative',
    paddingBottom: 16,
    display: 'flex',
    backgroundColor: theme.colors.primary500,
  },
  title: {
    color: theme.colors.white,
    fontWeight: 600,
    fontSize: 22,
    marginBottom: 8,
  },
  content: {
    padding: 32,
    paddingTop: 2,
    backgroundColor: theme.colors.primary400,
    width: 600,
    maxWidth: '90vw',
    minHeight: '20vh',
    maxHeight: '50vh',
  },
  warning: {
    padding: '16px !important',
    '& div': {
      '&:first-child': {
        marginTop: 0,
        marginRight: 16,
      },
      '& p': {
        fontSize: 14,
        marginTop: 3,
        '&:first-child': { fontSize: 16, marginTop: 0 },
      },
    },
  },
  actions: {
    marginTop: 32,
  },
  tokenIcon: {
    width: 24,
    height: 24,
    borderRadius: '50%',
  },
  closeButton: {
    padding: 0,
    color: theme.colors.white1,
    position: 'absolute',
    right: 24,
    top: 36,
    [theme.breakpoints.down('xs')]: {
      top: 12,
      right: 12,
    },
  },
  initiateBtn: {
    marginTop: 32,
  },
  progress: { color: theme.colors.white },
}))

interface IProps {
  onClose: () => void
  offerData: IOfferingOverview
  updateState: (e: any) => void
}

interface IState {
  isApproved: boolean
  isApproving: boolean
  isInitiated: boolean
  isInitiating: boolean
  txHash: string
}

export const InitiateSection = (props: IProps) => {
  const classes = useStyles()
  const { account, library: provider } = useConnectedWeb3Context()
  const isMountedRef = useIsMountedRef()
  const { offerData, onClose, updateState } = props

  const [state, setState] = useState<IState>({
    isApproved: false,
    isApproving: false,
    isInitiated: false,
    isInitiating: false,
    txHash: '',
  })

  const erc20Token = new ERC20Service(
    provider,
    account,
    offerData.offerToken.address
  )

  const loadInitialInfo = async () => {
    if (!account || !provider) {
      return
    }
    try {
      const isApproved = await erc20Token.hasEnoughAllowance(
        account,
        offerData.poolAddress,
        offerData.totalOfferingAmount
      )
      if (isMountedRef.current) {
        setState((prev) => ({ ...prev, isApproved }))
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadInitialInfo()
  }, [])

  useEffect(() => {
    if (state.isInitiated) {
      setTimeout(() => {
        updateState({ isInitiated: true, txHash: state.txHash })
      }, 2000)
    }
  }, [state.isInitiated])

  const onApprove = async () => {
    if (!account || !provider) {
      return
    }

    try {
      setState((prev) => ({
        ...prev,
        isApproving: true,
      }))

      const txHash = await erc20Token.approveUnlimited(offerData.poolAddress)
      await erc20Token.waitUntilApproved(account, offerData.poolAddress, txHash)

      setState((prev) => ({
        ...prev,
        isApproving: false,
        isApproved: true,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isApproving: false,
      }))
    }
  }

  const onVest = async () => {
    if (!account || !provider) {
      return
    }

    try {
      setState((prev) => ({
        ...prev,
        isInitiating: true,
      }))

      const fungiblePool = new FungiblePoolService(
        provider,
        account,
        offerData.poolAddress
      )
      // const txId = await fungiblePool.initiateSale()
      // const finalTxId = await fungiblePool.waitUntilInitiateSale(txId)
      const finalTxId = ''

      setState((prev) => ({
        ...prev,
        isInitiating: false,
        isInitiated: true,
        txHash: finalTxId,
      }))
    } catch (error) {
      console.error(error)
      setState((prev) => ({
        ...prev,
        isInitiating: false,
      }))
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>Vest XTK tokens</Typography>
        {!state.isApproving && (
          <IconButton className={classes.closeButton} onClick={onClose}>
            <CloseOutlinedIcon />
          </IconButton>
        )}
      </div>
      <div className={classes.content}>
        <div className={classes.actions}>
          <TokenInfo
            title="Approve vest of"
            actionLabel={state.isApproved ? 'APPROVED' : 'APPROVE'}
            onConfirm={onApprove}
            actionPending={state.isApproving}
            actionDone={state.isApproved}
            token={offerData.offerToken}
            amount={offerData.totalOfferingAmount}
          />
          <Button
            color="primary"
            variant="contained"
            fullWidth
            className={classes.initiateBtn}
            onClick={onVest}
            disabled={
              !state.isApproved || state.isInitiating || state.isInitiated
            }
          >
            {state.isInitiating ? (
              <>
                &nbsp;
                <CircularProgress className={classes.progress} size={24} />
              </>
            ) : (
              'VEST'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
