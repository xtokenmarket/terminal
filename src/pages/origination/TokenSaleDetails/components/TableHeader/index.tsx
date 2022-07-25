import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'
import { Td } from '../Td'
import {
  MyPosition,
  OfferingOverview,
  OfferingSummary,
  OriginationLabels,
  PublicSale,
  WhitelistSale,
} from 'utils/enums'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    marginBottom: 12,
  },
  item: {
    color: theme.colors.purple0,
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
  },
  itemAlignRight: {
    justifyContent: 'flex-end',
  },
  itemAlignCenter: {
    justifyContent: 'center',
  },
}))

interface IProps {
  label: string
  isVestedPropertiesShow?: boolean
  isOfferUnsuccessful?: boolean
  isFormulaStandard?: boolean
}

export const TableHeader = (props: IProps) => {
  const classes = useStyles()

  if (props.label === OriginationLabels.OfferingOverview) {
    return (
      <div className={classes.root}>
        <Td type={OfferingOverview.OfferToken} label={props.label}>
          <div className={classes.item}>Offer Token</div>
        </Td>
        <Td type={OfferingOverview.PurchaseToken} label={props.label}>
          <div className={classes.item}>Purchase Token</div>
        </Td>
        <Td type={OfferingOverview.OfferingStatus} label={props.label}>
          <div className={classes.item}>Offering Status</div>
        </Td>
        <Td type={OfferingOverview.ReserveAmount} label={props.label}>
          <div className={classes.item}>Reserve Amount</div>
        </Td>
        <Td type={OfferingOverview.VestingPeriod} label={props.label}>
          <div className={classes.item}>Vesting Period</div>
        </Td>
        <Td type={OfferingOverview.CliffPeriod} label={props.label}>
          <div className={classes.item}>Cliff Period</div>
        </Td>
        <Td type={OfferingOverview.SalesBegin} label={props.label}>
          <div className={classes.item}>Sales Begin</div>
        </Td>
        <Td type={OfferingOverview.SalesEnd} label={props.label}>
          <div className={classes.item}>Sales End</div>
        </Td>
      </div>
    )
  }

  if (props.label === OriginationLabels.WhitelistSale) {
    return (
      <div className={classes.root}>
        <Td type={WhitelistSale.CurrentPrice} label={props.label}>
          <div className={classes.item}>Current Price</div>
        </Td>
        <Td type={WhitelistSale.PricingFormula} label={props.label}>
          <div className={classes.item}>Pricing Formula</div>
        </Td>
        {!props.isFormulaStandard && (
          <Td type={WhitelistSale.StartingEndingPrice} label={props.label}>
            <div className={classes.item}>Starting / Ending Price</div>
          </Td>
        )}
        <Td type={WhitelistSale.Whitelist} label={props.label}>
          <div className={classes.item}>Whitelist</div>
        </Td>
        <Td type={WhitelistSale.AddressCap} label={props.label}>
          <div className={classes.item}>Address Cap</div>
        </Td>
        <Td type={WhitelistSale.TimeRemaining} label={props.label}>
          <div className={classes.item}>Time Remaining</div>
        </Td>
        <Td type={WhitelistSale.SalesPeriod} label={props.label}>
          <div className={classes.item}>Sale Period</div>
        </Td>
      </div>
    )
  }

  if (props.label === OriginationLabels.PublicSale) {
    return (
      <div className={classes.root}>
        <Td type={PublicSale.CurrentPrice} label={props.label}>
          <div className={classes.item}>Current Price</div>
        </Td>
        <Td type={PublicSale.PricingFormula} label={props.label}>
          <div className={classes.item}>Pricing Formula</div>
        </Td>
        {!props.isFormulaStandard && (
          <Td type={PublicSale.StartingEndingPrice} label={props.label}>
            <div className={classes.item}>Starting / Ending Price</div>
          </Td>
        )}
        <Td type={PublicSale.TimeRemaining} label={props.label}>
          <div className={classes.item}>Time Remaining</div>
        </Td>
        <Td type={PublicSale.SalesPeriod} label={props.label}>
          <div className={classes.item}>Sale Period</div>
        </Td>
      </div>
    )
  }

  if (props.label === OriginationLabels.MyPosition) {
    return (
      <div className={classes.root}>
        {!props.isOfferUnsuccessful && (
          <Td type={MyPosition.TokenPurchased} label={props.label}>
            <div className={classes.item}>Token Purchased</div>
          </Td>
        )}
        <Td type={MyPosition.AmountInvested} label={props.label}>
          <div className={classes.item}>Amount Invested</div>
        </Td>
        {props.isVestedPropertiesShow && (
          <>
            <Td type={MyPosition.Amountvested} label={props.label}>
              <div className={classes.item}>Amount Vested</div>
            </Td>
            <Td type={MyPosition.AmountAvailableToVest} label={props.label}>
              <div className={classes.item}>Amount Available To Vest</div>
            </Td>
          </>
        )}
      </div>
    )
  }

  if (props.label === OriginationLabels.OfferingSummary) {
    return (
      <div className={classes.root}>
        <Td type={OfferingSummary.OfferToken} label={props.label}>
          <div className={classes.item}>Offer Token</div>
        </Td>
        <Td type={OfferingSummary.PurchaseToken} label={props.label}>
          <div className={classes.item}>Purchase Token</div>
        </Td>
        {props.isOfferUnsuccessful && (
          <>
            <Td type={OfferingSummary.OfferingStatus} label={props.label}>
              <div className={classes.item}>Offering Status</div>
            </Td>
            <Td type={OfferingSummary.SalesEnded} label={props.label}>
              <div className={classes.item}>Sales Ended</div>
            </Td>
          </>
        )}
        {!props.isOfferUnsuccessful && (
          <>
            <Td type={OfferingSummary.TokensSold} label={props.label}>
              <div className={classes.item}>Tokens Sold</div>
            </Td>
            <Td type={OfferingSummary.AmountsRaised} label={props.label}>
              <div className={classes.item}>Amounts Raised</div>
            </Td>
            <Td type={OfferingSummary.VestingPeriod} label={props.label}>
              <div className={classes.item}>Vesting Period</div>
            </Td>
            <Td type={OfferingSummary.CliffPeriod} label={props.label}>
              <div className={classes.item}>Cliff Period</div>
            </Td>
            <Td type={OfferingSummary.SalesCompleted} label={props.label}>
              <div className={classes.item}>Sales Completed</div>
            </Td>
            <Td type={OfferingSummary.TimeSinceCompleted} label={props.label}>
              <div className={classes.item}>Time Since Completed</div>
            </Td>
          </>
        )}
      </div>
    )
  }

  return <></>
}
