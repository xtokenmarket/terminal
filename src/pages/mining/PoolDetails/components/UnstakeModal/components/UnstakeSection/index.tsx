import { BigNumber } from '@ethersproject/bignumber'
import { makeStyles, Typography, IconButton } from '@material-ui/core'
import { useConnectedWeb3Context } from 'contexts'
import { ViewTransaction, WarningInfo } from 'components'
import { useEffect, useState } from 'react'
import { ITerminalPool } from 'types'
import { ZERO } from 'utils/number'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import ClockIcon from '@material-ui/icons/AccessTime'
import {
  FIVE_MINUTES_IN_MS,
  MINUTE_TIMELOCK_TIMESTAMP,
  ONE_MINUTE_IN_MS,
} from 'config/constants'
import { useCountdown } from 'helpers'

import { ActionStepRow } from '../index'
import { IUnstakeState } from '../../index'
import { SingleAssetPoolService } from 'services/singleAssetPoolService'

const useStyles = makeStyles((theme) => ({
  root: { backgroundColor: theme.colors.primary500 },
  header: {
    padding: 32,
    position: 'relative',
    paddingBottom: 16,
    display: 'flex',
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
  content: {
    padding: 32,
    paddingTop: 0,
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
  arrowBackIosStyle: {
    color: theme.colors.white,
    cursor: 'pointer',
    marginTop: 5,
    marginRight: 20,
    width: 24,
    height: 24,
  },
  closeButton: {
    padding: 0,
    color: theme.colors.white1,
    position: 'absolute',
    right: 24,
    top: 24,
    [theme.breakpoints.down('xs')]: {
      top: 12,
      right: 12,
    },
  },
  clockStyle: {
    color: 'red',
    display: 'flex',
    justifyContent: 'flex-end',
    fontSize: 14,
    marginTop: 10,
    alignItems: 'center',
  },
  clock: {
    width: 20,
    marginRight: 5,
  },
}))

interface IProps {
  onNext: () => void
  unstakeState: IUnstakeState
  clrService: SingleAssetPoolService
  poolData: ITerminalPool
  updateState: (e: any) => void
  goBack: () => void
  onClose: () => void
}

interface IState {
  unstakeDone: boolean
  unstaking: boolean
  unstakeTx: string
  step: number
}

export const UnstakeSection = (props: IProps) => {
  const classes = useStyles()
  const { account, library: provider } = useConnectedWeb3Context()

  const {
    onNext,
    unstakeState,
    clrService,
    poolData,
    updateState,
    goBack,
    onClose,
  } = props
  const [state, setState] = useState<IState>({
    unstakeDone: false,
    unstaking: false,
    unstakeTx: '',
    step: 1,
  })

  const lockDuration =
    Number(poolData.createdAt) >= MINUTE_TIMELOCK_TIMESTAMP
      ? ONE_MINUTE_IN_MS
      : FIVE_MINUTES_IN_MS
  const lockStartingTime =
    localStorage.getItem(poolData.address.toLowerCase()) || 0
  const { minutes, seconds } = useCountdown(
    Number(lockStartingTime) + lockDuration
  )
  const isLocked = minutes + seconds > 0 && !state.unstakeDone

  useEffect(() => {
    if (state.unstakeDone) {
      setTimeout(() => {
        onNext()
      }, 2000)
    }
  }, [state.unstakeDone])

  const onWithdraw = async () => {
    if (!account || !provider) {
      return
    }

    try {
      setState((prev) => ({
        ...prev,
        unstaking: true,
      }))

      const { lpInput, withdrawOnly } = unstakeState

      const txId = await clrService[
        withdrawOnly ? 'withdraw' : 'withdrawAndClaimReward'
      ](lpInput, ZERO, ZERO)

      const finalTxId = await clrService.waitUntilWithdraw(account, txId.hash)
      const data = await clrService.parseWithdrawTx(finalTxId)

      const claimedEarn: BigNumber[] = []

      if (!withdrawOnly) {
        const claimInfo = await clrService.parseClaimTx(finalTxId)
        poolData.rewardState.tokens.forEach((rewardToken) => {
          const rewardAmount =
            claimInfo[rewardToken.address.toLowerCase()] || ZERO
          claimedEarn.push(rewardAmount)
        })
      }

      if (data) {
        updateState({
          amountWithdrawn: data.amount,
          claimedEarn,
        })
      }

      setState((prev) => ({
        ...prev,
        unstaking: false,
        unstakeTx: txId,
        unstakeDone: true,
      }))

      localStorage.setItem(
        poolData.address.toLowerCase(),
        new Date().getTime().toString()
      )
    } catch (error) {
      console.error(error)
      setState((prev) => ({
        ...prev,
        unstaking: false,
      }))
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        {!state.unstaking ? (
          <ArrowBackIosIcon
            className={classes.arrowBackIosStyle}
            onClick={goBack}
          />
        ) : (
          <div className={classes.arrowBackIosStyle} />
        )}
        <div>
          <Typography className={classes.title}>Withdraw Liquidity</Typography>
        </div>
        {!state.unstaking && (
          <IconButton className={classes.closeButton} onClick={onClose}>
            <CloseOutlinedIcon />
          </IconButton>
        )}
      </div>
      <div className={classes.content}>
        <WarningInfo
          className={classes.warning}
          title="Warning"
          description="Please don’t close this window until the process is complete!"
        />
        <div className={classes.actions}>
          <ActionStepRow
            isLocked={isLocked}
            step={1}
            isActiveStep={state.step === 1}
            comment="Complete"
            title={unstakeState.withdrawOnly ? 'Withdraw' : 'Claim & Withdraw'}
            actionLabel={state.unstakeDone ? 'Withdrew' : 'Withdraw'}
            onConfirm={onWithdraw}
            actionPending={state.unstaking}
            actionDone={state.unstakeDone}
            rightComponent={
              state.unstakeDone && state.unstakeTx !== '' ? (
                <ViewTransaction txId={state.unstakeTx} />
              ) : null
            }
          />
        </div>
        <div className={classes.clockStyle}>
          {isLocked && (
            <>
              <ClockIcon className={classes.clock} />
              {`${minutes}m ${seconds}s until address unlocks`}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
