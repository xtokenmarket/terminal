import clsx from 'clsx'
import { Button, makeStyles, Tooltip, Typography } from '@material-ui/core'
import { Td } from '../Td'
import {
  EPricingFormula,
  UserPosition,
  OfferingOverview,
  OfferingSummary,
  OriginationLabels,
  PublicSale,
  WhitelistSale,
} from 'utils/enums'
import {
  IUserPosition,
  IOfferingOverview,
  IOfferingSummary,
  IPublicSale,
  IWhitelistSale,
} from 'types'
import {
  formatBigNumber,
  formatToShortNumber,
  numberWithCommas,
  parseDurationSec,
} from 'utils'
import moment from 'moment'
import { useCountdown } from 'helpers/useCountdownClock'
import { useEffect } from 'react'
import { BigNumber } from 'ethers'
import { useConnectedWeb3Context } from 'contexts'
import { getEtherscanUri } from 'config/networks'

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
    padding: '16px 0',
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
    height: 48,
  },
  itemAlignRight: {
    justifyContent: 'flex-end',
  },
  itemAlignCenter: {
    justifyContent: 'center',
  },
  tokenIcon: {
    width: 40,
    height: 40,
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
  itemMarginLeft: {
    marginLeft: 17,
  },
  link: {
    textDecoration: 'none',
  },
}))

interface IProps {
  item:
    | IOfferingOverview
    | IWhitelistSale
    | IPublicSale
    | IUserPosition
    | IOfferingSummary
  toggleModal?: () => void
  isVestedPropertiesShow?: boolean
  isOfferUnsuccessful?: boolean
  isSaleInitiated?: boolean
  isOwnerOrManager?: boolean
  isWhitelistSet?: boolean
  isWhitelistSaleEnded?: boolean
  onSaleEnd?: () => void
  onCliffTimeEnd?: () => void
  isSaleCompleted?: boolean
}

export const TableRow = ({
  item,
  toggleModal,
  isVestedPropertiesShow,
  isOfferUnsuccessful,
  isSaleInitiated,
  isOwnerOrManager,
  isWhitelistSet,
  isWhitelistSaleEnded,
  onSaleEnd,
  onCliffTimeEnd,
  isSaleCompleted,
}: IProps) => {
  const cl = useStyles()
  const { networkId } = useConnectedWeb3Context()
  const etherscanUri = getEtherscanUri(networkId)
  const remainingTime = () => {
    if (
      item.label === OriginationLabels.UserPosition &&
      isVestedPropertiesShow &&
      !isOfferUnsuccessful &&
      isSaleCompleted
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return item.vestableAt.toNumber() * 1000
    }
    if (item.label === OriginationLabels.WhitelistSale) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return item.endOfWhitelistPeriod.toNumber() * 1000
    }
    if (item.label === OriginationLabels.PublicSale) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return item.saleEndTimestamp.toNumber() * 1000
    }

    return 0
  }
  const { days, hours, minutes, seconds } = useCountdown(remainingTime())

  useEffect(() => {
    const reload = async () => {
      if (days + hours + minutes + seconds === 0) {
        if (isSaleInitiated && onSaleEnd) {
          onSaleEnd()
        } else if (onCliffTimeEnd) {
          onCliffTimeEnd()
        }
      }
    }

    reload()
  }, [seconds])

  const getTimeRemainingText = (
    timeRemaining: BigNumber,
    isPublicSale?: boolean
  ) => {
    if (item.label === OriginationLabels.UserPosition) return
    if (isWhitelistSet && !isWhitelistSaleEnded && isPublicSale)
      return 'Not Started'
    if (isSaleInitiated && timeRemaining.toNumber() > 0 && days >= 0)
      return `${days}D:${hours}H:${minutes}M:${seconds}S`
    if (isSaleInitiated && days + hours + minutes + seconds <= 0) return 'Ended'
    return 'Not Started'
  }

  const getCliffTimeRemainingText = () => {
    if (days + hours + minutes + seconds > 0)
      return `${days}D:${hours}H:${minutes}M:${seconds}S`
    return 'Started'
  }

  const renderContent = () => {
    const offeringOverview = item as IOfferingOverview
    const whitelistSale = item as IWhitelistSale
    const publicSale = item as IPublicSale
    const userPosition = item as IUserPosition
    const offeringSummary = item as IOfferingSummary

    if (item.label === OriginationLabels.OfferingOverview) {
      item = offeringOverview
      return (
        <div className={cl.content}>
          <Td type={OfferingOverview.OfferToken} label={item.label}>
            <a
              href={`${etherscanUri}token/${item.offerToken.address}`}
              target="_blank"
              rel="noreferrer"
              className={cl.link}
            >
              <div className={clsx(cl.item, cl.itemMarginLeft)}>
                <img
                  alt="offerToken"
                  className={cl.tokenIcon}
                  src={item.offerToken.image}
                />
                <Typography className={cl.symbol}>
                  {item.offerToken.symbol}
                </Typography>
              </div>
            </a>
          </Td>

          <Td type={OfferingOverview.PurchaseToken} label={item.label}>
            <a
              href={`${etherscanUri}token/${item.purchaseToken.address}`}
              target="_blank"
              rel="noreferrer"
              className={cl.link}
            >
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
            </a>
          </Td>

          <Td type={OfferingOverview.OfferingStatus} label={item.label}>
            <div className={cl.item}>
              {`${formatToShortNumber(
                formatBigNumber(
                  item.offerTokenAmountSold,
                  item.offerToken.decimals
                )
              )}/${formatToShortNumber(
                formatBigNumber(
                  item.totalOfferingAmount,
                  item.offerToken.decimals
                )
              )}`}
              <Typography className={cl.symbol}>
                {item.offerToken.symbol}
              </Typography>
            </div>
          </Td>
          <Td type={OfferingOverview.ReserveAmount} label={item.label}>
            <div className={cl.item}>
              <Typography>
                {item.reserveAmount &&
                  formatToShortNumber(
                    formatBigNumber(
                      item.reserveAmount,
                      item.purchaseToken.decimals
                    )
                  )}
              </Typography>
              <Typography className={cl.symbol}>
                {item.purchaseToken.symbol}
              </Typography>
            </div>
          </Td>

          <Td type={OfferingOverview.VestingPeriod} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.vestingPeriod.isZero()
                ? 'None'
                : parseDurationSec(item.vestingPeriod.toNumber())}
            </Typography>
          </Td>
          <Td type={OfferingOverview.CliffPeriod} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.cliffPeriod.isZero()
                ? 'None'
                : parseDurationSec(item.cliffPeriod.toNumber())}
            </Typography>
          </Td>
          <Td type={OfferingOverview.SalesBegin} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.salesBegin.isZero()
                ? 'Not started'
                : moment
                    .unix(item.salesBegin.toNumber())
                    .format('MMM DD[,] YYYY')}
            </Typography>
          </Td>
          <Td type={OfferingOverview.SalesEnd} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.salesEnd.isZero()
                ? 'N/A'
                : moment
                    .unix(item.salesEnd.toNumber())
                    .format('MMM DD[,] YYYY')}
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
              <Typography
                className={clsx(cl.item, cl.label, cl.itemMarginLeft)}
              >
                {isSaleInitiated
                  ? `${formatToShortNumber(
                      formatBigNumber(
                        item.currentPrice,
                        item.purchaseToken.decimals
                      )
                    )} ${item.purchaseToken.symbol}`
                  : 'N/A'}
              </Typography>
            </Td>

            <Td type={WhitelistSale.PricingFormula} label={item.label}>
              <Typography className={clsx(cl.item, cl.label)}>
                {item.pricingFormula || 'N/A'}
              </Typography>
            </Td>

            {item.pricingFormula !== EPricingFormula.Standard && (
              <Td type={WhitelistSale.StartingEndingPrice} label={item.label}>
                <Typography className={clsx(cl.item, cl.label)}>
                  {item.startingPrice && item.endingPrice
                    ? `${formatToShortNumber(
                        formatBigNumber(
                          item.startingPrice,
                          item.purchaseToken.decimals
                        )
                      )}/${formatToShortNumber(
                        formatBigNumber(
                          item.endingPrice,
                          item.purchaseToken.decimals
                        )
                      )} ${item.purchaseToken.symbol}`
                    : 'N/A'}
                </Typography>
              </Td>
            )}

            <Td type={WhitelistSale.Whitelist} label={item.label}>
              <Typography className={clsx(cl.item, cl.label)}>
                {item.whitelist ? 'Set' : 'Not Set'}
              </Typography>
            </Td>

            <Td type={WhitelistSale.AddressCap} label={item.label}>
              <Typography className={clsx(cl.item, cl.label)}>
                {!item.addressCap.isZero() ? (
                  <>
                    {formatToShortNumber(
                      formatBigNumber(
                        item.addressCap,
                        item.purchaseToken.decimals
                      )
                    )}{' '}
                    {item.purchaseToken.symbol}
                  </>
                ) : (
                  'N/A'
                )}
              </Typography>
            </Td>

            <Td type={WhitelistSale.TimeRemaining} label={item.label}>
              <Typography className={clsx(cl.item, cl.label)}>
                {getTimeRemainingText(item.timeRemaining)}
              </Typography>
            </Td>

            <Td type={WhitelistSale.SalesPeriod} label={item.label}>
              <Typography className={clsx(cl.item, cl.label)}>
                {item.salesPeriod
                  ? parseDurationSec(item.salesPeriod?.toNumber())
                  : 'N/A'}
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
            <Typography className={clsx(cl.item, cl.label, cl.itemMarginLeft)}>
              {isSaleInitiated
                ? `${formatToShortNumber(
                    formatBigNumber(
                      item.currentPrice,
                      item.purchaseToken.decimals
                    )
                  )} ${item.purchaseToken.symbol}`
                : 'N/A'}
            </Typography>
          </Td>
          <Td type={PublicSale.PricingFormula} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.pricingFormula || 'N/A'}
            </Typography>
          </Td>
          {item.pricingFormula !== EPricingFormula.Standard && (
            <Td type={PublicSale.StartingEndingPrice} label={item.label}>
              <Typography className={clsx(cl.item, cl.label)}>
                {item.startingPrice && item.endingPrice
                  ? `${formatToShortNumber(
                      formatBigNumber(
                        item.startingPrice,
                        item.purchaseToken.decimals
                      )
                    )}/${formatToShortNumber(
                      formatBigNumber(
                        item.endingPrice,
                        item.purchaseToken.decimals
                      )
                    )} ${item.purchaseToken.symbol}`
                  : 'N/A'}
              </Typography>
            </Td>
          )}
          <Td type={PublicSale.TimeRemaining} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {getTimeRemainingText(item.timeRemaining, true)}
            </Typography>
          </Td>
          <Td type={PublicSale.SalesPeriod} label={item.label}>
            <Typography className={clsx(cl.item, cl.label)}>
              {item.salesPeriod
                ? parseDurationSec(Number(item.salesPeriod?.toString()))
                : 'N/A'}
            </Typography>
          </Td>
        </div>
      )
    }

    if (item.label === OriginationLabels.UserPosition) {
      item = userPosition
      return (
        <div className={cl.content}>
          {!isOfferUnsuccessful && (
            <Td type={UserPosition.TokenPurchased} label={item.label}>
              <Typography
                className={clsx(cl.item, cl.label, cl.itemMarginLeft)}
              >
                {formatToShortNumber(
                  formatBigNumber(item.tokenPurchased, item.offerToken.decimals)
                )}{' '}
                {item.offerToken.symbol}
              </Typography>
            </Td>
          )}
          <Td type={UserPosition.AmountInvested} label={item.label}>
            <Typography
              className={clsx(cl.item, cl.label, [
                isOfferUnsuccessful && cl.itemMarginLeft,
              ])}
            >
              {formatToShortNumber(
                formatBigNumber(
                  item.amountInvested,
                  item.purchaseToken.decimals
                )
              )}{' '}
              {item.purchaseToken.symbol}
            </Typography>
          </Td>
          {isVestedPropertiesShow && (
            <>
              <Td type={UserPosition.Amountvested} label={item.label}>
                <Typography className={clsx(cl.item, cl.label)}>
                  {formatToShortNumber(
                    formatBigNumber(item.amountvested, item.offerToken.decimals)
                  )}{' '}
                  {item.offerToken.symbol}
                </Typography>
              </Td>
              <Td type={UserPosition.AmountAvailableToVest} label={item.label}>
                <Typography className={clsx(cl.item, cl.label)}>
                  {formatToShortNumber(
                    formatBigNumber(
                      item.amountAvailableToVest,
                      item.offerToken.decimals
                    )
                  )}{' '}
                  {item.offerToken.symbol}
                </Typography>
              </Td>
              {isSaleCompleted && (
                <Td type={UserPosition.VestableAt} label={item.label}>
                  <Typography className={clsx(cl.item, cl.label)}>
                    {getCliffTimeRemainingText()}
                  </Typography>
                </Td>
              )}
            </>
          )}
        </div>
      )
    }

    if (item.label === OriginationLabels.OfferingSummary) {
      item = offeringSummary
      return (
        <div className={cl.content}>
          <Td type={OfferingSummary.OfferToken} label={item.label}>
            <div className={clsx(cl.item, cl.itemMarginLeft)}>
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

          <Td type={OfferingSummary.PurchaseToken} label={item.label}>
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
          {isOfferUnsuccessful && (
            <>
              <Td type={OfferingSummary.OfferingStatus} label={item.label}>
                <Typography className={clsx(cl.item)}>Unsuccessful</Typography>
              </Td>
              <Td type={OfferingSummary.SalesEnded} label={item.label}>
                <Typography className={clsx(cl.item, cl.label)}>
                  {moment
                    .unix(item.salesCompleted.toNumber())
                    .format('MMM DD[,] YYYY')}
                </Typography>
              </Td>
            </>
          )}

          {!isOfferUnsuccessful && (
            <>
              <Td type={OfferingSummary.TokensSold} label={item.label}>
                <div className={cl.item}>
                  {formatToShortNumber(
                    formatBigNumber(item.tokensSold, item.offerToken.decimals)
                  )}
                  <Typography className={cl.symbol}>
                    {item.offerToken.symbol}
                  </Typography>
                </div>
              </Td>
              <Td type={OfferingSummary.AmountsRaised} label={item.label}>
                <div className={cl.item}>
                  <Typography>
                    {formatToShortNumber(
                      formatBigNumber(
                        item.amountsRaised,
                        item.purchaseToken.decimals
                      )
                    )}
                  </Typography>
                  <Typography className={cl.symbol}>
                    {item.purchaseToken.symbol}
                  </Typography>
                </div>
              </Td>

              <Td type={OfferingSummary.VestingPeriod} label={item.label}>
                <Typography className={clsx(cl.item, cl.label)}>
                  {item.vestingPeriod.isZero()
                    ? 'None'
                    : parseDurationSec(item.vestingPeriod.toNumber())}
                </Typography>
              </Td>
              <Td type={OfferingSummary.CliffPeriod} label={item.label}>
                <Typography className={clsx(cl.item, cl.label)}>
                  {item.cliffPeriod.isZero()
                    ? 'None'
                    : parseDurationSec(item.cliffPeriod.toNumber())}
                </Typography>
              </Td>
              <Td type={OfferingSummary.SalesCompleted} label={item.label}>
                <Typography className={clsx(cl.item, cl.label)}>
                  {moment
                    .unix(item.salesCompleted.toNumber())
                    .format('MMM DD[,] YYYY')}
                </Typography>
              </Td>
              <Td type={OfferingSummary.TimeSinceCompleted} label={item.label}>
                <Typography
                  className={clsx(cl.item, cl.label, cl.itemAlignCenter)}
                >
                  {parseDurationSec(Number(item.timeSinceCompleted.toString()))}
                </Typography>
              </Td>
            </>
          )}
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
