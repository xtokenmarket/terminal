import { BigNumber } from '@ethersproject/bignumber'
import { makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { TokenIcon } from 'components'
import { ITerminalPool } from 'types'
import { formatBigNumber, getTotalTokenPrice } from 'utils'

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
  isEstimation?: boolean
}

export const OutputEstimation = (props: IProps) => {
  const classes = useStyles()
  const { poolData, amount0, amount1 } = props
  const isEstimation =
    props.isEstimation !== undefined ? props.isEstimation : true

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.estimation}>
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
                {getTotalTokenPrice(
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
                {getTotalTokenPrice(
                  amount1,
                  poolData.token1.decimals,
                  poolData.token1.price
                )}
              </span>
            )}
          </Typography>
        </div>
      </div>
    </div>
  )
}
