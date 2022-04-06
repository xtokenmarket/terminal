import { BigNumber } from '@ethersproject/bignumber'
import { Button, makeStyles } from '@material-ui/core'
import { DEFAULT_REWARD_STATE, PageContent, PageWrapper } from 'components'
import { useConnectedWeb3Context } from 'contexts'
import { useState } from 'react'
import { useHistory } from 'react-router'
import { ICreatePoolData, IToken } from 'types'
import { ECreatePoolStep } from 'utils/enums'
import { ZERO } from 'utils/number'
import {
  CreatePoolHeader,
  TokenPairStep,
  PriceRangeStep,
  RewardsStep,
} from './components'

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.colors.white,
    marginBottom: theme.spacing(2),
  },
  content: {
    padding: theme.spacing(3, 0),
  },
  connectBtn: {
    background: theme.colors.primary,
    borderRadius: 4,
    height: 40,
    [theme.breakpoints.down(theme.custom.xsss)]: {
      height: 36,
    },
  },
}))

interface IState extends Omit<ICreatePoolData, 'token0' | 'token1'> {
  step: ECreatePoolStep
  token0?: IToken
  token1?: IToken
}

const initialState: IState = {
  amount1: ZERO,
  amount0: ZERO,
  maxPrice: '',
  minPrice: '',
  rewardState: DEFAULT_REWARD_STATE,
  step: ECreatePoolStep.TokenPair,
  ticks: {
    lowerTick: 0,
    upperTick: 0,
  },
  tier: BigNumber.from(500),
  uniPool: '',
}

const CreatePool = () => {
  const history = useHistory()
  const classes = useStyles()
  const { account, setWalletConnectModalOpened } = useConnectedWeb3Context()
  const isConnected = !!account

  const [state, setState] = useState<IState>(initialState)

  const onBack = () => {
    setState(initialState)
    history.push('/mining/discover')
  }

  const updateData = (e: any) => {
    setState((prev) => ({ ...prev, ...e }))
  }

  const onNext = () => {
    switch (state.step) {
      case ECreatePoolStep.TokenPair:
        setState((prev) => ({ ...prev, step: ECreatePoolStep.PriceRange }))
        break
      case ECreatePoolStep.PriceRange:
        setState((prev) => ({ ...prev, step: ECreatePoolStep.Rewards }))
        break
      default:
        onBack()
        break
    }
  }

  const onPrev = () => {
    switch (state.step) {
      case ECreatePoolStep.Rewards:
        setState((prev) => ({ ...prev, step: ECreatePoolStep.PriceRange }))
        break
      default:
        onBack()
        break
    }
  }

  const renderContent = () => {
    if (!isConnected) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            color="primary"
            variant="contained"
            className={classes.connectBtn}
            onClick={() => setWalletConnectModalOpened(true)}
          >
            CONNECT WALLET
          </Button>
        </div>
      )
    }
    switch (state.step) {
      case ECreatePoolStep.TokenPair:
        return (
          <TokenPairStep data={state} updateData={updateData} onNext={onNext} />
        )
      case ECreatePoolStep.PriceRange:
        return (
          <PriceRangeStep
            data={state as Required<IState>}
            updateData={updateData}
            onNext={onNext}
          />
        )
      case ECreatePoolStep.Rewards:
        return (
          <RewardsStep
            data={state as Required<IState>}
            updateData={updateData}
            onEdit={onPrev}
          />
        )
      default:
        return null
    }
  }

  return (
    <PageWrapper>
      <CreatePoolHeader step={state.step} onCancel={onBack} />
      <PageContent>
        <div className={classes.content}>{renderContent()}</div>
      </PageContent>
    </PageWrapper>
  )
}

export default CreatePool
