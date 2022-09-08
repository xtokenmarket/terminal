import clsx from 'clsx'
import { makeStyles, Typography } from '@material-ui/core'
import { OfferingTd } from '../table'
import { NavLink } from 'react-router-dom'
import {
  formatBigNumber,
  formatDateTime,
  formatToShortNumber,
  getRemainingTimeSec,
  numberWithCommas,
  parseDurationSec,
} from 'utils'
import { useOriginationPool } from 'helpers/useOriginationPool'
import { useConnectedWeb3Context } from 'contexts'
import { getNetworkFromId } from 'utils/network'
import { IOriginationPool, NetworkId } from 'types'
import { useCountdown } from 'helpers/useCountdownClock'

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
    marginLeft: 8,
  },
}))

interface IProps {
  offering: IOriginationPool
}

export const OfferingTableRow = ({ offering }: IProps) => {
  const cl = useStyles()
  const { networkId } = useConnectedWeb3Context()
  const { tokenOffer } = useOriginationPool(
    offering.address,
    getNetworkFromId(networkId as NetworkId),
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
      purchaseToken,
      totalOfferingAmount,
      offerTokenAmountSold,
      salesBegin,
      startingPrice,
      vestingPeriod,
      cliffPeriod,
      salesEnd,
      createdAt,
      poolName,
    } = _originationRow

    // TODO: Better way to parse time remaining info
    const getTimeRemainingText = () => {
      const isSaleInitiated = !salesBegin.isZero()
      if (!isSaleInitiated) return "Hasn't started"
      if (getRemainingTimeSec(salesEnd).isZero()) return 'Ended'
      if (days < 0) return `0D:0H:0M:0S`
      return `${days}D:${hours}H:${minutes}M:${seconds}S`
    }

    const remainingOfferingAmount =
      totalOfferingAmount.sub(offerTokenAmountSold)

    return (
      <NavLink
        className={cl.content}
        to={`/origination/offerings/${tokenOffer.network}/${tokenOffer.address}`}
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
            <Typography className={cl.offeringName}>
              {poolName ? poolName : formatDateTime(createdAt.toNumber())}
            </Typography>
          </div>
        </OfferingTd>

        <OfferingTd type="maxOffering">
          <Typography className={cl.item}>
            {formatToShortNumber(
              formatBigNumber(totalOfferingAmount, offerToken.decimals)
            )}{' '}
            {offerToken.symbol}
          </Typography>
        </OfferingTd>
        <OfferingTd type="remainingOffering">
          <Typography className={cl.item}>
            {formatToShortNumber(
              formatBigNumber(remainingOfferingAmount, offerToken.decimals)
            )}{' '}
            {offerToken.symbol}
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
        <OfferingTd type="vestingCliff">
          <Typography className={clsx(cl.item, cl.label)}>
            {cliffPeriod.isZero()
              ? 'None'
              : parseDurationSec(cliffPeriod.toNumber())}
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
