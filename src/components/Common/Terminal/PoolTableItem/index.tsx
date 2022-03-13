import { makeStyles, Typography } from '@material-ui/core'
import { PoolTd, SimpleLoader } from 'components'
import { useTerminalPool } from 'helpers'
import {
  formatBigNumber,
  formatToShortNumber,
  getFloatDecimalNumber,
  getTimeDurationStr,
  getTimeDurationUnitInfo,
  numberWithCommas,
} from 'utils'
import { parseDuration, ZERO } from 'utils/number'
import moment from 'moment'
import { NavLink } from 'react-router-dom'
import { Network } from 'utils/enums'

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
  pool: any
  className?: string
}

export const PoolTableItem: React.FC<IProps> = ({ pool, className }) => {
  const cl = useStyles()

  const { loading, pool: poolData } = useTerminalPool(
    pool,
    pool.poolAddress,
    pool.network as Network
  )

  const renderContent = () => {
    if (!poolData) {
      return null
    }

    const {
      rewardState: { amounts, duration, tokens, vesting },
    } = poolData
    const isInitiateRewardsPending = duration === '0'

    return (
      <NavLink
        className={cl.content}
        to={`/terminal/pools/${poolData.network}/${poolData.address}`}
      >
        <PoolTd type="pool">
          <div className={cl.item}>
            <img
              alt="token0"
              className={cl.tokenIcon}
              src={poolData.token0.image}
            />
            <img
              alt="token1"
              className={cl.tokenIcon}
              src={poolData.token1.image}
            />
          </div>
        </PoolTd>
        <PoolTd type="allocation">
          <div className={cl.item}>
            <Typography className={cl.allocation}>
              {poolData.token0.symbol}&nbsp;
              <span>{`${getFloatDecimalNumber(
                poolData.token0.percent as string,
                2
              )}%`}</span>
              &nbsp;&nbsp;
              {poolData.token1.symbol}&nbsp;
              <span>{`${getFloatDecimalNumber(
                poolData.token1.percent as string,
                2
              )}%`}</span>
            </Typography>
          </div>
        </PoolTd>
        <PoolTd type="tvl">
          <div className={cl.itemAlignRight}>
            <Typography className={cl.label}>{`$${numberWithCommas(
              poolData.tvl
            )}`}</Typography>
          </div>
        </PoolTd>
        <PoolTd type="vesting">
          <div className={cl.itemAlignRight}>
            <Typography className={cl.label}>
              {Number(vesting) === 0
                ? 'None'
                : getTimeDurationStr(parseDuration(vesting))}
            </Typography>
          </div>
        </PoolTd>
        <PoolTd type="program">
          <div className={cl.itemAlignRight}>
            {/* TODO: Display token logo? */}
            {tokens.map((rewardToken, index) => {
              if (isInitiateRewardsPending) {
                return (
                  <Typography className={cl.label} key={rewardToken.address}>
                    &nbsp;{rewardToken.symbol}
                    {index !== tokens.length - 1 ? ' / ' : ''}
                  </Typography>
                )
              } else {
                const durationInfo = getTimeDurationUnitInfo(Number(duration))
                const uintAmount = amounts[index]
                  ? amounts[index].mul(durationInfo.unit).div(Number(duration))
                  : ZERO
                return (
                  <Typography className={cl.label} key={rewardToken.address}>
                    {formatToShortNumber(
                      formatBigNumber(uintAmount, rewardToken.decimals)
                    )}{' '}
                    {rewardToken.symbol} / {durationInfo.unitStr}
                  </Typography>
                )
              }
            })}
          </div>
        </PoolTd>
        <PoolTd type="ending">
          <div className={cl.itemAlignRight}>
            <Typography className={cl.label}>
              {poolData.periodFinish.isZero()
                ? 'N/A'
                : moment(
                    new Date(poolData.periodFinish.toNumber() * 1000)
                  ).format('MMM DD, YYYY')}
            </Typography>
          </div>
        </PoolTd>
        <PoolTd type="apr">
          <div className={cl.itemAlignRight}>
            <Typography className={cl.apr}>99%</Typography>
          </div>
        </PoolTd>
      </NavLink>
    )
  }

  return (
    <div className={cl.root}>
      {loading ? <SimpleLoader className={cl.loader} /> : renderContent()}
    </div>
  )
}
