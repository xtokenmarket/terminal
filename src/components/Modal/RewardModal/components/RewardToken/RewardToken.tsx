import React from 'react'
import { Button, makeStyles } from '@material-ui/core'
import { TokenBalanceInput, TokenSelect } from 'components'
import { IToken } from 'types'
import { BigNumber } from 'ethers'

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
  warning: {
    color: theme.colors.warn2,
    fontSize: 14,
  },
}))

interface IProps {
  isCreatePool: boolean
  error: string | null
  token?: IToken
  balance?: BigNumber
  rewardFeePercent: number
  onSelectToken: (token: IToken) => void
  onChangeAmount: (
    amount: BigNumber,
    balance: BigNumber,
    token?: IToken
  ) => void
  onRemove?: () => void
}

export const RewardToken: React.FC<IProps> = ({
  isCreatePool,
  error,
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
      {isCreatePool && (
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
        className={!isCreatePool ? 'disabled' : ''}
        isDisabled={!isCreatePool}
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
      {!!error && error !== 'Enter amount' && error !== 'Select token' && (
        <div className={cl.warning}>{error}</div>
      )}
    </div>
  )
}
