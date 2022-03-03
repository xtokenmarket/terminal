import { makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { IRewardState, TokenIcon } from 'components'
import { formatBigNumber } from 'utils'
import { toUsd } from 'utils/number'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  root: {},
  estimation: {
    backgroundColor: theme.colors.primary400,
    padding: '24px 32px',
  },
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
}))

interface IProps {
  className?: string
  isCreatePool?: boolean
  rewardState: IRewardState
}

export const OutputEstimation: React.FC<IProps> = ({
  className,
  isCreatePool = false,
  rewardState,
}) => {
  const classes = useStyles()

  return (
    <div className={clsx(classes.root, className)}>
      <div className={classes.estimation}>
        <Typography className={classes.label}>
          {isCreatePool ? 'VESTING' : 'REWARDS'} PERIOD
        </Typography>
        <Typography className={classes.amount}>
          {isCreatePool ? rewardState.vesting || '0' : rewardState.duration}{' '}
          week(s)
        </Typography>
        <br />
        <Typography className={classes.label}>
          REWARD {isCreatePool ? 'TOKENS' : 'AMOUNTS'}
        </Typography>
        {rewardState.tokens.map((rewardToken, index) => {
          const amount = !isCreatePool
            ? formatBigNumber(
                rewardState.amounts[index],
                rewardToken.decimals,
                4
              )
            : '0'

          return (
            <div className={classes.infoRow} key={rewardToken.address}>
              <div className={classes.token}>
                <TokenIcon token={rewardToken} className={classes.tokenIcon} />
                {isCreatePool && (
                  <span className={classes.tokenLabel}>
                    {rewardToken.symbol}
                  </span>
                )}
              </div>
              &nbsp;&nbsp;
              {!isCreatePool && (
                <Typography className={classes.amount}>
                  {amount}
                  &nbsp;
                  {rewardToken.symbol}
                  &nbsp;
                  <span>
                    ~ {toUsd(Number(amount) * Number(rewardToken.price))}
                  </span>
                </Typography>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
