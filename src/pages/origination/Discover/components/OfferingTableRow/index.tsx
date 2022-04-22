import clsx from 'clsx'
import { makeStyles, Typography } from '@material-ui/core'
import { OfferingTd } from '../table'
import { NavLink } from 'react-router-dom'
import { ITokenOffer } from 'types'
import {
  formatBigNumber,
  numberWithCommas,
  parseDurationSec,
  parseRemainingDurationSec,
} from 'utils'
import { useTokenOffer } from 'helpers/useTokenOffer'
import moment from 'moment'

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
  const { tokenOffer } = useTokenOffer(offering)

  const renderContent = () => {
    if (!tokenOffer) {
      return null
    }

    const {
      network,
      offerToken,
      purchaseToken,
      totalOfferingAmount,
      offerTokenAmountSold,
      saleInitiatedTimestamp,
      startingPrice,
      vestingPeriod,
      cliffPeriod,
    } = tokenOffer

    const isSaleInitiated = !saleInitiatedTimestamp.isZero()
    const elapsedTime = moment()
      .subtract(tokenOffer.saleInitiatedTimestamp.toString())
      .toString()
    const timeRemaining = isSaleInitiated
      ? moment(tokenOffer.saleDuration.toString())
          .subtract(elapsedTime)
          .toString()
      : tokenOffer.saleDuration.toString()

    const remainingOfferingAmount =
      totalOfferingAmount.sub(offerTokenAmountSold)

    return (
      <NavLink
        className={cl.content}
        to={`/origination/token-offers/${network}/${offering}`}
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
            {formatBigNumber(startingPrice, purchaseToken.decimals)}{' '}
            {purchaseToken.symbol}
          </Typography>
        </OfferingTd>
        <OfferingTd type="timeRemaining">
          <Typography className={clsx(cl.item, cl.label)}>
            {parseRemainingDurationSec(parseInt(timeRemaining))}
          </Typography>
        </OfferingTd>
        <OfferingTd type="vestingPeriod">
          <Typography className={clsx(cl.item, cl.label)}>
            {parseDurationSec(vestingPeriod.toNumber())}
          </Typography>
        </OfferingTd>
        <OfferingTd type="vestingCliff">
          <Typography className={clsx(cl.item, cl.label, cl.itemAlignRight)}>
            {parseDurationSec(cliffPeriod.toNumber())}
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
