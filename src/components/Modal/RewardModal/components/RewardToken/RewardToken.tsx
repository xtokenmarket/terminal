import React, { useState } from 'react'
import { Button, makeStyles, Typography } from '@material-ui/core'
import { TokenBalanceInput, TokenSelect } from 'components'
import { IToken } from 'types'
import { BigNumber } from 'ethers'
import { ZERO } from 'utils/number'

const useStyles = makeStyles(theme => ({
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
    }
  },
}))

interface IProps {
  token?: IToken
  balance?: BigNumber
  rewardFeePercent: number,
  onSelectToken: (token: IToken) => void
  onChangeBalance: (balance: BigNumber) => void
  onRemove?: () => void
}

export const RewardToken: React.FC<IProps> = ({
  token,
  balance,
  rewardFeePercent,
  onSelectToken,
  onChangeBalance,
  onRemove,
}) => {
  const cl = useStyles()
  return (
    <div className={cl.rewardToken}>
      <Button
        disableRipple
        variant="text"
        className={cl.removeTextBtn}
        onClick={onRemove}
      >
        Remove Token
      </Button>
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