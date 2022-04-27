import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'
import { Td } from '../Td'
import { OfferingOverview, OriginationLabels } from 'utils/enums'

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
}))

interface IProps {
  label: string
}

export const TableHeader = (props: IProps) => {
  const classes = useStyles()

  if (props.label === OriginationLabels.OfferingOverview) {
    return (
      <div className={classes.root}>
        <Td
          type={OfferingOverview.OfferToken}
          label={OriginationLabels.OfferingOverview}
        >
          <div className={classes.item}>Offer Token</div>
        </Td>
        <Td
          type={OfferingOverview.PurchaseToken}
          label={OriginationLabels.OfferingOverview}
        >
          <div className={classes.item}>Purchase Token</div>
        </Td>
        <Td
          type={OfferingOverview.OfferingStatus}
          label={OriginationLabels.OfferingOverview}
        >
          <div className={classes.item}>Offering Status</div>
        </Td>
        <Td
          type={OfferingOverview.OfferingReserve}
          label={OriginationLabels.OfferingOverview}
        >
          <div className={classes.item}>Offering Reserve</div>
        </Td>
        <Td
          type={OfferingOverview.VestingPeriod}
          label={OriginationLabels.OfferingOverview}
        >
          <div className={classes.item}>Vesting Period</div>
        </Td>
        <Td
          type={OfferingOverview.CliffPeriod}
          label={OriginationLabels.OfferingOverview}
        >
          <div className={classes.item}>Cliff Period</div>
        </Td>
        <Td
          type={OfferingOverview.SalesBegin}
          label={OriginationLabels.OfferingOverview}
        >
          <div className={classes.item}>Sales Begin</div>
        </Td>
        <Td
          type={OfferingOverview.SalesEnd}
          label={OriginationLabels.OfferingOverview}
        >
          <div className={classes.item}>Sales End</div>
        </Td>
        <Td
          type={OfferingOverview.SalesPeriod}
          label={OriginationLabels.OfferingOverview}
        >
          <div className={clsx(classes.item, classes.itemAlignRight)}>
            Sales Period
          </div>
        </Td>
      </div>
    )
  }

  return <></>
}
