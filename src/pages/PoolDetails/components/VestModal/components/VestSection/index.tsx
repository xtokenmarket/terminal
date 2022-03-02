import { makeStyles, Typography } from '@material-ui/core'
import { useConnectedWeb3Context } from 'contexts'
import { useServices } from 'helpers'
import { IVestState } from 'pages/PoolDetails/components'
import { useEffect, useState } from 'react'
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
  vestState: IVestState
  poolData: ITerminalPool
  updateState: (e: any) => void
}

interface IState {
  vestDone: boolean
  vesting: boolean
  vestTx: string
  step: number
}

export const VestSection: React.FC<IProps> = ({
  onNext,
  vestState,
  poolData,
  updateState,
}) => {
  const classes = useStyles()
  const [state, setState] = useState<IState>({
    vestDone: false,
    vesting: false,
    vestTx: '',
    step: 1,
  })
  const { account, library: provider } = useConnectedWeb3Context()

  useEffect(() => {
    if (state.vestDone) {
      setTimeout(() => {
        onNext()
      }, 2000)
    }
  }, [state.vestDone])

  const { rewardEscrow } = useServices()

  const onVest = async () => {
    if (!account || !provider) return
    setState((prev) => ({
      ...prev,
      vesting: true,
    }))
    const { address, rewardState } = poolData
    const rewardTokenAddresses = rewardState.tokens.map(t => t.address)

    const txId = await rewardEscrow.vestAll(address, rewardTokenAddresses)
    const finalTxId = await rewardEscrow.waitUntilVestAll(account, txId)

    setState((prev) => ({
      ...prev,
      vesting: false,
      vestTx: txId,
      vestDone: true,
    }))
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>Vest tokens</Typography>
        <Typography className={classes.description}>
          Please complete all transactions to complete the vest.
        </Typography>
      </div>
      <div className={classes.content}>
        <WarningInfo
          className={classes.warning}
          title="Warning"
          description="Please, don't close this window until the process is complete!"
        />
        <div className={classes.actions}>
          <ActionStepRow
            step={1}
            isActiveStep={state.step === 1}
            comment="Vest"
            title={'Vest'}
            actionLabel={state.vestDone ? 'Vested' : 'Vest'}
            onConfirm={onVest}
            actionPending={state.vesting}
            actionDone={state.vestDone}
            rightComponent={
              state.vestDone && state.vestTx !== '' ? (
                <ViewTransaction txId={state.vestTx} />
              ) : null
            }
          />
        </div>
      </div>
    </div>
  )
}
