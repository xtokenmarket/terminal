import { makeStyles, Tooltip } from '@material-ui/core'
import { InfoText } from 'utils/enums'

import { OfferingTd } from '../index'

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
  itemMarginLeft: {
    paddingLeft: 17,
  },
}))

export const OfferingTableHeader = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <OfferingTd type="offerToken">
        <div className={classes.item}>
          Offer Token&nbsp;
          <Tooltip title={InfoText.OfferToken}>
            <img alt="question" src="/assets/icons/question.svg" />
          </Tooltip>
        </div>
      </OfferingTd>
      <OfferingTd type="offeringName">
        <div className={classes.item}>
          Offering Name&nbsp;
          <Tooltip title={InfoText.OfferName}>
            <img alt="question" src="/assets/icons/question.svg" />
          </Tooltip>
        </div>
      </OfferingTd>
      <OfferingTd type="remainingOffering">
        <div className={classes.item}>
          Remaining Offering&nbsp;
          <Tooltip title={InfoText.RemainingOffering}>
            <img alt="question" src="/assets/icons/question.svg" />
          </Tooltip>
        </div>
      </OfferingTd>
      <OfferingTd type="pricePerToken">
        <div className={classes.item}>
          Price Per Token&nbsp;
          <Tooltip title={InfoText.PricePerToken}>
            <img alt="question" src="/assets/icons/question.svg" />
          </Tooltip>
        </div>
      </OfferingTd>
      <OfferingTd type="amountRaised">
        <div className={classes.item}>
          Amount Raised&nbsp;
          <Tooltip title={InfoText.AmountRaised}>
            <img alt="question" src="/assets/icons/question.svg" />
          </Tooltip>
        </div>
      </OfferingTd>
      <OfferingTd type="timeRemaining">
        <div className={classes.item}>
          Time Remaining&nbsp;
          <Tooltip title={InfoText.TimeRemaining}>
            <img alt="question" src="/assets/icons/question.svg" />
          </Tooltip>
        </div>
      </OfferingTd>
      <OfferingTd type="vestingPeriod">
        <div className={classes.item}>
          Vesting Period&nbsp;
          <Tooltip title={InfoText.VestingPeriod}>
            <img alt="question" src="/assets/icons/question.svg" />
          </Tooltip>
        </div>
      </OfferingTd>
    </div>
  )
}
