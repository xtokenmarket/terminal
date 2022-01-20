import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { TokenBalanceInput, TokenSelect } from 'components'
import { IToken } from 'types'
import { BigNumber } from 'ethers'
import { ZERO } from 'utils/number'

const useStyles = makeStyles(theme => ({
  rewardToken: {
    padding: theme.spacing(1),
    // background: 'red',
  },
}))

interface IProps {
  token?: IToken
  balance?: BigNumber
  rewardFeePercent: number,
  onSelectToken: (token: IToken) => void
  onChangeBalance: (balance: BigNumber) => void
}

export const RewardToken: React.FC<IProps> = ({
  token,
  balance,
  rewardFeePercent,
  onSelectToken,
  onChangeBalance,
}) => {
  const cl = useStyles()
  return (
    <div className={cl.rewardToken}>
      <TokenSelect onChange={onSelectToken} token={token} />
      {token && balance && (
        <TokenBalanceInput
          variant="rewardToken"
          rewardFeePercent={rewardFeePercent}
          token={token}
          value={balance}
          onChange={onChangeBalance}
        />
      )}
    </div>
  )
}