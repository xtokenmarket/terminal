import { useState } from 'react'
import { Button, makeStyles } from '@material-ui/core'
import { PageContent, PageWrapper } from 'components'
import { useConnectedWeb3Context } from 'contexts'
import { useHistory } from 'react-router'
import { ICreateTokenSaleData } from 'types'
import { ECreareTokenSaleStep, EPeriods } from 'utils/enums'
import {
  OfferingStep,
  AuctionStep,
  VestingStep,
  CreareTokenSaleHeader,
  ConfirmStep,
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
  step: ECreareTokenSaleStep
}

const initialState: IState = {
  offerTokenAmount: '',
  reserveOfferTokenAmount: '',
  publicOfferingPeriod: '',
  pricingFormula: undefined,
  publicStartingPrice: '',
  publicEndingPrice: '',
  vestingEnabled: undefined,
  vestingPeriod: '',
  vestingPeriodUnit: '',
  cliffPeriod: '',
  cliffPeriodUnit: '',
  offerToken: undefined,
  purchaseToken: undefined,
  step: ECreareTokenSaleStep.Auction,
  publicOfferingPeriodUnit: EPeriods.Weeks,
  whitelistStartingPrice: '',
  whitelistEndingPrice: '',
  whitelistOfferingPeriod: '',
  whitelistOfferingPeriodUnit: '',
  publicSaleEnabled: false,
  whitelistSaleEnabled: false,
}

const CreareTokenSale = () => {
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
      case ECreareTokenSaleStep.Offering:
        setState((prev) => ({ ...prev, step: ECreareTokenSaleStep.Auction }))
        break
      case ECreareTokenSaleStep.Auction:
        setState((prev) => ({ ...prev, step: ECreareTokenSaleStep.Vesting }))
        break
      case ECreareTokenSaleStep.Vesting:
        setState((prev) => ({ ...prev, step: ECreareTokenSaleStep.Confirm }))
        break
      default:
        onCancel()
        break
    }
  }

  const onPrev = () => {
    switch (state.step) {
      case ECreareTokenSaleStep.Confirm:
        setState((prev) => ({ ...prev, step: ECreareTokenSaleStep.Offering }))
        break
      default:
        onCancel()
        break
    }
  }

  const onBack = () => {
    switch (state.step) {
      case ECreareTokenSaleStep.Auction:
        setState((prev) => ({ ...prev, step: ECreareTokenSaleStep.Offering }))
        break
      case ECreareTokenSaleStep.Vesting:
        setState((prev) => ({ ...prev, step: ECreareTokenSaleStep.Auction }))
        break
      case ECreareTokenSaleStep.Confirm:
        setState((prev) => ({ ...prev, step: ECreareTokenSaleStep.Vesting }))
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
      case ECreareTokenSaleStep.Offering:
        return (
          <OfferingStep data={state} updateData={updateData} onNext={onNext} />
        )
      case ECreareTokenSaleStep.Auction:
        return (
          <AuctionStep
            data={state as Required<IState>}
            updateData={updateData}
            onNext={onNext}
          />
        )
      case ECreareTokenSaleStep.Vesting:
        return (
          <VestingStep
            data={state as Required<IState>}
            updateData={updateData}
            onNext={onNext}
          />
        )
      case ECreareTokenSaleStep.Confirm:
        return (
          <ConfirmStep
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
    <PageWrapper className={classes.pageWrapper}>
      <CreareTokenSaleHeader
        step={state.step}
        onCancel={onCancel}
        onBack={onBack}
      />
      <PageContent>
        <div className={classes.content}>{renderContent()}</div>
      </PageContent>
    </PageWrapper>
  )
}

export default CreareTokenSale
