import { makeStyles, Typography } from '@material-ui/core'
import Abi from 'abis'
import { ONE_WEEK_IN_TIME } from 'config/constants'
import { useConnectedWeb3Context } from 'contexts'
import { useIsMountedRef, useServices } from 'helpers'
import { IRewardState } from 'components'
import { useEffect, useState } from 'react'
import { ERC20Service } from 'services'
import { ITerminalPool } from 'types'
import { ActionStepRow, ViewTransaction, WarningInfo } from '..'

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
  rewardState: IRewardState
  poolData: ITerminalPool
  updateState: (e: any) => void
}

interface IState {
  inited: boolean
  initing: boolean
  initTx: string
  approved: boolean[]
  approving: boolean[]
  approveTx: string[]
  step: number
}

export const RewardSection = (props: IProps) => {
  const classes = useStyles()
  const { onNext, rewardState, poolData, updateState } = props
  const [state, setState] = useState<IState>({
    inited: false,
    initing: false,
    initTx: '',
    approved: poolData.rewardTokens.map((e) => false),
    approving: poolData.rewardTokens.map((e) => false),
    approveTx: poolData.rewardTokens.map((e) => ''),
    step: 1,
  })

  const { multicall, lmService } = useServices()
  const { account, networkId, library: provider } = useConnectedWeb3Context()

  const isMountedRef = useIsMountedRef()

  const getNextApproveIndex = (approved: boolean[]) => {
    let index = 0
    while (approved[index] && index < approved.length) {
      index++
    }
    return index
  }

  const loadInitInfo = async () => {
    if (!account) {
      return
    }
    try {
      const calls = poolData.rewardTokens.map((token) => ({
        name: 'allowance',
        address: token.address,
        params: [account, lmService.address],
      }))
      const response = await multicall.multicallv2(Abi.ERC20, calls, {
        requireSuccess: false,
      })
      const approved = response.map(
        (e: any, index: number) => e[0] > rewardState.amounts[index]
      )
      const stepNumber = getNextApproveIndex(approved) + 1
      setState((prev) => ({ ...prev, approved, step: stepNumber }))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadInitInfo()
  }, [])

  useEffect(() => {
    if (state.inited) {
      setTimeout(() => {
        onNext()
      }, 2000)
    }
  }, [state.inited])

  const onInitialize = async () => {
    if (!account || !provider) {
      return
    }
    try {
      setState((prev) => ({
        ...prev,
        initing: true,
      }))
      const txId = await lmService.initiateNewRewardsProgram(
        poolData.address,
        rewardState.amounts,
        Number(rewardState.period) * ONE_WEEK_IN_TIME,
        poolData.rewardsAreEscrowed
      )
      const finalTxId = await lmService.waitUntilNewRewardsProgramInitiated(
        poolData.address,
        rewardState.amounts,
        Number(rewardState.period) * ONE_WEEK_IN_TIME,
        txId
      )

      setState((prev) => ({
        ...prev,
        initing: false,
        initTx: txId,
        inited: true,
      }))
    } catch (error) {
      console.error(error)
      setState((prev) => ({
        ...prev,
        initing: false,
      }))
    }
  }

  const onApprove = async (index: number) => {
    if (!account || !provider) {
      return
    }
    try {
      const tokenInfo = poolData.rewardTokens[index]
      const token = new ERC20Service(provider, account, tokenInfo.address)
      setState((prev) => ({
        ...prev,
        approving: prev.approving.map((element, eIndex) =>
          eIndex === index ? true : element
        ),
      }))
      const txHash = await token.approveUnlimited(lmService.address)
      const finalHash = await token.waitUntilApproved(
        account,
        lmService.address,
        txHash
      )
      const stepNumber =
        getNextApproveIndex(
          state.approving.map((element, eIndex) =>
            eIndex === index ? false : element
          )
        ) + 1

      setState((prev) => ({
        ...prev,
        approving: prev.approving.map((element, eIndex) =>
          eIndex === index ? false : element
        ),
        approveTx: prev.approveTx.map((element, eIndex) =>
          eIndex === index ? finalHash : element
        ),
        step: stepNumber,
      }))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>
          Initiate Rewards Program
        </Typography>
        <Typography className={classes.description}>
          Please complete all transactions to complete the rewards program.
        </Typography>
      </div>
      <div className={classes.content}>
        <WarningInfo
          className={classes.warning}
          title="Warning"
          description="Please, don’t close this window until the process is complete!"
        />
        <div className={classes.actions}>
          {poolData.rewardTokens.map((token, index) => (
            <ActionStepRow
              step={index + 1}
              isActiveStep={state.step === index + 1}
              comment="Approve"
              title={token.symbol}
              actionLabel={state.approved[index] ? 'APPROVED' : 'APPROVE'}
              onConfirm={async () => {
                await onApprove(index)
              }}
              actionPending={state.approving[index]}
              actionDone={state.approved[index]}
              titleIcon={
                <img
                  alt="token"
                  className={classes.tokenIcon}
                  src={token.image}
                />
              }
              rightComponent={
                state.approved[index] && state.approveTx[index] !== '' ? (
                  <ViewTransaction txId={state.approveTx[index]} />
                ) : null
              }
            />
          ))}
          <ActionStepRow
            step={poolData.rewardTokens.length + 1}
            isActiveStep={state.step === poolData.rewardTokens.length + 1}
            comment="Complete"
            title="Initiate"
            actionLabel={state.inited ? 'Initiated' : 'Initiate'}
            onConfirm={onInitialize}
            actionPending={state.initing}
            actionDone={state.inited}
            rightComponent={
              state.inited && state.initTx !== '' ? (
                <ViewTransaction txId={state.initTx} />
              ) : null
            }
          />
        </div>
      </div>
    </div>
  )
}
