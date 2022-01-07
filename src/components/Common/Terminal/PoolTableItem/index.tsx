import { makeStyles, Typography } from '@material-ui/core'
import { PoolTd, SimpleLoader } from 'components'
import { useTerminalPool } from 'helpers'
import {
  formatBigNumber,
  formatToShortNumber,
  getTimeDurationStr,
  getTimeDurationUnitInfo,
  numberWithCommas,
} from 'utils'
import moment from 'moment'
import { NavLink } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.primary400,
    borderRadius: 4,

    '&+&': {
      marginTop: 8,
    },
  },
  loader: { padding: '20px 0' },
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
    color: theme.colors.purple0,
    fontSize: 11,
    display: 'flex',
    alignItems: 'center',
  },
  itemAlignRight: {
    color: theme.colors.purple0,
    fontSize: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
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
    color: theme.colors.white,
    fontWeight: 700,
    '& span': {
      fontWeight: 400,
      color: theme.colors.primary100,
    },
  },
  label: {
    color: theme.colors.white,
    textTransform: 'capitalize',
  },
  apr: {
    backgroundColor: theme.colors.primary200,
    color: theme.colors.white,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    fontSize: 12,
    fontWeight: 700,
    padding: '0 16px',
    borderRadius: 20,
  },
}))

interface IProps {
  poolAddress: string
  className?: string
}

export const PoolTableItem = (props: IProps) => {
  const classes = useStyles()
  const { poolAddress } = props
  const { pool: poolData, loading } = useTerminalPool(poolAddress)

  const renderContent = () => {
    if (!poolData) {
      return null
    }

    return (
      <NavLink
        className={classes.content}
        to={`/terminal/pools/${poolData.address}`}
      >
        <PoolTd type="pool">
          <div className={classes.item}>
            <img
              alt="token0"
              className={classes.tokenIcon}
              src={poolData.token0.image}
            />
            <img
              alt="token1"
              className={classes.tokenIcon}
              src={poolData.token1.image}
            />
          </div>
        </PoolTd>
        <PoolTd type="allocation">
          <div className={classes.item}>
            <Typography className={classes.allocation}>
              {poolData.token0.symbol}&nbsp;<span>{`${poolData.token0Percent}%`}</span>&nbsp;&nbsp;
              {poolData.token1.symbol}&nbsp;<span>{`${poolData.token1Percent}%`}</span>
            </Typography>
          </div>
        </PoolTd>
        <PoolTd type="tvl">
          <div className={classes.itemAlignRight}>
            <Typography className={classes.label}>{`$${numberWithCommas(poolData.tvl)}`}</Typography>
          </div>
        </PoolTd>
        <PoolTd type="vesting">
          <div className={classes.itemAlignRight}>
            <Typography className={classes.label}>
              {getTimeDurationStr(poolData.rewardsDuration.toNumber())}
            </Typography>
          </div>
        </PoolTd>
        <PoolTd type="program">
          <div className={classes.itemAlignRight}>
            {poolData.rewardTokens.map((rewardToken, index) => {
              const durationInfo = getTimeDurationUnitInfo(
                poolData.rewardsDuration.toNumber()
              )
              const uintAmount = poolData.rewardsPerToken[index]
                .mul(durationInfo.unit)
                .div(poolData.rewardsDuration)
              return (
                <Typography className={classes.label} key={rewardToken.address}>
                  {formatToShortNumber(
                    formatBigNumber(uintAmount, rewardToken.decimals)
                  )}{' '}
                  {rewardToken.symbol} / {durationInfo.unitStr}
                </Typography>
              )
            })}
          </div>
        </PoolTd>
        <PoolTd type="ending">
          <div className={classes.itemAlignRight}>
            <Typography className={classes.label}>
              {moment(new Date(poolData.periodFinish.toNumber() * 1000)).format(
                'MMM DD, YYYY'
              )}
            </Typography>
          </div>
        </PoolTd>
        <PoolTd type="apr">
          <div className={classes.itemAlignRight}>
            <Typography className={classes.apr}>99%</Typography>
          </div>
        </PoolTd>
      </NavLink>
    )
  }

  return (
    <div className={classes.root}>
      {!poolData && loading ? (
        <SimpleLoader className={classes.loader} />
      ) : null}
      {poolData ? renderContent() : null}
    </div>
  )
}
