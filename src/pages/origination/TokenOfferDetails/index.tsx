import { PageWrapper, PageHeader, PageContent, SimpleLoader } from 'components'
import { useOriginationPool } from 'helpers/useOriginationPool'
import { useHistory, useParams } from 'react-router'
import { OriginationLabels } from 'utils/enums'
import { Table } from './components/Table'

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
  salesBegin: 'April 6, 2022',
  salesEnd: 'April 20 ,2022',
  salesPeriod: '2 Weeks',
}

const WhitelistSale = {
  label: OriginationLabels.WhitelistSale,
  currentPrice: '1.21 USDC',
  pricingFormular: 'Descending',
  startingEndingPrice: '1.25/0.75 USDC',
  whitelist: 'button',
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

const TokenSaleDetails = () => {
  const history = useHistory()
  const { poolAddress } = useParams<RouteParams>()
  const { tokenOffer } = useOriginationPool(poolAddress)

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
          <div>
            <Table item={OfferingOverview} label={'Offering Overview'} />
            <Table item={WhitelistSale} label={'Whitelist Sale'} />
            <Table item={PublicSale} label={'Public Sale'} />
            <Table item={MyPosition} label={'My Position'} />
          </div>
        )}
      </PageContent>
    </PageWrapper>
  )
}

export default TokenSaleDetails
