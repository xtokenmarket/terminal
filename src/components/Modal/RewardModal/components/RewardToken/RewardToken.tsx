import React, { useState } from 'react'
import { Button, makeStyles, Typography } from '@material-ui/core'
import { TokenBalanceInput, TokenSelect } from 'components'
import { IToken } from 'types'
import { BigNumber } from 'ethers'
import { ZERO } from 'utils/number'

const useStyles = makeStyles((theme) => ({
  rewardToken: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
  },
  removeTextBtn: {
    fontSize: 12,
    color: theme.colors.primary100,
    marginTop: 8,
    alignSelf: 'flex-end',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}))

interface IProps {
  isCreatePool: boolean
  isInitiateRewardsPending: boolean
  token?: IToken
  balance?: BigNumber
  rewardFeePercent: number
  onSelectToken: (token: IToken) => void
  onChangeAmount: (amount: BigNumber, balance: BigNumber) => void
  onRemove?: () => void
}

export const RewardToken: React.FC<IProps> = ({
  isCreatePool,
  isInitiateRewardsPending,
  token,
  balance,
  rewardFeePercent,
  onSelectToken,
  onChangeAmount,
  onRemove,
}) => {
  const cl = useStyles()
  return (
    <div className={cl.rewardToken}>
      {!isInitiateRewardsPending && (
        <Button
          disableRipple
          variant="text"
          className={cl.removeTextBtn}
          onClick={onRemove}
        >
          Remove Token
        </Button>
      )}
      <TokenSelect
        className={isInitiateRewardsPending ? 'disabled' : ''}
        isDisabled={isInitiateRewardsPending}
        onChange={onSelectToken}
        token={token}
      />
      {token && balance && !isCreatePool && (
        <TokenBalanceInput
          variant="rewardToken"
          rewardFeePercent={rewardFeePercent}
          token={token}
          value={balance}
          onChange={onChangeAmount}
        />
      )}
    </div>
  )
}
