import { makeStyles, Typography } from '@material-ui/core'
import { TokenIcon } from 'components'
import { useTokenBalance } from 'helpers'
import { ITerminalPool, IToken } from 'types'
import { formatBigNumber, numberWithCommas } from 'utils'
import { useConnectedWeb3Context } from '../../../../contexts'
import { getEtherscanUri } from '../../../../config/networks'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 16,
    [theme.breakpoints.down('xs')]: {
      padding: 8,
    },
  },
  label: {
    color: theme.colors.primary100,
    fontSize: 10,
  },
  content: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    [theme.breakpoints.down('xs')]: {
      width: 24,
      height: 24,
    },
  },
  texts: {
    marginLeft: 14,
  },
  balance: {
    fontWeight: 700,
    color: theme.colors.white,
    fontSize: 34,
    lineHeight: '34px',
    '& span': { fontWeight: 400, color: theme.colors.primary100 },
    [theme.breakpoints.down('xs')]: {
      fontSize: 22,
    },
  },
  dollar: {
    fontWeight: 700,
    color: theme.colors.primary100,
    fontSize: 14,
    lineHeight: '28px',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
}))

interface IProps {
  token: IToken
  pool: ITerminalPool
}

export const BalanceSection = (props: IProps) => {
  const classes = useStyles()
  const { networkId } = useConnectedWeb3Context()

  const etherscanUri = getEtherscanUri(networkId)
  const { token, pool } = props

  // TODO: Remove fetching token balance via `useTokenBalance()` hook
  // Replace with `token0Balance` and `token1Balance` from `useTerminalPool()` hook
  const { balance } = useTokenBalance(token.address, pool.uniswapPool)

  return (
    <div className={classes.root}>
      <Typography className={classes.label}>{token.symbol} balance</Typography>
      <div className={classes.content}>
        <a
          href={`${etherscanUri}token/${token.address}`}
          target={'_blank'}
          rel={'noopener noreferrer'}
        >
          <TokenIcon className={classes.icon} token={token} />
        </a>
        <div className={classes.texts}>
          <Typography className={classes.balance}>
            {numberWithCommas(formatBigNumber(balance, token.decimals))}{' '}
            <span>{Number(token.percent).toFixed(2)}%</span>
          </Typography>
          <Typography className={classes.dollar}>
            ~ ${numberWithCommas(token.tvl as string)}
          </Typography>
        </div>
      </div>
    </div>
  )
}
