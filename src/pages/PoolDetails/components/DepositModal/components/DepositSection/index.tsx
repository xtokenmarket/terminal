import { makeStyles, Typography, IconButton } from '@material-ui/core'
import { useConnectedWeb3Context } from 'contexts'
import { ViewTransaction } from 'components'
import { useIsMountedRef } from 'helpers'
import { IDepositState } from 'pages/PoolDetails/components'
import { useEffect, useState } from 'react'
import { ERC20Service } from 'services'
import { ITerminalPool, PoolService } from 'types'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ClockIcon from '@material-ui/icons/AccessTime'
import { ActionStepRow, WarningInfo } from '..'
import { useCountdown } from 'helpers/useCountdownClock'
import {
  FIVE_MINUTES_IN_MS,
  MINUTE_TIMELOCK_TIMESTAMP,
  ONE_MINUTE_IN_MS,
} from 'config/constants'
import { Network } from 'utils/enums'

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
  depositState: IDepositState
  clrService: PoolService
  poolData: ITerminalPool
  updateState: (e: any) => void
  onClose: () => void
  goBack: () => void
}

interface IState {
  token0Approved: boolean
  token0ApproveTx: string
  token1Approved: boolean
  token1ApproveTx: string
  depositDone: boolean
  token0Approving: boolean
  token1Approving: boolean
  depositing: boolean
  depositTx: string
  step: number
}

export const DepositSection = (props: IProps) => {
  const classes = useStyles()
  const [state, setState] = useState<IState>({
    token0Approved: false,
    token0ApproveTx: '',
    token0Approving: false,
    token1ApproveTx: '',
    token1Approved: false,
    token1Approving: false,
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
      const token0Approved = await token0.hasEnoughAllowance(
        account,
        poolData.address,
        depositState.amount0Estimation
      )
      const token1 = new ERC20Service(
        provider,
        account,
        poolData.token1.address
      )
      const token1Approved = await token1.hasEnoughAllowance(
        account,
        poolData.address,
        depositState.amount1Estimation
      )
      if (isMountedRef.current) {
        let step = 1
        if (token0Approved) step = 2
        if (token0Approved && token1Approved) step = 3
        setState((prev) => ({ ...prev, token0Approved, token1Approved, step }))
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

  const onApprove0 = async () => {
    if (!account || !provider || !networkId) {
      return
    }
    try {
      setState((prev) => ({
        ...prev,
        token0Approving: true,
      }))
      const token0 = new ERC20Service(
        provider,
        account,
        poolData.token0.address
      )
      const txHash = await token0.approveUnlimited(poolData.address, networkId)

      await token0.waitUntilApproved(account, poolData.address, txHash)

      setState((prev) => ({
        ...prev,
        token0Approving: false,
        token0Approved: true,
        step: 2,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        token0Approving: false,
      }))
    }
  }
  const onApprove1 = async () => {
    if (!account || !provider || !networkId) {
      return
    }
    try {
      setState((prev) => ({
        ...prev,
        token1Approving: true,
      }))
      const token1 = new ERC20Service(
        provider,
        account,
        poolData.token1.address
      )
      const txHash = await token1.approveUnlimited(poolData.address, networkId)

      await token1.waitUntilApproved(account, poolData.address, txHash)

      setState((prev) => ({
        ...prev,
        token1Approving: false,
        token1Approved: true,
        step: 3,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        token1Approving: false,
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

      const { amount0, amount1 } = depositState

      const PONY_LP_ADDRESS = '0x11AE2b89175792F57D320a020eaEa879E837fe6c'
      const isPonyLP =
        poolData.network === Network.MAINNET &&
        poolData.address.toLowerCase() === PONY_LP_ADDRESS.toLowerCase()

      const txId = await clrService.deposit(amount0, amount1, isPonyLP)

      const finalTxId = await clrService.waitUntilDeposit(
        amount0,
        amount1,
        account,
        txId.hash
      )

      const data = await clrService.parseProvideLiquidityTx(finalTxId)

      if (data) {
        updateState({
          amount0Used: data.amount0,
          amount1Used: data.amount1,
          liquidityAdded: data.liquidity,
        })
      }

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

  const isShowBackButton =
    !state.token0Approving && !state.token1Approving && !state.depositing

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
            actionLabel={state.token0Approved ? 'APPROVED' : 'APPROVE'}
            onConfirm={onApprove0}
            actionPending={state.token0Approving}
            actionDone={state.token0Approved}
            titleIcon={
              <img
                alt="token"
                className={classes.tokenIcon}
                src={poolData.token0.image}
              />
            }
            rightComponent={
              state.token0Approved && state.token0ApproveTx !== '' ? (
                <ViewTransaction txId={state.token0ApproveTx} />
              ) : null
            }
          />
          <ActionStepRow
            step={2}
            isActiveStep={state.step === 2}
            comment="Approve"
            title={poolData.token1.symbol}
            actionLabel={state.token1Approved ? 'APPROVED' : 'APPROVE'}
            onConfirm={onApprove1}
            actionPending={state.token1Approving}
            actionDone={state.token1Approved}
            titleIcon={
              <img
                alt="token"
                className={classes.tokenIcon}
                src={poolData.token1.image}
              />
            }
            rightComponent={
              state.token1Approved && state.token1ApproveTx !== '' ? (
                <ViewTransaction txId={state.token1ApproveTx} />
              ) : null
            }
          />
          <ActionStepRow
            isLocked={isLocked}
            step={3}
            isActiveStep={state.step === 3}
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
