import { makeStyles, Typography } from '@material-ui/core'
import { useConnectedWeb3Context } from 'contexts'
import { useServices } from 'helpers'
import { useEffect, useState } from 'react'
import { ICreatePoolData } from 'types'
import { ActionStepRow, ViewTransaction, WarningInfo } from '..'
import { parseDuration } from '../../../../../../utils/number'

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
}))

interface IProps {
  onNext: () => void
  poolData: ICreatePoolData
  setPoolAddress: (poolAddress: string) => void
}

interface IState {
  isCompleted: boolean
  isCreatingPool: boolean
  isInitiatingRewards: boolean
  createPoolTx: string
  initiateRewardsTx: string
  poolAddress: string
  step: number
}

export const CreatePoolSection = (props: IProps) => {
  const classes = useStyles()
  const [state, setState] = useState<IState>({
    isCompleted: false,
    isCreatingPool: false,
    isInitiatingRewards: false,
    createPoolTx: '',
    initiateRewardsTx: '',
    poolAddress: '',
    step: 1,
  })
  const { onNext, poolData, setPoolAddress } = props
  const { lmService } = useServices()
  const { account, library: provider } = useConnectedWeb3Context()

  const isPoolCreated = state.createPoolTx !== ''

  useEffect(() => {
    if (state.isCompleted) {
      setTimeout(() => {
        onNext()
      }, 2000)
    }
  }, [state.isCompleted])

  const onCreatePool = async () => {
    if (!account || !provider) {
      return
    }

    try {
      setState((prev) => ({
        ...prev,
        isCreatingPool: true,
      }))

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
      }))
    } catch (error) {
      console.error('Error when deploying terminal pool', error)
      setState((prev) => ({
        ...prev,
        isCreatingPool: false,
      }))
    }
  }

  const onInitiateRewards = async () => {
    if (!account || !provider) {
      return
    }
    try {
      setState((prev) => ({
        ...prev,
        initing: true,
      }))
      const txId = await lmService.initiateRewardsProgram(
        state.poolAddress,
        poolData.rewardState.amounts
      )
      const finalTxId = await lmService.waitUntilRewardsProgramInitiated(
        state.poolAddress,
        poolData.rewardState.amounts,
        parseDuration(poolData.rewardState.duration),
        txId
      )

      setState((prev) => ({
        ...prev,
        isInitiatingRewards: false,
        initiateRewardsTx: txId,
        isCompleted: true,
      }))
    } catch (error) {
      console.error('Error while initiating rewards', error)
      setState((prev) => ({
        ...prev,
        isInitiatingRewards: false,
      }))
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>Create Pool</Typography>
        <Typography className={classes.description}>
          Please complete the transaction to finish pool creation.
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
            comment="Deploy"
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
          <ActionStepRow
            step={2}
            isActiveStep={state.step === 2}
            comment="Complete"
            title="Initiate Rewards"
            actionLabel={state.isCompleted ? 'DONE' : 'INITIATE'}
            onConfirm={onInitiateRewards}
            actionPending={state.isInitiatingRewards}
            actionDone={state.isCompleted}
            rightComponent={
              state.isCompleted && state.initiateRewardsTx !== '' ? (
                <ViewTransaction txId={state.initiateRewardsTx} />
              ) : null
            }
          />
        </div>
      </div>
    </div>
  )
}
