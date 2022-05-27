import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'
import {
  MyPosition,
  OfferingOverview,
  OfferingSummary,
  OriginationLabels,
  PublicSale,
  WhitelistSale,
} from 'utils/enums'

const useStyles = makeStyles(() => ({
  offeringOverview: {
    '&.offerToken': { width: '10%' },
    '&.purchaseToken': { width: '10%' },
    '&.offeringStatus': { width: '15%' },
    '&.offeringReserve': { width: '15%' },
    '&.vestingPeriod': { width: '10%' },
    '&.cliffPeriod': { width: '10%' },
    '&.salesBegin': { width: '10%' },
    '&.salesEnd': { width: '11%' },
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
    '&.startingEndingPrice': { width: '14%' },
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
    '&.narrow': { width: '10% !important' },
  },
  offeringSummary: {
    '&.offerToken': { width: '10%' },
    '&.purchaseToken': { width: '15%' },
    '&.tokensSold': { width: '12%' },
    '&.amountsRaised': { width: '12%' },
    '&.vestingPeriod': { width: '12%' },
    '&.cliffPeriod': { width: '12%' },
    '&.salesCompleted': { width: '12%' },
    '&.timeSinceCompleted': { width: '15%' },
    '&.offeringStatus': { width: '15%' },
    '&.salesEnded': { width: '15%' },
    '&+&': { paddingLeft: 16 },
    '&:last-child': {
      textAlign: 'right',
    },
  },
}))

interface IProps {
  label: OriginationLabels
  type:
    | OfferingOverview
    | WhitelistSale
    | PublicSale
    | MyPosition
    | OfferingSummary
  children: React.ReactNode | React.ReactNode[]
  isVestedPropertiesShow?: boolean
}

export const Td = ({
  type,
  label,
  children,
  isVestedPropertiesShow,
}: IProps) => {
  const cl = useStyles()

  return (
    <div
      className={clsx(cl[label], type, [
        label === OriginationLabels.MyPosition &&
          !isVestedPropertiesShow &&
          'narrow',
      ])}
    >
      {children}
    </div>
  )
}
