import clsx from 'clsx'
import { makeStyles, Typography } from '@material-ui/core'
import { OfferingTd } from '../table'
import { NavLink } from 'react-router-dom'
import {
  formatBigNumber,
  getRemainingTimeSec,
  numberWithCommas,
  parseDurationSec,
  parseRemainingDurationSec,
} from 'utils'
import { useOriginationPool } from 'helpers/useOriginationPool'
import moment from 'moment'
import { useConnectedWeb3Context } from 'contexts'
import { getNetworkFromId } from 'utils/network'
import { NetworkId } from 'types'

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
  offering: string
}

export const OfferingTableRow = ({ offering }: IProps) => {
  const cl = useStyles()
  const { networkId } = useConnectedWeb3Context()
  const { tokenOffer } = useOriginationPool(
    offering,
    getNetworkFromId(networkId as NetworkId)
  )
  const _originationRow = tokenOffer?.originationRow

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
    } = _originationRow

    const getTimeRemaining = () => {
      const isSaleInitiated = !salesBegin.isZero()
      if (!isSaleInitiated) return "Hasn't started"
      if (getRemainingTimeSec(salesEnd).isZero()) return 'Ended'

      return parseRemainingDurationSec(
        parseInt(getRemainingTimeSec(salesEnd).toString())
      )
    }


    const remainingOfferingAmount =
      totalOfferingAmount.sub(offerTokenAmountSold)

    return (
      <NavLink
        className={cl.content}
        to={`/origination/token-offers/${tokenOffer.network}/${offering}`}
      >
        <OfferingTd type="offerToken">
          <div className={cl.item}>
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

        <OfferingTd type="maxOffering">
          <Typography className={cl.item}>
            {numberWithCommas(
              formatBigNumber(totalOfferingAmount, offerToken.decimals)
            )}
          </Typography>
        </OfferingTd>
        <OfferingTd type="remainingOffering">
          <Typography className={cl.item}>
            {numberWithCommas(
              formatBigNumber(remainingOfferingAmount, offerToken.decimals)
            )}
          </Typography>
        </OfferingTd>
        {/* TODO: replace this with true pricePerToken */}
        <OfferingTd type="pricePerToken">
          <Typography className={clsx(cl.item, cl.label)}>
            {startingPrice
              ? formatBigNumber(startingPrice, purchaseToken.decimals)
              : '0'}{' '}
            {purchaseToken.symbol}
          </Typography>
        </OfferingTd>
        <OfferingTd type="timeRemaining">
          <Typography className={clsx(cl.item, cl.label)}>
            {getTimeRemaining()}
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
          <Typography className={clsx(cl.item, cl.label, cl.itemAlignRight)}>
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
