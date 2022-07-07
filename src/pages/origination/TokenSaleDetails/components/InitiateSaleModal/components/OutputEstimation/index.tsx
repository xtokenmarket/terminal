import { makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { TokenIcon } from 'components'
import { IOfferingOverview } from 'types'
import {
  formatBigNumber,
  formatDurationUnits,
  formatToShortNumber,
  getCurrentTimeStamp,
  getTimeRemainingUnits,
  getTotalTokenPrice,
  numberWithCommas,
  parseRemainingDurationSec,
  // getTotalTokenPrice,
} from 'utils'

const useStyles = makeStyles((theme) => ({
  root: {},
  estimation: {
    backgroundColor: theme.colors.primary400,
    padding: '24px 32px',
  },
  label: {
    color: theme.colors.primary100,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: 600,
  },
  infoRow: {
    margin: '0 -4px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8,
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
    padding: '24px 32px',
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
  midInfo: {
    backgroundColor: theme.colors.primary500,
    padding: '24px 32px',
  },
}))

interface IProps {
  className?: string
  offerData: IOfferingOverview
}

export const OutputEstimation = (props: IProps) => {
  const classes = useStyles()
  const { offerData } = props

  const now = getCurrentTimeStamp()
  const diff = (Number(offerData.salesEnd) - now) * 1000
  const durationRemaining = getTimeRemainingUnits(diff)
  const { primary, rest } = formatDurationUnits(durationRemaining)

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.estimation}>
        <Typography className={classes.label}>
          TOTAL OFFERING {offerData.offerToken.symbol}
        </Typography>
        <div className={classes.infoRow}>
          <TokenIcon
            token={offerData.offerToken}
            className={classes.tokenIcon}
          />
          &nbsp;&nbsp;
          <Typography className={classes.amount}>
            {formatToShortNumber(
              formatBigNumber(
                offerData.totalOfferingAmount,
                offerData.offerToken.decimals
              )
            )}
            &nbsp;
            <span>
              ~ $
              {numberWithCommas(
                getTotalTokenPrice(
                  offerData.totalOfferingAmount,
                  offerData.offerToken.decimals,
                  offerData.offerToken.price
                )
              )}
            </span>
          </Typography>
        </div>
      </div>
      <div className={classes.period}>
        <Typography className={classes.label}>SALE PERIOD</Typography>
        <Typography className={classes.whiteText}>
          {parseRemainingDurationSec(Number(offerData.salesPeriod?.toString()))}
        </Typography>
      </div>
    </div>
  )
}
