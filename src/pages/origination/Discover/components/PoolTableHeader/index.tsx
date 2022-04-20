import { makeStyles, Tooltip } from '@material-ui/core'
import { SortButton } from 'components'
import { PoolTd } from '../table'

const useStyles = makeStyles((theme: any) => ({
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
      <PoolTd type="offerToken">
        <div className={classes.item}>Offer Token</div>
      </PoolTd>
      <PoolTd type="maxOffering">
        <div className={classes.item}>Max Offering</div>
      </PoolTd>
      <PoolTd type="remainingOffering">
        <div className={classes.item}>Remaining Offering&nbsp;</div>
      </PoolTd>
      <PoolTd type="pricePerToken">
        <div className={classes.itemAlignRight}>
          Price Per Token
          <SortButton />
        </div>
      </PoolTd>
      <PoolTd type="timeRemaining">
        <div className={classes.itemAlignRight}>
          Time Remaining
          <SortButton />
        </div>
      </PoolTd>
      <PoolTd type="vestingPeriod">
        <div className={classes.itemAlignRight}>Vesting Period</div>
      </PoolTd>
      <PoolTd type="vestingCliff">
        <div className={classes.itemAlignRight}>
          Vesting Cliff
          <SortButton />
        </div>
      </PoolTd>
      <PoolTd type="network">
        <div className={classes.itemAlignRight}>
          NETWORK
          <SortButton />
        </div>
      </PoolTd>
    </div>
  )
}
