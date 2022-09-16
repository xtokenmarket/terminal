import { makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { TokenIcon } from 'components'
import { BigNumber } from 'ethers'
import { IUserPosition, IOfferingOverview } from 'types'
import {
  formatBigNumber,
  formatDurationUnits,
  getCurrentTimeStamp,
  getTimeRemainingUnits,
  getTotalTokenPrice,
  numberWithCommas,
  parseDurationSec,
} from 'utils'
import { VestStep } from 'utils/enums'
import { ONE_ETHER } from 'utils/number'
import { VestState } from '../..'

const useStyles = makeStyles((theme) => ({
  estimation: {
    backgroundColor: theme.colors.primary400,
    padding: '24px 32px 1px 32px',
  },
  label: {
    color: theme.colors.primary100,
    marginBottom: 6,
    fontSize: 10,
    fontWeight: 400,
  },
  infoRow: {
    margin: '0 -4px',
    alignItems: 'center',
    marginBottom: 20,
    display: 'flex',
  },
  tokenIcon: {
    width: 36,
    height: 36,
    border: `4px solid ${theme.colors.transparent}`,
    '&+&': {
      borderColor: theme.colors.primary500,
      position: 'relative',
      left: -12,
    },
  },
  tokenIconSmall: {
    width: 26,
    height: 26,
    border: `4px solid ${theme.colors.transparent}`,
  },
  amount: {
    fontSize: 24,
    fontWeight: 600,
    color: theme.colors.white,
    '& span': {
      fontSize: 14,
      fontWeight: 600,
      color: theme.colors.primary100,
    },
  },
  period: {
    backgroundColor: theme.colors.primary500,
    padding: '24px 32px 1px 32px',
  },
  wrapper: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    marginLeft: 4,
  },
  lightPurpletext: {
    color: theme.colors.primary100,
    fontSize: 12,
    fontWeight: 400,
    margin: theme.spacing(0, 1),
  },
  whiteText: {
    color: theme.colors.white,
    fontSize: 20,
    fontWeight: 400,
  },
  amountSmall: {
    fontSize: 20,
    fontWeight: 400,
    color: theme.colors.white,
    '& span': {
      fontSize: 12,
      color: theme.colors.primary100,
    },
  },
}))

interface IProps {
  className?: string
  offerData: IOfferingOverview
  vestState: VestState
  userPositionData: IUserPosition
}

export const OutputEstimation = (props: IProps) => {
  const classes = useStyles()
  const { offerData, vestState, userPositionData } = props

  const now = getCurrentTimeStamp()

  const getRemainingSec = () => {
    const vestEndSec = Number(offerData.salesEnd)

    const remainingPeriod =
      vestEndSec + offerData.vestingPeriod.toNumber() / 1000 - now

    return remainingPeriod * 1000
  }

  const durationRemaining = getTimeRemainingUnits(getRemainingSec())
  const { primary, rest } = formatDurationUnits(durationRemaining)

  return (
    <div className={clsx(props.className)}>
      <div className={classes.estimation}>
        <Typography className={classes.label}>
          {vestState.step === VestStep.Info
            ? 'VESTED TOKEN AVAILABLE TO CLAIM'
            : 'YOU VESTED'}
        </Typography>
        <div className={classes.infoRow}>
          <TokenIcon
            token={offerData.offerToken}
            className={classes.tokenIcon}
          />
          &nbsp;&nbsp;
          <Typography className={classes.amount}>
            {numberWithCommas(
              formatBigNumber(
                userPositionData.amountAvailableToVest,
                offerData.offerToken.decimals
              )
            )}{' '}
            {offerData.offerToken.symbol}
          </Typography>
        </div>
        {vestState.step === VestStep.Info && (
          <div className={classes.infoRow}>
            <div>
              <Typography className={classes.label}>VESTING PERIOD</Typography>
              <Typography className={classes.amount}>
                {parseDurationSec(offerData.vestingPeriod.toNumber())}
              </Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
