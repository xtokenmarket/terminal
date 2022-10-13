import { makeStyles } from '@material-ui/core'
import {
  UserPosition,
  OfferingOverview,
  OfferingSummary,
  OriginationLabels,
  PublicSale,
  WhitelistSale,
  InfoText,
} from 'utils/enums'

import { Td } from '../Td'
import { QuestionTooltip } from '../../../CreateTokenSale/components/QuestionTooltip'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    marginBottom: 12,
  },
  item: {
    color: theme.colors.purple0,
    fontSize: 12,
    display: 'inline-flex',
    alignItems: 'center',
  },
  itemAlignRight: {
    justifyContent: 'flex-end',
  },
  itemAlignCenter: {
    justifyContent: 'center',
  },
  tooltipQuestion: {
    marginLeft: 4,
    verticalAlign: 'middle',
  },
}))

interface IProps {
  label: string
  isVestedPropertiesShow?: boolean
  isOfferUnsuccessful?: boolean
  isFormulaStandard?: boolean
  isSaleCompleted?: boolean
  isSaleInitiated?: boolean
  isTimeRemainingToCliffShow?: boolean
  isTimeToFullVestShow?: boolean
}

export const TableHeader = (props: IProps) => {
  const classes = useStyles()

  if (props.label === OriginationLabels.OfferingOverview) {
    return (
      <div className={classes.root}>
        <Td type={OfferingOverview.OfferToken} label={props.label}>
          <div className={classes.item}>Offer Token</div>
          <QuestionTooltip
            title={InfoText.OfferToken}
            className={classes.tooltipQuestion}
          />
        </Td>
        <Td type={OfferingOverview.PurchaseToken} label={props.label}>
          <div className={classes.item}>Purchase Token</div>
          <QuestionTooltip
            title={InfoText.PurchaseToken}
            className={classes.tooltipQuestion}
          />
        </Td>
        <Td type={OfferingOverview.OfferingStatus} label={props.label}>
          <div className={classes.item}>Offering Status</div>
          <QuestionTooltip
            title={InfoText.OfferingStatus}
            className={classes.tooltipQuestion}
          />
        </Td>
        <Td type={OfferingOverview.ReserveAmount} label={props.label}>
          <div className={classes.item}>Purchase Token Raised</div>
          <QuestionTooltip
            title={InfoText.ReserveOfferTokenAmount}
            className={classes.tooltipQuestion}
          />
        </Td>
        <Td type={OfferingOverview.VestingPeriod} label={props.label}>
          <div className={classes.item}>Vesting Period</div>
          <QuestionTooltip
            title={InfoText.VestingPeriod}
            className={classes.tooltipQuestion}
          />
        </Td>
        <Td type={OfferingOverview.CliffPeriod} label={props.label}>
          <div className={classes.item}>Cliff Period</div>
          <QuestionTooltip
            title={InfoText.CliffPeriod}
            className={classes.tooltipQuestion}
          />
        </Td>
        <Td type={OfferingOverview.SalesBegin} label={props.label}>
          <div className={classes.item}>Sale Begins</div>
        </Td>
        <Td type={OfferingOverview.SalesEnd} label={props.label}>
          <div className={classes.item}>Sale Ends</div>
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
        {!props.isSaleInitiated && (
          <Td type={WhitelistSale.Whitelist} label={props.label}>
            <div className={classes.item}>Allowlist</div>
          </Td>
        )}
        <Td type={WhitelistSale.AddressCap} label={props.label}>
          <div className={classes.item}>Your Max Contribution</div>
        </Td>
        <Td type={WhitelistSale.TimeRemaining} label={props.label}>
          <div className={classes.item}>Time Remaining</div>
        </Td>
        <Td type={WhitelistSale.SalesPeriod} label={props.label}>
          <div className={classes.item}>Offering Period</div>
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
          <div className={classes.item}>Offering Period</div>
        </Td>
      </div>
    )
  }

  if (props.label === OriginationLabels.UserPosition) {
    return (
      <div className={classes.root}>
        {!props.isOfferUnsuccessful && (
          <Td type={UserPosition.TokenPurchased} label={props.label}>
            <div className={classes.item}>Tokens Purchased</div>
          </Td>
        )}
        <Td type={UserPosition.AmountInvested} label={props.label}>
          <div className={classes.item}>Amount Contributed</div>
        </Td>
        {props.isVestedPropertiesShow && (
          <>
            <Td type={UserPosition.AmountVested} label={props.label}>
              <div className={classes.item}>Amount Vested</div>
            </Td>
            <Td type={UserPosition.AmountVested} label={props.label}>
              <div className={classes.item}>
                Amount Available to Vest to Wallet
              </div>
            </Td>
            <Td type={UserPosition.AmountAvailableToVest} label={props.label}>
              <div className={classes.item}>Amount of Future Vest</div>
            </Td>
            {props.isSaleCompleted && (
              <>
                {props.isTimeRemainingToCliffShow && (
                  <Td type={UserPosition.VestableAt} label={props.label}>
                    <div className={classes.item}>Time Remaining to Cliff</div>
                  </Td>
                )}
                {props.isTimeToFullVestShow && (
                  <Td type={UserPosition.TimeToFullVest} label={props.label}>
                    <div className={classes.item}>Time to Full Vest</div>
                  </Td>
                )}
              </>
            )}
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
          <QuestionTooltip
            title={InfoText.OfferToken}
            className={classes.tooltipQuestion}
          />
        </Td>
        <Td type={OfferingSummary.PurchaseToken} label={props.label}>
          <div className={classes.item}>Purchase Token</div>
          <QuestionTooltip
            title={InfoText.PurchaseToken}
            className={classes.tooltipQuestion}
          />
        </Td>
        {props.isOfferUnsuccessful && (
          <>
            <Td type={OfferingSummary.OfferingStatus} label={props.label}>
              <div className={classes.item}>Offering Status</div>
              <QuestionTooltip
                title={InfoText.OfferingStatus}
                className={classes.tooltipQuestion}
              />
            </Td>
            <Td type={OfferingSummary.SalesEnded} label={props.label}>
              <div className={classes.item}>Sales Ended</div>
            </Td>
          </>
        )}
        {!props.isOfferUnsuccessful && (
          <>
            <Td type={OfferingSummary.TokensAcquired} label={props.label}>
              <div className={classes.item}>Tokens Acquired</div>
            </Td>
            <Td type={OfferingSummary.PurchaseTokenRaised} label={props.label}>
              <div className={classes.item}>Purchase Token Raised</div>
              <QuestionTooltip
                title={InfoText.ReserveOfferTokenAmount}
                className={classes.tooltipQuestion}
              />
            </Td>
            <Td type={OfferingSummary.VestingPeriod} label={props.label}>
              <div className={classes.item}>Vesting Period</div>
              <QuestionTooltip
                title={InfoText.VestingPeriod}
                className={classes.tooltipQuestion}
              />
            </Td>
            <Td type={OfferingSummary.CliffPeriod} label={props.label}>
              <div className={classes.item}>Cliff Period</div>
              <QuestionTooltip
                title={InfoText.CliffPeriod}
                className={classes.tooltipQuestion}
              />
            </Td>
            <Td type={OfferingSummary.SalesCompleted} label={props.label}>
              <div className={classes.item}>Offering Completed</div>
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
