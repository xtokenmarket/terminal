import clsx from 'clsx'
import { Button, makeStyles, Tooltip, Typography } from '@material-ui/core'
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
import {
  formatBigNumber,
  getRemainingTime,
  parseDurationSec,
  parseRemainingDurationSec,
} from 'utils'
import { useParams } from 'react-router-dom'
import { useConnectedWeb3Context } from 'contexts'
import { FungibleOriginationPoolService } from 'services/fungibleOriginationPool'
import { useEffect, useState } from 'react'

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
    display: 'flex',
  },
  symbol: {
    color: theme.colors.white,
    fontWeight: 800,
    marginLeft: 7,
  },
  button: {
    height: 33,
    '&:hover': {
      opacity: 0.7,
      backgroundColor: theme.colors.secondary,
    },
    '&:disabled': {
      backgroundColor: theme.colors.primary200,
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
  toggleModal?: () => void
}

export const TableRow = ({ item, toggleModal }: IProps) => {
  const { account, library: provider } = useConnectedWeb3Context()
  const { poolAddress } = useParams<{ poolAddress: string }>()
  const [saleInitiated, setSaleInitiated] = useState(false)

  useEffect(() => {
    const fungibleOriginationPool = new FungibleOriginationPoolService(
      provider,
      account,
      poolAddress
    )

    fungibleOriginationPool
      .isSaleInitiated()
      .then((initiated) => setSaleInitiated(initiated))
  }, [account, provider, poolAddress])

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
              <Typography className={cl.symbol}>
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
              <Typography className={cl.symbol}>
                {item.purchaseToken.symbol}
              </Typography>
            </div>
          </Td>

          <Td type={OfferingOverview.OfferingStatus} label={item.label}>
            <div className={cl.item}>
              {`${formatBigNumber(
                item.totalOfferingAmount.sub(item.offerTokenAmountSold),
                item.offerToken.decimals
              )}/${formatBigNumber(
                item.totalOfferingAmount,
                item.offerToken.decimals
              )}`}
              <Typography className={cl.symbol}>
                {item.offerToken.symbol}
              </Typography>
            </div>
          </Td>
          <Td type={OfferingOverview.OfferingReserve} label={item.label}>
            <div className={cl.item}>
              <Typography>
                {item.offeringReserve &&
                  formatBigNumber(
                    item.offeringReserve,
                    item.offerToken.decimals
                  )}
              </Typography>
              <Typography className={cl.symbol}>
                {item.offerToken.symbol}
              </Typography>
            </div>
          </Td>

          <Td type={OfferingOverview.VestingPeriod} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {parseDurationSec(item.vestingPeriod.toNumber())}
            </Typography>
          </Td>
          <Td type={OfferingOverview.CliffPeriod} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {parseDurationSec(item.cliffPeriod.toNumber())}
            </Typography>
          </Td>
          <Td type={OfferingOverview.SalesBegin} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.salesBegin.isZero() ? (
                <Button className={cl.button} onClick={toggleModal}>
                  <Typography className={cl.text}>INITIATE SALE</Typography>
                </Button>
              ) : (
                item.salesBegin.toString()
              )}
            </Typography>
          </Td>
          <Td type={OfferingOverview.SalesEnd} label={item.label}>
            <Typography className={clsx(cl.item, cl.label, cl.itemAlignRight)}>
              {item.salesEnd.isZero()
                ? 'N/A'
                : parseDurationSec(item.salesEnd.toNumber())}
            </Typography>
          </Td>
          <Td type={OfferingOverview.SalesPeriod} label={item.label}>
            <Typography className={clsx(cl.item, cl.label, cl.itemAlignRight)}>
              {item.salesPeriod
                ? parseDurationSec(item.salesPeriod.toNumber())
                : 'N/A'}
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
                {item.currentPrice || 'N/A'}
              </Typography>
            </Td>

            <Td type={WhitelistSale.PricingFormular} label={item.label}>
              <Typography className={clsx(cl.item, cl.label)}>
                {item.pricingFormular || 'N/A'}
              </Typography>
            </Td>

            <Td type={WhitelistSale.StartingEndingPrice} label={item.label}>
              <Typography className={clsx(cl.item, cl.label)}>
                {item.startingPrice && item.endingPrice
                  ? `${formatBigNumber(
                      item.startingPrice,
                      item.offerToken.decimals
                    )}/${formatBigNumber(
                      item.endingPrice,
                      item.offerToken.decimals
                    )}`
                  : 'N/A'}
              </Typography>
            </Td>

            <Td type={WhitelistSale.Whitelist} label={item.label}>
              <Tooltip
                arrow
                title={saleInitiated ? '' : 'Sale should be initiated'}
                placement="top"
              >
                <span>
                  <Button
                    className={cl.button}
                    disabled={!saleInitiated}
                    onClick={() => {
                      toggleModal && toggleModal()
                    }}
                  >
                    <Typography className={cl.text}>SET WHITELIST</Typography>
                  </Button>
                </span>
              </Tooltip>
            </Td>

            <Td type={WhitelistSale.AddressCap} label={item.label}>
              <Typography className={clsx(cl.item, cl.label)}>
                {item.addressCap || 'N/A'}
              </Typography>
            </Td>

            <Td type={WhitelistSale.TimeRemaining} label={item.label}>
              <Typography className={clsx(cl.item, cl.label)}>
                {item.timeRemaining || 'N/A'}
              </Typography>
            </Td>

            <Td type={WhitelistSale.SalesPeriod} label={item.label}>
              <Typography className={clsx(cl.item, cl.label)}>
                {item.salesPeriod || 'N/A'}
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
              {item.currentPrice || 'N/A'}
            </Typography>
          </Td>
          <Td type={PublicSale.PricingFormular} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.pricingFormular || 'N/A'}
            </Typography>
          </Td>
          <Td type={PublicSale.Price} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.price || 'N/A'}
            </Typography>
          </Td>
          <Td type={PublicSale.TimeRemaining} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.saleEndTimestamp
                ? `${parseRemainingDurationSec(
                    getRemainingTime(item.saleEndTimestamp)
                  )}`
                : 'N/A'}
            </Typography>
          </Td>
          <Td type={PublicSale.SalesPeriod} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.salesPeriod
                ? parseDurationSec(item.salesPeriod?.toNumber())
                : 'N/A'}
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
