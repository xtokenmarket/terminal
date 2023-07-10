import { makeStyles, Typography, IconButton } from '@material-ui/core'
import { useConnectedWeb3Context } from 'contexts'
import { ViewTransaction, WarningInfo } from 'components'
import { useCountdown, useIsMountedRef } from 'helpers'
import { useEffect, useState } from 'react'
import { ERC20Service } from 'services'
import { ITerminalPool } from 'types'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ClockIcon from '@material-ui/icons/AccessTime'
import {
  FIVE_MINUTES_IN_MS,
  MINUTE_TIMELOCK_TIMESTAMP,
  ONE_MINUTE_IN_MS,
} from 'config/constants'

import { ActionStepRow } from '../index'
import { IStakeState } from '../../index'
import { SingleAssetPoolService } from 'services/singleAssetPoolService'
import { ZERO } from 'utils/number'

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
  arrowBackIosStyle: {
    color: theme.colors.white,
    cursor: 'pointer',
    marginTop: 5,
    marginRight: 20,
    width: 24,
    height: 24,
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
  depositState: IStakeState
  clrService: SingleAssetPoolService
  poolData: ITerminalPool
  updateState: (e: any) => void
  onClose: () => void
  goBack: () => void
}

interface IState {
  tokenApproved: boolean
  tokenApproveTx: string
  tokenApproving: boolean
  depositDone: boolean
  depositing: boolean
  depositTx: string
  step: number
}

export const StakeSection = (props: IProps) => {
  const classes = useStyles()
  const [state, setState] = useState<IState>({
    tokenApproved: false,
    tokenApproveTx: '',
    tokenApproving: false,
    depositDone: false,
    depositing: false,
    depositTx: '',
    step: 1,
  })
  const {
    onNext,
    depositState,
    clrService,
    poolData,
    updateState,
    onClose,
    goBack,
  } = props
  const { account, library: provider, networkId } = useConnectedWeb3Context()

  const isMountedRef = useIsMountedRef()

  const lockDuration =
    Number(poolData.createdAt) >= MINUTE_TIMELOCK_TIMESTAMP
      ? ONE_MINUTE_IN_MS
      : FIVE_MINUTES_IN_MS
  const lockStartingTime =
    localStorage.getItem(poolData.address.toLowerCase()) || 0
  const { minutes, seconds } = useCountdown(
    Number(lockStartingTime) + lockDuration
  )
  const isLocked = minutes + seconds > 0 && !state.depositDone

  const loadInitialInfo = async () => {
    if (!account || !provider) {
      return
    }
    try {
      const token0 = new ERC20Service(
        provider,
        account,
        poolData.token0.address
      )
      const tokenApproved = await token0.hasEnoughAllowance(
        account,
        poolData.address,
        depositState.amount
      )
      if (isMountedRef.current) {
        let step = 1
        if (tokenApproved) step = 2
        setState((prev) => ({ ...prev, tokenApproved, step }))
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadInitialInfo()
  }, [])

  useEffect(() => {
    if (state.depositDone) {
      setTimeout(() => {
        onNext()
      }, 2000)
    }
  }, [state.depositDone])

  const onApprove = async () => {
    if (!account || !provider || !networkId) {
      return
    }
    try {
      setState((prev) => ({
        ...prev,
        tokenApproving: true,
      }))
      const token0 = new ERC20Service(
        provider,
        account,
        poolData.token0.address
      )
      const txHash = await token0.approveUnlimited(poolData.address)

      await token0.waitUntilApproved(account, poolData.address, txHash)

      setState((prev) => ({
        ...prev,
        tokenApproving: false,
        tokenApproved: true,
        tokenApproveTx: txHash,
        step: 2,
      }))
    } catch (error) {
      console.error(error)
      setState((prev) => ({
        ...prev,
        tokenApproving: false,
      }))
    }
  }

  const onDeposit = async () => {
    if (!account || !provider) {
      return
    }
    try {
      setState((prev) => ({
        ...prev,
        depositing: true,
      }))

      const { amount } = depositState

      const txId = await clrService.deposit(amount, ZERO)

      const finalTxId = await clrService.waitUntilDeposit(
        amount,
        ZERO,
        account,
        txId.hash
      )

      await clrService.parseProvideLiquidityTx(finalTxId)
      setState((prev) => ({
        ...prev,
        depositing: false,
        depositTx: txId,
        depositDone: true,
      }))

      updateState({
        depositTx: txId.hash,
      })

      localStorage.setItem(
        poolData.address.toLowerCase(),
        new Date().getTime().toString()
      )
    } catch (error) {
      console.error(error)
      setState((prev) => ({
        ...prev,
        depositing: false,
      }))
    }
  }

  const isShowBackButton = !state.tokenApproving && !state.depositing

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        {isShowBackButton ? (
          <ArrowBackIosIcon
            className={classes.arrowBackIosStyle}
            onClick={goBack}
          />
        ) : (
          <div className={classes.arrowBackIosStyle} />
        )}
        <div>
          <Typography className={classes.title}>Deposit Liquidity</Typography>
          <Typography className={classes.description}>
            Please complete all transactions to complete the deposit.
          </Typography>
        </div>
        {isShowBackButton && (
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
            step={1}
            isActiveStep={state.step === 1}
            comment="Approve"
            title={poolData.token0.symbol}
            actionLabel={state.tokenApproved ? 'APPROVED' : 'APPROVE'}
            onConfirm={onApprove}
            actionPending={state.tokenApproving}
            actionDone={state.tokenApproved}
            titleIcon={
              <img
                alt="token"
                className={classes.tokenIcon}
                src={poolData.token0.image}
              />
            }
            rightComponent={
              state.tokenApproved ? (
                <ViewTransaction txId={state.tokenApproveTx} />
              ) : null
            }
          />
          <ActionStepRow
            isLocked={isLocked}
            step={2}
            isActiveStep={state.step === 2}
            comment="Complete"
            title="Deposit"
            actionLabel={state.depositDone ? 'Deposited' : 'Deposit'}
            onConfirm={onDeposit}
            actionPending={state.depositing}
            actionDone={state.depositDone}
            rightComponent={
              state.depositDone && state.depositTx !== '' ? (
                <ViewTransaction txId={state.depositTx} />
              ) : null
            }
          />
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
    </div>
  )
}
