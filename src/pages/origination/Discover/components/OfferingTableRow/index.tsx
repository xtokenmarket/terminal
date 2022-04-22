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
}))

interface IProps {
  // offering: ITokenOffer
  offering: string
}

export const OfferingTableRow = ({ offering }: IProps) => {
  const cl = useStyles()
  const { loading, tokenOffer } = useTokenOffer(null, offering)

  const renderContent = () => {
    if (!tokenOffer) {
      return null
    }

    const {
      totalOfferingAmount,
      offerToken,
      remainingOfferingAmount,
      pricePerToken,
      purchaseToken,
      timeRemaining,
      vestingPeriod,
      cliffPeriod,
    } = tokenOffer as any

    return (
      <NavLink className={cl.content} to={`/mining/pools/`}>
        <OfferingTd type="offerToken">
          <div className={cl.item}>
            <img
              alt="offerToken"
              className={cl.tokenIcon}
              src={offerToken.image}
            />
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
        <OfferingTd type="pricePerToken">
          <Typography className={clsx(cl.item, cl.label)}>
            {formatBigNumber(pricePerToken, purchaseToken.decimals)}{' '}
            {purchaseToken.symbol}
          </Typography>
        </OfferingTd>
        <OfferingTd type="timeRemaining">
          <Typography className={clsx(cl.item, cl.label)}>
            {parseRemainingDurationSec(timeRemaining)}
          </Typography>
        </OfferingTd>
        <OfferingTd type="vestingPeriod">
          <Typography className={clsx(cl.item, cl.label)}>
            {parseDurationSec(vestingPeriod.toNumber())}
          </Typography>
        </OfferingTd>
        <OfferingTd type="vestingCliff">
          <Typography className={clsx(cl.item, cl.label)}>
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
