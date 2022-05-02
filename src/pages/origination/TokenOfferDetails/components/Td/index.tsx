import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'
import {
  MyPosition,
  OfferingOverview,
  OriginationLabels,
  PublicSale,
  WhitelistSale,
} from 'utils/enums'

const useStyles = makeStyles(() => ({
  offeringOverview: {
    '&.offerToken': { width: '10%' },
    '&.purchaseToken': { width: '10%' },
    '&.offeringStatus': { width: '10%' },
    '&.offeringReserve': { width: '10%' },
    '&.vestingPeriod': { width: '10%' },
    '&.cliffPeriod': { width: '10%' },
    '&.salesBegin': { width: '15%' },
    '&.salesEnd': { width: '10%' },
    '&.salesPeriod': { width: '10%' },
    '&+&': { paddingLeft: 16 },
    '&:last-child': {
      textAlign: 'right',
    },
  },
  whitelistSale: {
    '&.currentPrice': { width: '14%' },
    '&.pricingFormular': { width: '14%' },
    '&.startingEndingPrice': { width: '14%' },
    '&.whitelist': { width: '14%' },
    '&.addressCap': { width: '14%' },
    '&.timeRemaining': { width: '14%' },
    '&.salesPeriod': { width: '14%' },
    '&+&': { paddingLeft: 16 },
    '&:last-child': {
      textAlign: 'right',
    },
  },
  publicSale: {
    '&.currentPrice': { width: '14%' },
    '&.pricingFormular': { width: '14%' },
    '&.price': { width: '14%' },
    '&.timeRemaining': { width: '14%' },
    '&.salesPeriod': { width: '14%' },
    '&+&': { paddingLeft: 16 },
    '&:last-child': {
      textAlign: 'right',
    },
  },
  myPosition: {
    '&.tokenPurchased': { width: '14%' },
    '&.amountInvested': { width: '14%' },
    '&.amountvested': { width: '14%' },
    '&.amountAvailableToVest': { width: '14%' },
    '&+&': { paddingLeft: 16 },
    '&:last-child': {
      textAlign: 'right',
    },
  },
}))

interface IProps {
  label: OriginationLabels
  type: OfferingOverview | WhitelistSale | PublicSale | MyPosition
  children: React.ReactNode | React.ReactNode[]
}

export const Td = ({ type, label, children }: IProps) => {
  const cl = useStyles()

  return <div className={clsx(cl[label], type)}>{children}</div>
}
