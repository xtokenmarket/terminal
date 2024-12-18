import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'
import {
  UserPosition,
  OfferingOverview,
  OfferingSummary,
  OriginationLabels,
  PublicSale,
  WhitelistSale,
} from 'utils/enums'

const useStyles = makeStyles(() => ({
  offeringOverview: {
    '&.offerToken': { width: '12%' },
    '&.purchaseToken': { width: '12%' },
    '&.offeringStatus': { width: '12%' },
    '&.reserveAmount': { width: '12%' },
    '&.vestingPeriod': { width: '12%' },
    '&.cliffPeriod': { width: '12%' },
    '&.salesBegin': { width: '12%' },
    '&.salesEnd': { width: '12%' },
    '&.salesPeriod': { width: '12%' },
    '&+&': { paddingLeft: 16 },
    // '&:last-child': {
    //   textAlign: 'right',
    // },
  },
  whitelistSale: {
    '&.currentPrice': { width: '12%' },
    '&.pricingFormula': { width: '12%' },
    '&.startingEndingPrice': { width: '12%' },
    '&.whitelist': { width: '12%' },
    '&.addressCap': { width: '12%' },
    '&.timeRemaining': { width: '12%' },
    '&.salesPeriod': { width: '12%' },
    '&+&': { paddingLeft: 16 },
    // '&:last-child': {
    //   textAlign: 'right',
    // },
  },
  publicSale: {
    '&.currentPrice': { width: '12%' },
    '&.pricingFormula': { width: '12%' },
    '&.startingEndingPrice': { width: '12%' },
    '&.timeRemaining': { width: '12%' },
    '&.salesPeriod': { width: '12%' },
    '&+&': { paddingLeft: 16 },
    // '&:last-child': {
    //   textAlign: 'right',
    // },
  },
  userPosition: {
    '&.tokenPurchased': { width: '12%' },
    '&.amountInvested': { width: '12%' },
    '&.amountVested': { width: '12%' },
    '&.amountAvailableToVest': { width: '12%' },
    '&.vestableAt': { width: '12%' },
    '&.timeToFullVest': { width: '12%' },
    '&.amountAvailableToVestToWallet': { width: '12%' },
    '&+&': { paddingLeft: 16 },
  },
  offeringSummary: {
    '&.offerToken': { width: '12%' },
    '&.purchaseToken': { width: '12%' },
    '&.tokensAcquired': { width: '12%' },
    '&.purchaseTokenRaised': { width: '12%' },
    '&.vestingPeriod': { width: '12%' },
    '&.cliffPeriod': { width: '12%' },
    '&.salesCompleted': { width: '12%' },
    '&.timeSinceCompleted': { width: '12%' },
    '&.offeringStatus': { width: '12%' },
    '&.salesEnded': { width: '12%' },
    '&+&': { paddingLeft: 16 },
    // '&:last-child': {
    //   textAlign: 'right',
    // },
  },
}))

interface IProps {
  label: OriginationLabels
  type:
    | OfferingOverview
    | WhitelistSale
    | PublicSale
    | UserPosition
    | OfferingSummary
  children: React.ReactNode | React.ReactNode[]
}

export const Td = ({ type, label, children }: IProps) => {
  const cl = useStyles()

  return <div className={clsx(cl[label], type)}>{children}</div>
}
