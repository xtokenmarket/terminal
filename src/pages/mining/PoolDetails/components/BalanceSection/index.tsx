import { makeStyles, Typography } from '@material-ui/core'
import { TokenIcon } from 'components'
import { formatBigNumber, numberWithCommas } from 'utils'
import { useConnectedWeb3Context } from 'contexts'
import { getEtherscanUri } from 'config/networks'
import { BigNumber } from 'ethers'
import { IToken } from 'types'
import { ETHER_DECIMAL } from 'config/constants'

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
    display: 'flex',
    fontWeight: 700,
    color: theme.colors.white,
    fontSize: 18,
    lineHeight: '28px',
    [theme.breakpoints.down('xs')]: {
      fontSize: 22,
    },
  },
  dollar: {
    color: theme.colors.primary100,
    fontSize: 14,
    lineHeight: '28px',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  percent: {
    background: theme.colors.primary200,
    fontSize: 12,
    fontWeight: 700,
    color: theme.colors.white,
    borderRadius: '16px',
    justifyContent: 'center',
    padding: '0 13px',
    marginLeft: 16,
    height: 28,
  },
}))

interface IProps {
  token: IToken
  isDeposit?: boolean
  deposit?: BigNumber
  tokenTvl?: string
}

export const BalanceSection = (props: IProps) => {
  const classes = useStyles()
  const { networkId } = useConnectedWeb3Context()

  const etherscanUri = getEtherscanUri(networkId)
  const { token, isDeposit, deposit, tokenTvl } = props

  return (
    <div className={classes.root}>
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
            {numberWithCommas(
              formatBigNumber(
                isDeposit
                  ? deposit || BigNumber.from(0)
                  : token.balance || BigNumber.from(0),
                ETHER_DECIMAL // `getStakedTokenBalance` returns the amounts in 18 decimals
              )
            )}{' '}
            {token.symbol}{' '}
            {!isDeposit && (
              <span className={classes.percent}>
                {Number(token.percent).toFixed(2)}%
              </span>
            )}
          </Typography>
          <Typography className={classes.dollar}>
            ~ $
            {numberWithCommas(
              isDeposit
                ? tokenTvl || '0'
                : formatBigNumber(token.tvl as string, ETHER_DECIMAL)
            )}
          </Typography>
        </div>
      </div>
    </div>
  )
}
