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
    '&.offeringStatus': { width: '13%' },
    '&.offeringReserve': { width: '13%' },
    '&.vestingPeriod': { width: '10%' },
    '&.cliffPeriod': { width: '10%' },
    '&.salesBegin': { width: '10%' },
    '&.salesEnd': { width: '10%' },
    '&.salesPeriod': { width: '10%' },
    '&+&': { paddingLeft: 16 },
    '&:last-child': {
      textAlign: 'right',
    },
  },
  whitelistSale: {
    '&.currentPrice': { width: '10%' },
    '&.pricingFormula': { width: '10%' },
    '&.startingEndingPrice': { width: '13%' },
    '&.whitelist': { width: '13%' },
    '&.addressCap': { width: '10%' },
    '&.timeRemaining': { width: '10%' },
    '&.salesPeriod': { width: '10%' },
    '&+&': { paddingLeft: 16 },
    '&:last-child': {
      textAlign: 'right',
    },
  },
  publicSale: {
    '&.currentPrice': { width: '10%' },
    '&.pricingFormula': { width: '10%' },
    '&.startingEndingPrice': { width: '13%' },
    '&.timeRemaining': { width: '13%' },
    '&.salesPeriod': { width: '10%' },
    '&+&': { paddingLeft: 16 },
    '&:last-child': {
      textAlign: 'right',
    },
  },
  myPosition: {
    '&.tokenPurchased': { width: '10%' },
    '&.amountInvested': { width: '10%' },
    '&.amountvested': { width: '13%' },
    '&.amountAvailableToVest': { width: '13%' },
    '&+&': { paddingLeft: 16 },
    '&:last-child': {
      textAlign: 'right',
    },
    '&.narrow': { width: '10% !important' },
  },
  offeringSummary: {
    '&.offerToken': { width: '10%' },
    '&.purchaseToken': { width: '10%' },
    '&.tokensSold': { width: '13%' },
    '&.amountsRaised': { width: '13%' },
    '&.vestingPeriod': { width: '10%' },
    '&.cliffPeriod': { width: '10%' },
    '&.salesCompleted': { width: '10%' },
    '&.timeSinceCompleted': { width: '15%' },
    '&.offeringStatus': { width: '10%' },
    '&.salesEnded': { width: '10%' },
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
