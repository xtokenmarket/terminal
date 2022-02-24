import { BigNumber } from '@ethersproject/bignumber'
import { makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { TokenIcon } from 'components'
import { ETHER_DECIMAL } from 'config/constants'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { IDepositState } from 'pages/PoolDetails/components'
import { ITerminalPool } from 'types'
import { formatBigNumber, numberWithCommas } from 'utils'

const useStyles = makeStyles((theme) => ({
  root: {},
  estimation: {
    backgroundColor: theme.colors.primary400,
    padding: '24px 32px',
  },
  label: {
    color: theme.colors.primary100,
    marginBottom: 8,
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
}))

interface IProps {
  className?: string
  poolData: ITerminalPool
  amount0: BigNumber
  amount1: BigNumber
  lpValue: BigNumber
  totalLiquidity: BigNumber
  isEstimation?: boolean
}

export const OutputEstimation = (props: IProps) => {
  const classes = useStyles()
  const { poolData, amount0, amount1, lpValue, totalLiquidity } = props
  const isEstimation =
    props.isEstimation !== undefined ? props.isEstimation : true

  const renderTokenPriceInUSD = (
    amount: BigNumber,
    decimal: number,
    price: string
  ) => {
    const totalPrice =
      Number(formatUnits(amount, decimal).toString()) * Number(price)

    return totalPrice.toFixed(2)
  }

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.estimation}>
        <Typography className={classes.label}>
          {poolData.token0.symbol}/{poolData.token1.symbol}{' '}
          {isEstimation ? 'LP YOU WILL RECEIVE' : 'LP YOU RECEIVED'}
        </Typography>
        <div className={classes.infoRow}>
          <div>
            <TokenIcon token={poolData.token0} className={classes.tokenIcon} />
            <TokenIcon token={poolData.token1} className={classes.tokenIcon} />
          </div>
          &nbsp;&nbsp;
          <Typography className={classes.amount}>
            {formatBigNumber(lpValue, ETHER_DECIMAL, 4)}
          </Typography>
        </div>
        <Typography className={classes.label}>
          {isEstimation ? 'YOU WILL DEPOSIT' : 'YOU DEPOSITED'}
        </Typography>
        <div className={classes.infoRow}>
          <TokenIcon token={poolData.token0} className={classes.tokenIcon} />
          &nbsp;&nbsp;
          <Typography className={classes.amount}>
            {formatBigNumber(amount0, poolData.token0.decimals, 4)}
            &nbsp;
            {poolData.token0.price && (
              <span>
                ~ $
                {renderTokenPriceInUSD(
                  amount0,
                  poolData.token0.decimals,
                  poolData.token0.price
                )}
              </span>
            )}
          </Typography>
        </div>
        <div className={classes.infoRow}>
          <TokenIcon token={poolData.token1} className={classes.tokenIcon} />
          &nbsp;&nbsp;
          <Typography className={classes.amount}>
            {formatBigNumber(amount1, poolData.token1.decimals, 4)}
            &nbsp;
            {poolData.token1.price && (
              <span>
                ~ $
                {renderTokenPriceInUSD(
                  amount0,
                  poolData.token1.decimals,
                  poolData.token1.price
                )}
              </span>
            )}
          </Typography>
        </div>
        <Typography className={classes.label}>SHARE OF POOL</Typography>
        <div>
          <Typography className={classes.amount}>
            {totalLiquidity.isZero()
              ? '-'
              : `${
                  lpValue.mul(1000000).div(totalLiquidity).toNumber() / 10000
                }%`}
          </Typography>
        </div>
      </div>
    </div>
  )
}
