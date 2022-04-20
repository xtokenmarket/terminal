import { makeStyles } from '@material-ui/core'
import { SortButton } from 'components'
import { OfferingTd } from '../table'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    marginBottom: 12,
  },
  item: {
    color: theme.colors.purple0,
    fontSize: 11,
    display: 'flex',
    alignItems: 'center',
  },
  itemAlignRight: {
    color: theme.colors.purple0,
    fontSize: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}))

export const PoolTableHeader = () => {
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
        <div className={classes.item}>Remaining Offering&nbsp;</div>
      </OfferingTd>
      <OfferingTd type="pricePerToken">
        <div className={classes.itemAlignRight}>
          Price Per Token
          <SortButton />
        </div>
      </OfferingTd>
      <OfferingTd type="timeRemaining">
        <div className={classes.itemAlignRight}>
          Time Remaining
          <SortButton />
        </div>
      </OfferingTd>
      <OfferingTd type="vestingPeriod">
        <div className={classes.itemAlignRight}>Vesting Period</div>
      </OfferingTd>
      <OfferingTd type="vestingCliff">
        <div className={classes.itemAlignRight}>
          Vesting Cliff
          <SortButton />
        </div>
      </OfferingTd>
    </div>
  )
}
