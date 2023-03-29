import { makeStyles, Typography, IconButton } from '@material-ui/core'
import { useConnectedWeb3Context } from 'contexts'
import { useIsMountedRef, useServices } from 'helpers'
import React, { useEffect, useState } from 'react'
import { ICreatePoolData } from 'types'
import { ActionStepRow } from '../index'
import { WarningInfo } from 'components/Common/WarningInfo'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import { getContractAddress } from 'config/networks'
import { ERC20Service } from 'services'
import { getMetamaskError } from 'utils'

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
  error: {
    marginTop: 24,
  },
}))

interface IProps {
  onNext: () => void
  poolData: ICreatePoolData
  setPoolAddress: (poolAddress: string) => void
  setTxId: (txId: string) => void
  onClose: () => void
}

interface IState {
  isCompleted: boolean
  isCreatingPool: boolean
  createPoolTx: string
  error: string
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
  const { lmService } = useServices()
  const { account, library: provider, networkId } = useConnectedWeb3Context()
  const isMountedRef = useIsMountedRef()

  const [state, setState] = useState<IState>({
    isCompleted: false,
    isCreatingPool: false,
    createPoolTx: '',
    error: '',
    poolAddress: '',
    step: 1,
    token0Approved: false,
    token0ApproveTx: '',
    token0Approving: false,
    token1ApproveTx: '',
    token1Approved: false,
    token1Approving: false,
  })

  const { onNext, poolData, setPoolAddress, setTxId, onClose } = props

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
      const txHash = await token0.approveUnlimited(terminalAddress)

      await token0.waitUntilApproved(account, terminalAddress, txHash)

      setState((prev) => ({
        ...prev,
        token0Approving: false,
        token0Approved: true,
        step: prev.token1Approved ? 3 : 2,
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
    if (!account || !provider || !networkId) {
      return
    }

    try {
      setState((prev) => ({
        ...prev,
        isCreatingPool: true,
      }))

      const isCustomFeeEnabled = await lmService.isCustomFeeEnabled(
        account as string
      )

      let deploymentFee
      if (isCustomFeeEnabled) {
        deploymentFee = await lmService.getCustomFee(account as string)
      }

      let txId = ''
      if (poolData.incentivized) {
        txId = await lmService.deployIncentivizedPool(
          poolData,
          networkId,
          deploymentFee
        )
      } else {
        txId = await lmService.deployNonIncentivizedPool(
          poolData,
          networkId,
          deploymentFee
        )
      }

      const finalTxId = await lmService.waitUntilTerminalPoolCreated(
        poolData,
        txId
      )

      const poolAddress = await lmService.parseTerminalPoolCreatedTx(
        poolData,
        finalTxId
      )
      setPoolAddress(poolAddress)
      setTxId(finalTxId)

      localStorage.setItem(
        poolAddress.toLowerCase(),
        new Date().getTime().toString()
      )

      setState((prev) => ({
        ...prev,
        createPoolTx: txId,
        isCreatingPool: false,
        poolAddress,
        isCompleted: true,
      }))
    } catch (error: any) {
      console.error('Error when deploying terminal pool', error)
      const metamaskError = getMetamaskError(error)

      setState((prev) => ({
        ...prev,
        error: metamaskError || '',
        isCreatingPool: false,
      }))

      if (metamaskError) {
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            error: '',
          }))
        }, 8000)
      }
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
          />
          <ActionStepRow
            step={3}
            isActiveStep={state.step === 3 && !state.error}
            comment="Complete"
            title="Create Pool"
            actionLabel={isPoolCreated ? 'POOL CREATED' : 'CREATE POOL'}
            onConfirm={onCreatePool}
            actionPending={state.isCreatingPool}
            actionDone={isPoolCreated}
          />
          {state.error && (
            <Typography align="center" className={classes.error} color="error">
              {state.error}
            </Typography>
          )}
        </div>
      </div>
    </div>
  )
}
