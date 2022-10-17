import {
  Button,
  CircularProgress,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import { useConnectedWeb3Context } from 'contexts'
import { FungiblePoolService } from 'services'
import { useEffect, useState } from 'react'
import { IUserPosition, IOfferingOverview } from 'types'

import { OutputEstimation } from '../index'
import { VestState } from '../..'

const ICON_SIZE = 150

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: ICON_SIZE / 2,
    width: 600,
    maxWidth: '90vw',
  },
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
    marginBottom: 24,
  },
  actions: {
    padding: 32,
    backgroundColor: theme.colors.primary500,
  },
  progress: { color: theme.colors.white },
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
}))

interface IProps {
  offerData: IOfferingOverview
  onNext: () => void
  onClose: () => void
  vestState: VestState
  updateState: (e: any) => void
  userPositionData: IUserPosition
}

interface IState {
  isInitiated: boolean
  isInitiating: boolean
  txHash: string
}

export const InfoSection = (props: IProps) => {
  const classes = useStyles()
  const { account, library: provider } = useConnectedWeb3Context()
  const {
    offerData,
    onNext,
    onClose,
    vestState,
    updateState,
    userPositionData,
  } = props

  const [state, setState] = useState<IState>({
    isInitiated: false,
    isInitiating: false,
    txHash: '',
  })

  useEffect(() => {
    if (state.isInitiated) {
      setTimeout(() => {
        updateState({ isInitiated: true, txHash: state.txHash })
      }, 2000)
    }
  }, [state.isInitiated])

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
      const txId = await fungiblePool.vest(userPositionData.userToVestingId)
      const finalTxId = await fungiblePool.waitUntilVest(txId)

      setState((prev) => ({
        ...prev,
        isInitiating: false,
        isInitiated: true,
        txHash: finalTxId,
      }))
      onNext()
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
        <Typography className={classes.title}>
          Vest {offerData.offerToken.symbol} tokens
        </Typography>
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
      </div>
      <OutputEstimation
        offerData={offerData}
        vestState={vestState}
        userPositionData={userPositionData}
      />
      <div className={classes.actions}>
        <Button
          color="primary"
          variant="contained"
          fullWidth
          onClick={onVest}
          disabled={state.isInitiating || state.isInitiated}
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
  )
}
