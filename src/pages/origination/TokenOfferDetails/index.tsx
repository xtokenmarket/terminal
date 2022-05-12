import { Button, makeStyles, Typography } from '@material-ui/core'
import { PageWrapper, PageHeader, PageContent, SimpleLoader } from 'components'
import { useOriginationPool } from 'helpers/useOriginationPool'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { OriginationLabels } from 'utils/enums'
import { transparentize } from 'polished'

import { InitiateSaleModal } from './components/InitiateSaleModal'
import { SetWhitelistModal } from './components/SetWhitelistModal'
import { Table } from './components/Table'
import { ClaimModal } from '../CreateTokenSale/components/ClaimModal'
import { BigNumber } from 'ethers'

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: 14,
    '&:hover': {
      opacity: 0.7,
      backgroundColor: theme.colors.secondary,
    },
    padding: '8px 20px',
    backgroundColor: theme.colors.secondary,
    borderRadius: 4,
  },
  text: {
    color: theme.colors.primary700,
    fontSize: 14,
    fontWeight: 600,
  },
  root: {
    paddingBottom: 10,
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      backgroundColor: transparentize(0.6, theme.colors.primary),
      height: 12,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.colors.primary,
    },
  },
}))

type RouteParams = {
  network: string
  poolAddress: string
}

const OfferingOverview = {
  label: OriginationLabels.OfferingOverview,
  offerToken: {
    address: '0x016750ac630f711882812f24dba6c95b9d35856d',
    decimals: 6,
    image: '/assets/tokens/usdt.png',
    name: 'Tether USD',
    symbol: 'USDT',
  },
  purchaseToken: {
    address: '0x90410304D88E333710703aF6Ed6A14d5ef74575F',
    decimals: 18,
    image: '/assets/tokens/dai.png',
    name: 'DAI',
    symbol: 'DAI',
  },
  offeringStatus: '21K/100k XTK',
  offeringReserve: '80,000 XTK',
  vestingPeriod: '1  Year',
  cliffPeriod: '6 Months',
  salesBegin: 'INITIATE SALE',
  salesEnd: 'April 20 ,2022',
  salesPeriod: '2 Weeks',
}

const WhitelistSale = {
  label: OriginationLabels.WhitelistSale,
  currentPrice: '1.21 USDC',
  pricingFormular: 'Descending',
  startingEndingPrice: '1.25/0.75 USDC',
  whitelist: 'SET WHITELIST',
  addressCap: '1,000 XTK',
  timeRemaining: '6D:14H:37M',
  salesPeriod: '1 Week',
}

const PublicSale = {
  label: OriginationLabels.PublicSale,
  currentPrice: '1.25 USDC',
  pricingFormular: 'Standard',
  price: '1.25 USDC',
  timeRemaining: '6D: 14H: 37M',
  salesPeriod: '1 Week',
}

const MyPosition = {
  label: OriginationLabels.MyPosition,
  tokenPurchased: '912 XTK',
  amountInvested: '1,219 USDC',
  amountvested: '0 XTK',
  amountAvailableToVest: '0 XTK button',
}

interface IState {
  isInitiateSaleModalOpen: boolean
  open: boolean
  isClaimModalOpen: boolean
}

const TokenSaleDetails = () => {
  const cl = useStyles()
  const history = useHistory()
  const { poolAddress } = useParams<RouteParams>()
  const { tokenOffer, loadInfo } = useOriginationPool(poolAddress)
  const [state, setState] = useState<IState>({
    isInitiateSaleModalOpen: false,
    open: false,
    isClaimModalOpen: false,
  })

  const onClose = () => {
    setState((prev) => ({
      ...prev,
      open: false,
    }))
  }

  const onSuccess = async () => {
    setState((prev) => ({
      ...prev,
      open: false,
    }))
    await loadInfo()
  }

  const onInitiateSuccess = async () => {
    setState((prev) => ({
      ...prev,
      isInitiateSaleModalOpen: false,
    }))
    await loadInfo()
  }

  const toggleSetWhitelistModal = () => {
    setState((prev) => ({
      ...prev,
      open: !state.open,
    }))
  }

  const toggleInitiateSaleModal = () => {
    setState((prev) => ({
      ...prev,
      isInitiateSaleModalOpen: !state.isInitiateSaleModalOpen,
    }))
  }

  const toggleClaimModal = () => {
    setState((prev) => ({
      ...prev,
      isClaimModalOpen: !state.isClaimModalOpen,
    }))
  }

  return (
    <PageWrapper>
      <PageHeader
        headerTitle=" "
        backVisible
        onBack={() => history.push('/origination/discover')}
      />
      <PageContent>
        {!tokenOffer ? (
          <SimpleLoader />
        ) : (
          <div className={cl.root}>
            <SetWhitelistModal
              open={state.open}
              onClose={onClose}
              onSuccess={onSuccess}
            />
            <Table
              item={tokenOffer.offeringOverview}
              label={'Offering Overview'}
              toggleModal={toggleInitiateSaleModal}
            />
            <Table
              item={WhitelistSale}
              label={'Whitelist Sale'}
              toggleModal={toggleSetWhitelistModal}
            />
            <Button
              className={cl.button}
              onClick={() => {
                console.log('onClick')
              }}
            >
              <Typography className={cl.text}>INVEST</Typography>
            </Button>
            <Table item={PublicSale} label={'Public Sale'} />
            <Button
              className={cl.button}
              onClick={() => {
                console.log('onClick')
              }}
            >
              <Typography className={cl.text}>INVEST</Typography>
            </Button>
            <Table
              item={MyPosition}
              label={'My Position'}
              toggleModal={toggleClaimModal}
            />
            <InitiateSaleModal
              offerData={tokenOffer.offeringOverview}
              onClose={toggleInitiateSaleModal}
              onSuccess={onInitiateSuccess}
              open={state.isInitiateSaleModalOpen}
            />
            <ClaimModal
              isOpen={state.isClaimModalOpen}
              onClose={toggleClaimModal}
              data={{
                token: tokenOffer.offeringOverview.purchaseToken,
                amount: BigNumber.from('0'),
              }}
            />
          </div>
        )}
      </PageContent>
    </PageWrapper>
  )
}

export default TokenSaleDetails
