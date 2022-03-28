import { makeStyles, Typography } from '@material-ui/core'
import { TokenIcon } from 'components'
import { formatBigNumber } from 'utils'
import React from 'react'
import { ITerminalPool } from 'types'
import { TxState } from 'utils/enums'
import { BigNumber } from 'ethers'

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.colors.primary100,
    marginBottom: 8,
    fontSize: 12,
  },
  infoRow: {
    margin: '0 -4px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8,
  },
  token: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenIcon: {
    width: 36,
    height: 36,
    border: `4px solid ${theme.colors.transparent}`,
  },
  tokenLabel: {
    fontSize: 18,
    fontWeight: 700,
    color: 'white',
    marginLeft: 4,
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
  collectableFee: {
    backgroundColor: theme.colors.primary400,
    padding: '24px 32px',
  },
}))

interface IProps {
  poolData: ITerminalPool
  reinvestState: TxState
  token0Fee: BigNumber
  token1Fee: BigNumber
}

export const CollectableFees: React.FC<IProps> = ({
  poolData,
  reinvestState,
  token0Fee,
  token1Fee,
}) => {
  const classes = useStyles()
  const { user } = poolData

  return (
    <div className={classes.collectableFee}>
      <Typography className={classes.label}>
        {reinvestState === TxState.Complete
          ? 'REINVESTED FEES'
          : 'COLLECTABLE FEES'}
      </Typography>
      <div className={classes.infoRow}>
        <TokenIcon token={poolData.token0} className={classes.tokenIcon} />
        &nbsp;&nbsp;
        <Typography className={classes.amount}>
          {formatBigNumber(token0Fee, poolData.token0.decimals, 4)}
          &nbsp;
          {poolData.token0.symbol}
        </Typography>
      </div>

      <div className={classes.infoRow}>
        <TokenIcon token={poolData.token1} className={classes.tokenIcon} />
        &nbsp;&nbsp;
        <Typography className={classes.amount}>
          {formatBigNumber(token1Fee, poolData.token1.decimals, 4)}
          &nbsp;
          {poolData.token1.symbol}
        </Typography>
      </div>
    </div>
  )
}
