import clsx from 'clsx'
import { Button, makeStyles, Typography } from '@material-ui/core'
import { Td } from '../Td'
import {
  MyPosition,
  OfferingOverview,
  OriginationLabels,
  PublicSale,
  WhitelistSale,
} from 'utils/enums'
import {
  IMyPosition,
  IOfferingOverview,
  IPublicSale,
  IWhitelistSale,
} from 'types'

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
    border: `1px solid ${theme.colors.primary200}`,
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
  button: {
    height: 33,
    '&:hover': {
      opacity: 0.7,
      backgroundColor: theme.colors.secondary,
    },
    padding: '8px 15px',
    backgroundColor: theme.colors.secondary,
    borderRadius: 4,
  },
  text: {
    color: theme.colors.primary700,
    fontSize: 14,
    fontWeight: 600,
  },
}))

interface IProps {
  item: IOfferingOverview | IWhitelistSale | IPublicSale | IMyPosition
}

export const TableRow = ({ item }: IProps) => {
  const cl = useStyles()

  const renderContent = () => {
    const offeringOverview = item as IOfferingOverview
    const whitelistSale = item as IWhitelistSale
    const publicSale = item as IPublicSale
    const myPosition = item as IMyPosition

    if (item.label === OriginationLabels.OfferingOverview) {
      item = offeringOverview
      return (
        <div className={cl.content}>
          <Td type={OfferingOverview.OfferToken} label={item.label}>
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

          <Td type={OfferingOverview.PurchaseToken} label={item.label}>
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

          <Td type={OfferingOverview.OfferingStatus} label={item.label}>
            <Typography className={cl.item}>{item.offeringStatus}</Typography>
          </Td>
          <Td type={OfferingOverview.OfferingReserve} label={item.label}>
            <Typography className={cl.item}>{item.offeringReserve}</Typography>
          </Td>

          <Td type={OfferingOverview.VestingPeriod} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.vestingPeriod}
            </Typography>
          </Td>
          <Td type={OfferingOverview.CliffPeriod} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.cliffPeriod}
            </Typography>
          </Td>
          <Td type={OfferingOverview.SalesBegin} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.salesBegin === 'INITIATE SALE' ? (
                <Button
                  className={cl.button}
                  onClick={() => {
                    console.log('onClick')
                  }}
                >
                  <Typography className={cl.text}>INITIATE SALE</Typography>
                </Button>
              ) : (
                item.salesBegin
              )}
            </Typography>
          </Td>
          <Td type={OfferingOverview.SalesEnd} label={item.label}>
            <Typography className={clsx(cl.item, cl.label, cl.itemAlignRight)}>
              {item.salesEnd}
            </Typography>
          </Td>
          <Td type={OfferingOverview.SalesPeriod} label={item.label}>
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
        <>
          <div className={cl.content}>
            <Td type={WhitelistSale.CurrentPrice} label={item.label}>
              <Typography className={clsx(cl.item, cl.label)}>
                {item.currentPrice}
              </Typography>
            </Td>

            <Td type={WhitelistSale.PricingFormular} label={item.label}>
              <Typography className={clsx(cl.item, cl.label)}>
                {item.pricingFormular}
              </Typography>
            </Td>

            <Td type={WhitelistSale.StartingEndingPrice} label={item.label}>
              <Typography className={clsx(cl.item, cl.label)}>
                {item.startingEndingPrice}
              </Typography>
            </Td>

            <Td type={WhitelistSale.Whitelist} label={item.label}>
              <Button
                className={cl.button}
                onClick={() => {
                  console.log('onClick')
                }}
              >
                <Typography className={cl.text}>SET WHITELIST</Typography>
              </Button>
            </Td>

            <Td type={WhitelistSale.AddressCap} label={item.label}>
              <Typography className={clsx(cl.item, cl.label)}>
                {item.addressCap}
              </Typography>
            </Td>

            <Td type={WhitelistSale.TimeRemaining} label={item.label}>
              <Typography className={clsx(cl.item, cl.label)}>
                {item.timeRemaining}
              </Typography>
            </Td>

            <Td type={WhitelistSale.SalesPeriod} label={item.label}>
              <Typography className={clsx(cl.item, cl.label)}>
                {item.salesPeriod}
              </Typography>
            </Td>
          </div>
        </>
      )
    }

    if (item.label === OriginationLabels.PublicSale) {
      item = publicSale
      return (
        <div className={cl.content}>
          <Td type={PublicSale.CurrentPrice} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.currentPrice}
            </Typography>
          </Td>
          <Td type={PublicSale.PricingFormular} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.pricingFormular}
            </Typography>
          </Td>
          <Td type={PublicSale.Price} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.price}
            </Typography>
          </Td>
          <Td type={PublicSale.TimeRemaining} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.timeRemaining}
            </Typography>
          </Td>
          <Td type={PublicSale.SalesPeriod} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.salesPeriod}
            </Typography>
          </Td>
        </div>
      )
    }

    if (item.label === OriginationLabels.MyPosition) {
      item = myPosition
      return (
        <div className={cl.content}>
          <Td type={MyPosition.TokenPurchased} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.tokenPurchased}
            </Typography>
          </Td>
          <Td type={MyPosition.AmountInvested} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.amountInvested}
            </Typography>
          </Td>
          <Td type={MyPosition.Amountvested} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.amountvested}
            </Typography>
          </Td>
          <Td type={MyPosition.AmountAvailableToVest} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.amountAvailableToVest}
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
