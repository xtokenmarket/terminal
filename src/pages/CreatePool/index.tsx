import { BigNumber } from '@ethersproject/bignumber'
import { makeStyles } from '@material-ui/core'
import { PageContent, PageHeader, PageWrapper } from 'components'
import { useState } from 'react'
import { useHistory } from 'react-router'
import { IToken } from 'types'
import { ECreatePoolStep } from 'utils/enums'
import { ZERO } from 'utils/number'
import { HeaderStep, TokenPairStep, PriceRangeStep } from './components'

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.colors.white,
    marginBottom: theme.spacing(2),
  },
  content: {
    padding: theme.spacing(3, 0),
  },
}))

interface IState {
  token0?: IToken
  token1?: IToken
  amount0: BigNumber
  amount1: BigNumber
  tier: BigNumber
  uniPool: string
  step: ECreatePoolStep
}

const initialState: IState = {
  tier: BigNumber.from(500),
  uniPool: '',
  step: ECreatePoolStep.TokenPair,
  amount0: ZERO,
  amount1: ZERO,
}

const CreatePool = () => {
  const history = useHistory()
  const classes = useStyles()

  const [state, setState] = useState<IState>(initialState)

  const onBack = () => {
    history.push('/terminal/discover')
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
      case ECreatePoolStep.Rewards:
        setState((prev) => ({ ...prev, step: ECreatePoolStep.Done }))
        break
      default:
        onBack()
        break
    }
  }

  const renderContent = () => {
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
      default:
        return null
    }
  }

  return (
    <PageWrapper>
      {/* <PageHeader
        headerTitle="Create New pool"
        backVisible={false}
        onBack={onBack}
        headerComponent={<HeaderStep step={state.step} onCancel={onBack} />}
      /> */}
      <HeaderStep step={state.step} onCancel={onBack} />
      <PageContent>
        <div className={classes.content}>{renderContent()}</div>
      </PageContent>
    </PageWrapper>
  )
}

export default CreatePool
