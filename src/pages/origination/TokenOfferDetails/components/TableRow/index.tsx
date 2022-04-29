import clsx from 'clsx'
import { makeStyles, Typography } from '@material-ui/core'
import { Td } from '../Td'
import { OfferingOverview, OriginationLabels, WhitelistSale } from 'utils/enums'
import { IOfferingOverview, IToken, IWhitelistSale } from 'types'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.primary400,
    borderRadius: 4,

    '&+&': {
      marginTop: 8,
    },
  },
  loader: {
    padding: '20px 0',
  },
  content: {
    cursor: 'pointer',
    padding: 16,
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    textDecoration: 'none',
    '&::before': {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      zIndex: 1,
      transition: 'all 0.4s',
      content: `""`,
    },
    '&:hover': {
      '&::before': {
        backgroundColor: theme.colors.secondary,
      },
    },
  },
  item: {
    color: theme.colors.primary100,
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
  },
  itemAlignRight: {
    justifyContent: 'flex-end',
  },
  tokenIcon: {
    width: 48,
    height: 48,
    border: `6px solid ${theme.colors.primary400}`,
    position: 'relative',
    borderRadius: '50%',
    '&+&': { left: -16 },
  },
  allocation: {
    display: 'flex',
  },
  label: {
    color: theme.colors.white,
    textTransform: 'capitalize',
  },
  offerTokenLabel: {
    color: theme.colors.white,
    textTransform: 'capitalize',
    fontWeight: 800,
    marginLeft: theme.spacing(2),
  },
}))

interface IProps {
  item: IOfferingOverview | IWhitelistSale
}

export const TableRow = ({ item }: IProps) => {
  const cl = useStyles()

  const renderContent = () => {
    const offeringOverview = item as IOfferingOverview
    const whitelistSale = item as IWhitelistSale
    if (item.label === OriginationLabels.OfferingOverview) {
      item = offeringOverview
      return (
        <div className={cl.content}>
          <Td
            type={OfferingOverview.OfferToken}
            label={OriginationLabels.OfferingOverview}
          >
            <div className={cl.item}>
              <img
                alt="offerToken"
                className={cl.tokenIcon}
                src={item.offerToken.image}
              />
              <Typography className={cl.offerTokenLabel}>
                {item.offerToken.symbol}
              </Typography>
            </div>
          </Td>

          <Td
            type={OfferingOverview.PurchaseToken}
            label={OriginationLabels.OfferingOverview}
          >
            <div className={cl.item}>
              <img
                alt="purchaseToken"
                className={cl.tokenIcon}
                src={item.purchaseToken.image}
              />
              <Typography className={cl.offerTokenLabel}>
                {item.purchaseToken.symbol}
              </Typography>
            </div>
          </Td>

          <Td
            type={OfferingOverview.OfferingStatus}
            label={OriginationLabels.OfferingOverview}
          >
            <Typography className={cl.item}>{item.offeringStatus}</Typography>
          </Td>
          <Td
            type={OfferingOverview.OfferingReserve}
            label={OriginationLabels.OfferingOverview}
          >
            <Typography className={cl.item}>{item.offeringReserve}</Typography>
          </Td>

          <Td
            type={OfferingOverview.VestingPeriod}
            label={OriginationLabels.OfferingOverview}
          >
            <Typography className={clsx(cl.item, cl.label)}>
              {item.vestingPeriod}
            </Typography>
          </Td>
          <Td
            type={OfferingOverview.CliffPeriod}
            label={OriginationLabels.OfferingOverview}
          >
            <Typography className={clsx(cl.item, cl.label)}>
              {item.cliffPeriod}
            </Typography>
          </Td>
          <Td
            type={OfferingOverview.SalesBegin}
            label={OriginationLabels.OfferingOverview}
          >
            <Typography className={clsx(cl.item, cl.label)}>
              {item.salesBegin}
            </Typography>
          </Td>
          <Td
            type={OfferingOverview.SalesEnd}
            label={OriginationLabels.OfferingOverview}
          >
            <Typography className={clsx(cl.item, cl.label, cl.itemAlignRight)}>
              {item.salesEnd}
            </Typography>
          </Td>
          <Td
            type={OfferingOverview.SalesPeriod}
            label={OriginationLabels.OfferingOverview}
          >
            <Typography className={clsx(cl.item, cl.label, cl.itemAlignRight)}>
              {item.salesPeriod}
            </Typography>
          </Td>
        </div>
      )
    }

    if (item.label === OriginationLabels.WhitelistSale) {
      item = whitelistSale

      return (
        <div className={cl.content}>
          <Td
            type={WhitelistSale.CurrentPrice}
            label={OriginationLabels.WhitelistSale}
          >
            <Typography className={clsx(cl.item, cl.label)}>
              {item.currentPrice}
            </Typography>
          </Td>

          <Td
            type={WhitelistSale.PricingFormular}
            label={OriginationLabels.WhitelistSale}
          >
            <Typography className={clsx(cl.item, cl.label)}>
              {item.pricingFormular}
            </Typography>
          </Td>

          <Td
            type={WhitelistSale.StartingEndingPrice}
            label={OriginationLabels.WhitelistSale}
          >
            <Typography className={clsx(cl.item, cl.label)}>
              {item.startingEndingPrice}
            </Typography>
          </Td>

          <Td
            type={WhitelistSale.Whitelist}
            label={OriginationLabels.WhitelistSale}
          >
            <Typography className={clsx(cl.item, cl.label)}>
              {item.whitelist}
            </Typography>
          </Td>

          <Td
            type={WhitelistSale.AddressCap}
            label={OriginationLabels.WhitelistSale}
          >
            <Typography className={clsx(cl.item, cl.label)}>
              {item.addressCap}
            </Typography>
          </Td>

          <Td
            type={WhitelistSale.TimeRemaining}
            label={OriginationLabels.WhitelistSale}
          >
            <Typography className={clsx(cl.item, cl.label)}>
              {item.timeRemaining}
            </Typography>
          </Td>

          <Td
            type={WhitelistSale.SalesPeriod}
            label={OriginationLabels.WhitelistSale}
          >
            <Typography className={clsx(cl.item, cl.label)}>
              {item.salesPeriod}
            </Typography>
          </Td>
        </div>
      )
    }
  }

  return (
    <div className={cl.root}>
      {/* {loading ? <SimpleLoader className={cl.loader} /> : renderContent()} */}
      {renderContent()}
    </div>
  )
}
