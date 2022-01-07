import { makeStyles, Typography } from '@material-ui/core'
import { TokenIcon } from 'components'
import { useTokenBalance } from 'helpers'
import { ITerminalPool, IToken } from 'types'
import { formatBigNumber } from 'utils'

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
  percent: string
}

export const BalanceSection = (props: IProps) => {
  const classes = useStyles()
  const { token, pool, percent } = props

  const { balance } = useTokenBalance(token.address, pool.uniswapPool)

  return (
    <div className={classes.root}>
      <Typography className={classes.label}>{token.symbol} balance</Typography>
      <div className={classes.content}>
        <TokenIcon className={classes.icon} token={token} />
        <div className={classes.texts}>
          <Typography className={classes.balance}>
            {formatBigNumber(balance, token.decimals)} <span>{percent}%</span>
          </Typography>
          <Typography className={classes.dollar}>~ $2374.04</Typography>
        </div>
      </div>
    </div>
  )
}
