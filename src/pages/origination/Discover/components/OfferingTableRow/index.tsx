import clsx from 'clsx'
import { makeStyles, Typography } from '@material-ui/core'
import { NavLink } from 'react-router-dom'
import {
  formatBigNumber,
  formatToShortNumber,
  getRemainingTimeSec,
  numberWithCommas,
  parseDurationSec,
} from 'utils'
import { useCountdown, useOriginationPool } from 'helpers'
import { IOriginationPool } from 'types'
import { getCountdownText } from 'utils/number'

import { OfferingTd } from '../index'

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
    marginBottom: 13,
    border: `solid 1px ${theme.colors.primary200}`,
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
  },
  itemAlignRight: {
    justifyContent: 'flex-end',
  },
  tokenIcon: {
    width: 55,
    height: 55,
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
    marginLeft: theme.spacing(1),
  },
  itemMarginLeft: {
    marginLeft: 10,
  },
  offeringName: {
    color: theme.colors.white,
    fontSize: 14,
  },
}))

interface IProps {
  offering: IOriginationPool
}

export const OfferingTableRow = ({ offering }: IProps) => {
  const cl = useStyles()
  const { tokenOffer } = useOriginationPool(
    offering.address,
    offering.network,
    offering,
    false
  )
  const _originationRow = tokenOffer?.originationRow

  const { days, hours, minutes, seconds } = useCountdown(
    _originationRow?.salesEnd ? _originationRow?.salesEnd.toNumber() * 1000 : 0
  )

  const renderContent = () => {
    if (!tokenOffer || !_originationRow) {
      return null
    }

    const {
      offerToken,
      offerTokenAmountSold,
      poolName,
      purchaseToken,
      purchaseTokenRaised,
      salesBegin,
      salesEnd,
      startingPrice,
      totalOfferingAmount,
      vestingPeriod,
    } = _originationRow

    const isSaleInitiated = !salesBegin.isZero()

    // TODO: Better way to parse time remaining info
    const getTimeRemainingText = () => {
      if (!isSaleInitiated) return "Hasn't started"
      if (getRemainingTimeSec(salesEnd).isZero()) return 'Ended'
      return getCountdownText(days, hours, minutes, seconds)
    }

    const remainingOfferingAmount =
      totalOfferingAmount.sub(offerTokenAmountSold)

    return (
      <NavLink
        className={cl.content}
        to={`/origination/programs/${tokenOffer.network}/${tokenOffer.address}`}
      >
        <OfferingTd type="offerToken">
          <div className={clsx(cl.item, cl.itemMarginLeft)}>
            <img
              alt="offerToken"
              className={cl.tokenIcon}
              src={offerToken.image}
            />
            <Typography className={cl.offerTokenLabel}>
              {offerToken.symbol}
            </Typography>
          </div>
        </OfferingTd>
        <OfferingTd type="offeringName">
          <Typography className={cl.offeringName}>
            {poolName || offerToken.symbol}
          </Typography>
        </OfferingTd>
        <OfferingTd type="pricePerToken">
          <Typography className={clsx(cl.item, cl.label)}>
            {startingPrice
              ? numberWithCommas(
                  formatBigNumber(startingPrice, purchaseToken.decimals)
                )
              : '0'}{' '}
            {purchaseToken.symbol}
          </Typography>
        </OfferingTd>
        <OfferingTd type="amountRaised">
          <Typography className={clsx(cl.item, cl.label)}>
            {isSaleInitiated
              ? `${formatToShortNumber(
                  formatBigNumber(purchaseTokenRaised, purchaseToken.decimals)
                )} ${purchaseToken.symbol}`
              : 'N/A'}
          </Typography>
        </OfferingTd>
        <OfferingTd type="remainingOffering">
          <Typography className={cl.item}>
            {formatToShortNumber(
              formatBigNumber(remainingOfferingAmount, offerToken.decimals)
            )}
            /
            {formatToShortNumber(
              formatBigNumber(totalOfferingAmount, offerToken.decimals)
            )}{' '}
            {offerToken.symbol}
          </Typography>
        </OfferingTd>
        <OfferingTd type="timeRemaining">
          <Typography className={clsx(cl.item, cl.label)}>
            {getTimeRemainingText()}
          </Typography>
        </OfferingTd>
        <OfferingTd type="vestingPeriod">
          <Typography className={clsx(cl.item, cl.label)}>
            {vestingPeriod.isZero()
              ? 'None'
              : parseDurationSec(vestingPeriod.toNumber())}
          </Typography>
        </OfferingTd>
      </NavLink>
    )
  }

  return (
    <div className={cl.root}>
      {/* {loading ? <SimpleLoader className={cl.loader} /> : renderContent()} */}
      {renderContent()}
    </div>
  )
}
