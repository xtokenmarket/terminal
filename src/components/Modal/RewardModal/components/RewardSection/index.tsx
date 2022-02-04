import { makeStyles, Typography } from '@material-ui/core'
import Abi from 'abis'
import { useConnectedWeb3Context } from 'contexts'
import { useServices } from 'helpers'
import { IRewardState } from 'components'
import { useEffect, useState } from 'react'
import { ERC20Service } from 'services'
import { ActionStepRow, ViewTransaction, WarningInfo } from '../index'
import { parseDuration } from 'utils/number'
import { ITerminalPool } from 'types'

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
  isCreatePool: boolean
  onNext: () => void
  poolData: ITerminalPool
  rewardState: IRewardState
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
  const { isCreatePool, onNext, poolData, rewardState } = props

  const [state, setState] = useState<IState>({
    inited: false,
    initing: false,
    initTx: '',
    approved: rewardState.tokens.map(() => false),
    approving: rewardState.tokens.map(() => false),
    approveTx: rewardState.tokens.map(() => ''),
    step: 1,
  })

  const { multicall, lmService } = useServices()
  const { account, library: provider } = useConnectedWeb3Context()

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
      const calls = rewardState.tokens.map((token) => ({
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
    if (
      state.inited ||
      (isCreatePool && state.step === rewardState.tokens.length + 1)
    ) {
      setTimeout(() => {
        onNext()
      }, 2000)
    }
  }, [state.inited, state.step])

  const onInitialize = async () => {
    if (!account || !provider) {
      return
    }
    try {
      setState((prev) => ({
        ...prev,
        initing: true,
      }))

      const initiateRewardsMethod = poolData.periodFinish.isZero()
        ? lmService.initiateRewardsProgram
        : lmService.initiateNewRewardsProgram
      const txId = await initiateRewardsMethod(
        poolData.address,
        rewardState.amounts,
        parseDuration(rewardState.duration)
      )
      const finalTxId = await lmService.waitUntilRewardsProgramInitiated(
        poolData.address,
        rewardState.amounts,
        parseDuration(rewardState.duration),
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
      const tokenInfo = rewardState.tokens[index]
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
          state.approved.map((element, eIndex) =>
            eIndex === index ? true : element
          )
        ) + 1

      setState((prev) => ({
        ...prev,
        approved: prev.approved.map((element, eIndex) =>
          eIndex === index ? true : element
        ),
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
      setState((prev) => ({
        ...prev,
        approving: prev.approving.map((element, eIndex) =>
          eIndex === index ? false : element
        ),
      }))
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>
          {isCreatePool ? 'Approve Reward Tokens' : 'Initiate Rewards Program'}
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
          {rewardState.tokens.map((token, index) => (
            <ActionStepRow
              key={index}
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
          {!isCreatePool && (
            <ActionStepRow
              step={rewardState.tokens.length + 1}
              isActiveStep={state.step === rewardState.tokens.length + 1}
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
          )}
        </div>
      </div>
    </div>
  )
}
