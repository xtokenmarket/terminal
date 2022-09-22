import React from 'react'
import { Button, makeStyles } from '@material-ui/core'
import { IToken } from 'types'
import { BigNumber } from 'ethers'
import { ZERO } from 'utils/number'
import { formatEther, formatUnits } from 'ethers/lib/utils'

import { RewardToken } from '.'
import { IRewardState } from '../..'

const useStyles = makeStyles((theme) => ({
  rewardTokens: {},
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
}))

interface IProps {
  isCreatePool: boolean
  rewardFeePercent: number
  rewardState: IRewardState
  updateState: (_: Partial<IRewardState>) => void
}

export const RewardTokens: React.FC<IProps> = ({
  isCreatePool,
  rewardFeePercent,
  rewardState,
  updateState,
}) => {
  const cl = useStyles()

  const { tokens, amounts, errors } = rewardState

  const onSelectToken = (token: IToken, i: number) => {
    if (
      tokens.some(
        (t) => t.address.toLowerCase() === token.address.toLowerCase()
      )
    )
      return

    const newTokens = tokens
    newTokens.splice(i, 1, token)

    const newErrors = errors
    newErrors.splice(i, 1, null)

    updateState({ tokens: newTokens, errors: newErrors })
    onChangeAmount(ZERO, ZERO, i)
  }

  const onChangeAmount = (
    amount: BigNumber,
    userBalance: BigNumber,
    i: number,
    token?: IToken
  ) => {
    const numAmount = Number(
      token ? formatUnits(amount, token.decimals) : formatEther(amount)
    )
    const numBalance = Number(
      token
        ? formatUnits(userBalance, token.decimals)
        : formatEther(userBalance)
    )
    const exceedsBalance = numBalance < (1 + rewardFeePercent) * numAmount
    const isZero = amount.isZero()
    const newErrors = errors

    if (!isCreatePool && (exceedsBalance || isZero)) {
      const errorMsg = isZero ? 'Invalid input' : 'Amount exceeds token balance'
      newErrors.splice(i, 1, errorMsg)
      updateState({ errors: newErrors })
    } else {
      if (errors[i]) {
        newErrors.splice(i, 1, null)
      }
    }

    const newAmounts = amounts
    newAmounts.splice(i, 1, amount)

    updateState({ amounts: newAmounts })
  }

  const onClickAdd = () => {
    const newAmounts = amounts
    newAmounts.push(ZERO)

    const newErrors = errors
    newErrors.push('Select token')

    updateState({
      amounts: newAmounts,
      errors: newErrors,
    })
  }

  const onClickRemove = (i: number) => {
    const newAmounts = amounts
    newAmounts.splice(i, 1)

    const newTokens = tokens
    newTokens.splice(i, 1)

    const newErrors = errors
    newErrors.splice(i, 1)

    updateState({
      amounts: newAmounts,
      tokens: newTokens,
      errors: newErrors,
    })
  }

  if (tokens.length === 0) {
    return (
      <RewardToken
        isCreatePool={isCreatePool}
        rewardFeePercent={rewardFeePercent}
        error={errors[0]}
        balance={ZERO}
        onSelectToken={(token) => onSelectToken(token, 0)}
        onChangeAmount={() => onChangeAmount(ZERO, ZERO, 0)}
        onRemove={() => onClickRemove(0)}
      />
    )
  }

  const isAddDisabled =
    !tokens[tokens.length - 1] ||
    (!isCreatePool && !amounts[amounts.length - 1]) ||
    errors.some((error) => !!error)

  return (
    <>
      {amounts.map((amount, i) => (
        <div key={i}>
          <RewardToken
            isCreatePool={isCreatePool}
            error={errors[i]}
            token={tokens[i]}
            balance={amount}
            rewardFeePercent={rewardFeePercent}
            onSelectToken={(token) => onSelectToken(token, i)}
            onChangeAmount={(amount, balance, token) =>
              onChangeAmount(amount, balance, i, token)
            }
            onRemove={() => onClickRemove(i)}
          />
        </div>
      ))}
      {isCreatePool && (
        <div className={cl.buttonRow}>
          <Button
            fullWidth
            disableRipple
            color="secondary"
            variant="contained"
            onClick={onClickAdd}
            disabled={isAddDisabled}
          >
            ADD ANOTHER
          </Button>
        </div>
      )}
    </>
  )
}
