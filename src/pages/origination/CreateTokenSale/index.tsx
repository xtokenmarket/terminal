import { useState } from 'react'
import { Button, makeStyles } from '@material-ui/core'
import { PageContent, PageWrapper } from 'components'
import { useConnectedWeb3Context } from 'contexts'
import { useHistory } from 'react-router'
import { ICreateTokenSaleData } from 'types'
import { ECreateTokenSaleStep, EPeriods } from 'utils/enums'
import {
  AuctionStep,
  ConfirmStep,
  CreateTokenSaleHeader,
  OfferingStep,
  VestingStep,
} from './components'

const useStyles = makeStyles((theme) => ({
  pageWrapper: {
    paddingTop: 42,
  },
  label: {
    color: theme.colors.white,
    marginBottom: theme.spacing(2),
  },
  content: {
    paddingTop: theme.spacing(3),
    paddingBottom: 44,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 700,
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

interface IState extends Omit<ICreateTokenSaleData, 'token0' | 'token1'> {
  step: ECreateTokenSaleStep
}

const initialState: IState = {
  offerTokenAmount: '',
  reserveOfferTokenAmount: '',
  vestingEnabled: undefined,
  vestingPeriod: '',
  vestingPeriodUnit: '',
  cliffPeriod: '',
  cliffPeriodUnit: '',
  offerToken: undefined,
  purchaseToken: undefined,
  step: ECreateTokenSaleStep.Offering,
  whitelistSale: {
    enabled: null,
    offeringPeriod: '',
    offeringPeriodUnit: EPeriods.Weeks,
    startingPrice: '',
    endingPrice: '',
    pricingFormula: undefined,
  },
  publicSale: {
    enabled: null,
    offeringPeriod: '',
    offeringPeriodUnit: EPeriods.Weeks,
    startingPrice: '',
    endingPrice: '',
    pricingFormula: undefined,
  },
}

const CreateTokenSale = () => {
  const history = useHistory()
  const classes = useStyles()
  const { account, setWalletConnectModalOpened } = useConnectedWeb3Context()
  const isConnected = !!account

  const [state, setState] = useState<IState>(initialState)

  const onCancel = () => {
    setState(initialState)
    history.push('/origination/discover')
  }

  const updateData = (e: any) => {
    setState((prev) => ({ ...prev, ...e }))
  }

  const onNext = () => {
    switch (state.step) {
      case ECreateTokenSaleStep.Offering:
        setState((prev) => ({ ...prev, step: ECreateTokenSaleStep.Auction }))
        break
      case ECreateTokenSaleStep.Auction:
        setState((prev) => ({ ...prev, step: ECreateTokenSaleStep.Vesting }))
        break
      case ECreateTokenSaleStep.Vesting:
        setState((prev) => ({ ...prev, step: ECreateTokenSaleStep.Confirm }))
        break
      default:
        onCancel()
        break
    }
  }

  const onPrev = () => {
    switch (state.step) {
      case ECreateTokenSaleStep.Confirm:
        setState((prev) => ({ ...prev, step: ECreateTokenSaleStep.Offering }))
        break
      default:
        onCancel()
        break
    }
  }

  const onBack = () => {
    switch (state.step) {
      case ECreateTokenSaleStep.Auction:
        setState((prev) => ({ ...prev, step: ECreateTokenSaleStep.Offering }))
        break
      case ECreateTokenSaleStep.Vesting:
        setState((prev) => ({ ...prev, step: ECreateTokenSaleStep.Auction }))
        break
      case ECreateTokenSaleStep.Confirm:
        setState((prev) => ({ ...prev, step: ECreateTokenSaleStep.Vesting }))
        break
      default:
        onCancel()
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
      case ECreateTokenSaleStep.Offering:
        return (
          <OfferingStep data={state} updateData={updateData} onNext={onNext} />
        )
      case ECreateTokenSaleStep.Auction:
        return (
          <AuctionStep
            data={state as Required<IState>}
            updateData={updateData}
            onNext={onNext}
            onBack={onBack}
          />
        )
      case ECreateTokenSaleStep.Vesting:
        return (
          <VestingStep
            data={state as Required<IState>}
            updateData={updateData}
            onNext={onNext}
            onBack={onBack}
          />
        )
      case ECreateTokenSaleStep.Confirm:
        return (
          <ConfirmStep
            data={state as Required<IState>}
            updateData={updateData}
            onEdit={onPrev}
            onBack={onBack}
          />
        )
      default:
        return null
    }
  }

  return (
    <PageWrapper className={classes.pageWrapper}>
      <CreateTokenSaleHeader step={state.step} onCancel={onCancel} />
      <PageContent>
        <div className={classes.content}>{renderContent()}</div>
      </PageContent>
    </PageWrapper>
  )
}

export default CreateTokenSale
