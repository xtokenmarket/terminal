import { makeStyles, Typography } from '@material-ui/core'
import { PoolTd, SimpleLoader } from 'components'
import { useTerminalPool } from 'helpers'
import {
  formatBigNumber,
  formatDateTime,
  formatToShortNumber,
  getFloatDecimalNumber,
  getTimeDurationStr,
  getTimeDurationUnitInfo,
  numberWithCommas,
} from 'utils'
import { parseDuration, ZERO } from 'utils/number'
import moment from 'moment'
import { NavLink } from 'react-router-dom'
import { Network, NetworkIcon } from 'utils/enums'
import { DEFAULT_NETWORK, ETHER_DECIMAL } from 'config/constants'
import { ITerminalPool } from 'types'

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
    display: 'flex',
  },
  label: {
    color: theme.colors.white,
    textTransform: 'capitalize',
    marginLeft: 5,
  },
  apr: {
    backgroundColor: theme.colors.primary200,
    color: theme.colors.yellow,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    fontSize: 12,
    fontWeight: 700,
    padding: '0 16px',
    borderRadius: 20,
  },
  networkIcon: {
    borderRadius: '50%',
  },
  allocationItem: {
    marginRight: 10,
    display: 'flex',
    flexDirection: 'column',
    color: theme.colors.white,
    fontWeight: 700,
    '& span': {
      fontWeight: 400,
      color: theme.colors.primary100,
      fontSize: 14,
    },
  },
  name: {
    fontWeight: 400,
    color: theme.colors.primary100,
    fontSize: 14,
  },
}))

interface IProps {
  pool: ITerminalPool
  className?: string
}

export const PoolTableItem: React.FC<IProps> = ({ pool, className }) => {
  const cl = useStyles()

  const { loading, pool: poolData } = useTerminalPool(
    pool,
    pool.address,
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

    const network = poolData.network || DEFAULT_NETWORK

    return (
      <NavLink
        className={cl.content}
        to={`/mining/pools/${poolData.network}/${poolData.address}`}
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
            <Typography className={cl.allocationItem}>
              {poolData.poolName
                ? poolData.poolName
                : `${poolData.token0.symbol} ${poolData.token1.symbol}`}
            </Typography>
          </div>
        </PoolTd>
        <PoolTd type="allocation">
          <div className={cl.item}>
            <div className={cl.allocation}>
              <Typography className={cl.allocationItem}>
                {poolData.token0.symbol}
                <span>{`${
                  Number(poolData.token0.percent).toFixed() as string
                }%`}</span>
              </Typography>
              <Typography className={cl.allocationItem}>
                {poolData.token1.symbol}&nbsp;&nbsp;
                <span>{`${
                  Number(poolData.token1.percent).toFixed() as string
                }%`}</span>
              </Typography>
            </div>
          </div>
        </PoolTd>
        <PoolTd type="tvl">
          <div className={cl.itemAlignRight}>
            <Typography className={cl.label}>{`$${numberWithCommas(
              formatBigNumber(poolData.tvl, ETHER_DECIMAL)
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
                    {rewardToken.symbol}
                    {index !== tokens.length - 1 ? ' + ' : ' '}
                    {index === tokens.length - 1
                      ? `/ ${durationInfo.unitStr}`
                      : ''}
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
            <Typography className={cl.apr}>
              {poolData.apr === 'N/A' ? poolData.apr : `${poolData.apr}%`}
            </Typography>
          </div>
        </PoolTd>
        <PoolTd type="network">
          <div className={cl.itemAlignRight}>
            <img
              className={cl.networkIcon}
              alt="img"
              src={`/assets/networks/${NetworkIcon[network]}.svg`}
            />
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
