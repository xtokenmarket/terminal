import { BigNumber } from '@ethersproject/bignumber'
import { makeStyles, Typography, IconButton } from '@material-ui/core'
import { useConnectedWeb3Context } from 'contexts'
import { ViewTransaction } from 'components'
import { IWithdrawState } from 'pages/PoolDetails/components'
import { useEffect, useState } from 'react'
import { CLRService } from 'services'
import { ITerminalPool } from 'types'
import { ZERO } from 'utils/number'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'

import { ActionStepRow, WarningInfo } from '..'
import { FIVE_MINUTES_IN_MS, LOCKED_STARTING_TIME } from 'config/constants'
import { useCountdown } from 'helpers/useCountdownClock'

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
  },
}))

interface IProps {
  onNext: () => void
  withdrawState: IWithdrawState
  poolData: ITerminalPool
  updateState: (e: any) => void
  goBack: () => void
  onClose: () => void
}

interface IState {
  withdrawDone: boolean
  withdrawing: boolean
  withdrawTx: string
  step: number
}

export const WithdrawSection = (props: IProps) => {
  const classes = useStyles()
  const [state, setState] = useState<IState>({
    withdrawDone: false,
    withdrawing: false,
    withdrawTx: '',
    step: 1,
  })
  const { onNext, withdrawState, poolData, updateState, goBack, onClose } =
    props
  const { account, library: provider } = useConnectedWeb3Context()

  const lockStartingTime = localStorage.getItem(LOCKED_STARTING_TIME) || 0
  const { minutes, seconds } = useCountdown(
    Number(lockStartingTime) + FIVE_MINUTES_IN_MS
  )
  const isLocked = minutes + seconds > 0 && !state.withdrawDone

  useEffect(() => {
    if (state.withdrawDone) {
      setTimeout(() => {
        onNext()
      }, 2000)
    }
  }, [state.withdrawDone])

  const onWithdraw = async () => {
    if (!account || !provider) {
      return
    }
    try {
      setState((prev) => ({
        ...prev,
        withdrawing: true,
      }))

      const clr = new CLRService(provider, account, poolData.address)

      const txId = await clr[
        withdrawState.withdrawOnly ? 'withdraw' : 'withdrawAndClaimReward'
      ](withdrawState.lpInput)

      const finalTxId = await clr.waitUntilWithdraw(
        poolData.address,
        withdrawState.lpInput,
        account,
        txId
      )

      const data = await clr.parseWithdrawTx(finalTxId)

      const claimedEarn: BigNumber[] = []

      if (!withdrawState.withdrawOnly) {
        const claimInfo = await clr.parseClaimTx(finalTxId)
        poolData.rewardState.tokens.forEach((rewardToken) => {
          const rewardAmount =
            claimInfo[rewardToken.address.toLowerCase()] || ZERO
          claimedEarn.push(rewardAmount)
        })
      }

      if (data) {
        updateState({
          amount0Withdrawn: data.amount0,
          amount1Withdrawn: data.amount1,
          liquidityWithdrawn: data.liquidity,
          claimedEarn,
        })
      }

      setState((prev) => ({
        ...prev,
        withdrawing: false,
        withdrawTx: txId,
        withdrawDone: true,
      }))

      localStorage.setItem(
        LOCKED_STARTING_TIME,
        new Date().getTime().toString()
      )
    } catch (error) {
      console.error(error)
      setState((prev) => ({
        ...prev,
        withdrawing: false,
      }))
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        {!state.withdrawing ? (
          <ArrowBackIosIcon
            className={classes.arrowBackIosStyle}
            onClick={goBack}
          />
        ) : (
          <div className={classes.arrowBackIosStyle} />
        )}
        <div>
          <Typography className={classes.title}>Withdraw Liquidity</Typography>
          <Typography className={classes.description}>
            Please complete all transactions to complete the withdraw.
          </Typography>
        </div>
        {!state.withdrawing && (
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
            title={withdrawState.withdrawOnly ? 'Withdraw' : 'Claim & Withdraw'}
            actionLabel={state.withdrawDone ? 'Withdrew' : 'Withdraw'}
            onConfirm={onWithdraw}
            actionPending={state.withdrawing}
            actionDone={state.withdrawDone}
            rightComponent={
              state.withdrawDone && state.withdrawTx !== '' ? (
                <ViewTransaction txId={state.withdrawTx} />
              ) : null
            }
          />
        </div>
        <div className={classes.clockStyle}>
          {isLocked && `${minutes}m${seconds}s until address unlocks`}
        </div>
      </div>
    </div>
  )
}
