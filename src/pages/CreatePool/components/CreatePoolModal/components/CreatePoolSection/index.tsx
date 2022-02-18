import { makeStyles, Typography, IconButton } from '@material-ui/core'
import { useConnectedWeb3Context } from 'contexts'
import { useIsMountedRef, useServices } from 'helpers'
import { useEffect, useState } from 'react'
import { ICreatePoolData } from 'types'
import { ActionStepRow, ViewTransaction, WarningInfo } from '..'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import { getContractAddress } from 'config/networks'
import { ERC20Service } from 'services'
import { BigNumber } from 'ethers'

const useStyles = makeStyles((theme) => ({
  root: { backgroundColor: theme.colors.primary500 },
  header: {
    padding: 32,
    position: 'relative',
    paddingBottom: 16,
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
}))

interface IProps {
  onNext: () => void
  poolData: ICreatePoolData
  setPoolAddress: (poolAddress: string) => void
  onClose: () => void
}

interface IState {
  isCompleted: boolean
  isCreatingPool: boolean
  createPoolTx: string
  poolAddress: string
  step: number
  token0Approved: boolean
  token0ApproveTx: string
  token1Approved: boolean
  token1ApproveTx: string
  token0Approving: boolean
  token1Approving: boolean
}

export const CreatePoolSection = (props: IProps) => {
  const classes = useStyles()
  const [state, setState] = useState<IState>({
    isCompleted: false,
    isCreatingPool: false,
    createPoolTx: '',
    poolAddress: '',
    step: 1,
    token0Approved: false,
    token0ApproveTx: '',
    token0Approving: false,
    token1ApproveTx: '',
    token1Approved: false,
    token1Approving: false,
  })
  const { onNext, poolData, setPoolAddress, onClose } = props
  const { lmService } = useServices()
  const { account, library: provider, networkId } = useConnectedWeb3Context()
  const isMountedRef = useIsMountedRef()

  const isPoolCreated = state.createPoolTx !== ''

  const terminalAddress = getContractAddress('LM', networkId)

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
        terminalAddress,
        poolData.amount0
      )
      const token1 = new ERC20Service(
        provider,
        account,
        poolData.token1.address
      )
      const token1Approved = await token1.hasEnoughAllowance(
        account,
        terminalAddress,
        poolData.amount1
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
    if (state.isCompleted) {
      setTimeout(() => {
        onNext()
      }, 2000)
    }
  }, [state.isCompleted])

  const onApprove0 = async () => {
    if (!account || !provider) {
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
      const txHash = await token0.approveUnlimited(terminalAddress)

      await token0.waitUntilApproved(account, terminalAddress, txHash)

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
    if (!account || !provider) {
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
      const txHash = await token1.approveUnlimited(terminalAddress)

      await token1.waitUntilApproved(account, terminalAddress, txHash)

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

  const onCreatePool = async () => {
    if (!account || !provider) {
      return
    }

    try {
      setState((prev) => ({
        ...prev,
        isCreatingPool: true,
      }))

      // const tempPoolData = {
      //   ...poolData,
      //   rewardState: {
      //     ...poolData.rewardState,
      //     vesting: '0.005',
      //   },
      // }
      const txId = await lmService.deployIncentivizedPool(poolData)
      const finalTxId = await lmService.waitUntilTerminalPoolCreated(
        poolData.token0.address,
        poolData.token1.address,
        poolData.tier,
        txId
      )

      const poolAddress = await lmService.parseTerminalPoolCreatedTx(finalTxId)
      setPoolAddress(poolAddress)

      setState((prev) => ({
        ...prev,
        createPoolTx: txId,
        isCreatingPool: false,
        poolAddress,
        isCompleted: true,
      }))
    } catch (error) {
      console.error('Error when deploying terminal pool', error)
      setState((prev) => ({
        ...prev,
        isCreatingPool: false,
      }))
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        {!isPoolCreated && (
          <IconButton className={classes.closeButton} onClick={onClose}>
            <CloseOutlinedIcon />
          </IconButton>
        )}
        <Typography className={classes.title}>Create Pool</Typography>
        <Typography className={classes.description}>
          Please complete all transactions to finish pool creation.
        </Typography>
      </div>
      <div className={classes.content}>
        <WarningInfo
          className={classes.warning}
          title="Warning"
          description="Please, don’t close this window until the process is complete!"
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
            step={3}
            isActiveStep={state.step === 3}
            comment="Complete"
            title="Create Pool"
            actionLabel={isPoolCreated ? 'POOL CREATED' : 'CREATE POOL'}
            onConfirm={onCreatePool}
            actionPending={state.isCreatingPool}
            actionDone={isPoolCreated}
            rightComponent={
              isPoolCreated ? (
                <ViewTransaction txId={state.createPoolTx} />
              ) : null
            }
          />
        </div>
      </div>
    </div>
  )
}
