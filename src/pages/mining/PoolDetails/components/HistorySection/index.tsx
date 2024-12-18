import { makeStyles, Typography } from '@material-ui/core'
import moment from 'moment'
import { History, ITerminalPool } from 'types'
import { formatBigNumber, numberWithCommas } from 'utils'
import { getEtherscanUri } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { MINING_EVENTS } from 'config/constants'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 24,
    backgroundColor: theme.colors.seventh,
    padding: '16px 24px',
    borderRadius: 4,
  },
  title: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 16,
  },
  content: {},
  tableWrapper: {
    '& table': {
      width: '100%',
      borderCollapse: 'collapse',
      '& th': {
        color: theme.colors.purple0,
        fontSize: 11,
        padding: '8px 0',
        textAlign: 'right',
        '&:first-child': { textAlign: 'left' },
        [theme.breakpoints.down('xs')]: {
          '&:nth-child(3)': {
            display: 'none',
          },
        },
        '&+&': {
          paddingLeft: 4,
        },
      },
      '& td': {
        padding: '11px 0',
        color: theme.colors.white,
        fontSize: 14,
        borderTop: `1px solid ${theme.colors.primary200}`,
        textAlign: 'right',
        '&:first-child': { textAlign: 'left' },
        '& span': {
          fontWeight: 700,
        },
        [theme.breakpoints.down('xs')]: {
          '&:nth-child(3)': {
            display: 'none',
          },
        },
        '&+&': {
          paddingLeft: 4,
        },
      },
    },
  },
  button: {
    marginTop: 12,
    height: 40,
  },
  text: {
    fontFamily: 'Gilmer',
    fontWeight: 'bold',
    margin: '30px',
    textAlign: 'center',
    color: theme.colors.white,
  },
  rewardAmounts: {
    display: 'inline-block',
    '& + &': {
      marginLeft: 4,
    },
  },
}))

interface IProps {
  pool: ITerminalPool
}

export const HistorySection = (props: IProps) => {
  const classes = useStyles()
  const { pool } = props
  const { networkId } = useConnectedWeb3Context()
  const etherscanUri = getEtherscanUri(networkId)

  if (pool.history.length === 0) {
    return (
      <div className={classes.root}>
        <div className={classes.text}>No pool history.</div>
      </div>
    )
  }

  const renderValue = (item: History) => {
    if (
      item.action === MINING_EVENTS.Deposit ||
      item.action === MINING_EVENTS.Withdraw
    ) {
      return (
        <td>
          <span>
            {numberWithCommas(
              formatBigNumber(item.amount0, pool.token0.decimals)
            )}
          </span>{' '}
          {pool.token0.symbol} /{' '}
          <span>
            {numberWithCommas(
              formatBigNumber(item.amount1, pool.token1.decimals)
            )}
          </span>{' '}
          {pool.token1.symbol}
        </td>
      )
    }

    if (item.action === MINING_EVENTS.RewardClaimed) {
      return (
        <td>
          <span>
            {numberWithCommas(
              formatBigNumber(item.rewardAmount, item.decimals)
            )}
          </span>{' '}
          {item.symbol}
        </td>
      )
    }

    if (item.action === MINING_EVENTS.InitiatedRewardsProgram) {
      return (
        <td>
          {item.totalRewardAmounts.map((amount, index) => (
            <div
              className={classes.rewardAmounts}
              key={item.rewardTokens[index].symbol}
            >
              <span>
                {numberWithCommas(
                  formatBigNumber(amount, item.rewardTokens[index].decimals)
                )}
              </span>{' '}
              {item.rewardTokens[index].symbol}{' '}
              {index !== item.totalRewardAmounts.length - 1 && `/`}
            </div>
          ))}
        </td>
      )
    }

    if (item.action === MINING_EVENTS.Vested) {
      return (
        <td>
          <span>
            {numberWithCommas(formatBigNumber(item.value, item.decimals))}
          </span>{' '}
          {item.symbol}
        </td>
      )
    }

    if (item.action === MINING_EVENTS.Collect) {
      return (
        <td>
          <span>
            {numberWithCommas(
              formatBigNumber(item.amount0, pool.token0.decimals, 2)
            )}
          </span>{' '}
          {pool.token0.symbol} /{' '}
          <span>
            {numberWithCommas(
              formatBigNumber(item.amount1, pool.token1.decimals, 2)
            )}
          </span>{' '}
          {pool.token1.symbol}
        </td>
      )
    }
  }

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>History</Typography>
      <div className={classes.content}>
        <div className={classes.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>ACTION</th>
                <th>VALUE</th>
                <th>TIME</th>
                <th>TX</th>
              </tr>
            </thead>
            <tbody>
              {pool.history.map((item) => (
                <tr key={`${item.tx}_${item.action}_${item.symbol}`}>
                  <td>{item.action}</td>
                  {renderValue(item)}
                  <td>{moment.unix(item.timestamp).fromNow()}</td>
                  <td>
                    <a href={`${etherscanUri}tx/${item.tx}`} target="_blank">
                      <img alt="alt" src="/assets/icons/expand.png" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* <Button
          className={classes.button}
          color="secondary"
          fullWidth
          variant="contained"
        >
          Full History
        </Button> */}
      </div>
    </div>
  )
}
