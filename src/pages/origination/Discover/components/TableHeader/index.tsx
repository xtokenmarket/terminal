import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'
import { OfferingTd } from '../table'

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
        <div className={classes.item}>Offer Token</div>
      </OfferingTd>
      <OfferingTd type="maxOffering">
        <div className={classes.item}>Max Offering</div>
      </OfferingTd>
      <OfferingTd type="remainingOffering">
        <div className={classes.item}>Remaining Offering</div>
      </OfferingTd>
      <OfferingTd type="pricePerToken">
        <div className={classes.item}>Price Per Token</div>
      </OfferingTd>
      <OfferingTd type="timeRemaining">
        <div className={classes.item}>Time Remaining</div>
      </OfferingTd>
      <OfferingTd type="vestingPeriod">
        <div className={classes.item}>Vesting Period</div>
      </OfferingTd>
      <OfferingTd type="vestingCliff">
        <div className={classes.item}>Vesting Cliff</div>
      </OfferingTd>
    </div>
  )
}
