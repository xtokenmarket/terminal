import React, { useState } from 'react'
import { Button, makeStyles } from '@material-ui/core'
import { TokenBalanceInput, TokenSelect } from 'components'
import { IToken } from 'types'
import { BigNumber } from 'ethers'
import { ZERO } from 'utils/number'
import { RewardToken } from '.'
import { IRewardState } from '../..'

const useStyles = makeStyles(theme => ({
  rewardTokens: {

  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  }
}))

interface IProps {
  rewardState: IRewardState
  updateState: (_: Partial<IRewardState>) => void
}

export const RewardTokens: React.FC<IProps> = ({
  rewardState,
  updateState,
}) => {
  const cl = useStyles()

  const { tokens, amounts } = rewardState

  const onSelectToken = (token: IToken, i: number) => {
    if (tokens.includes(token)) return
    
    const newTokens = tokens
    newTokens.splice(i, 1, token)
    updateState({ tokens: newTokens })
    onChangeBalance(ZERO, i)
  }

  const onChangeBalance = (balance: BigNumber, i: number) => {
    const newAmounts = amounts
    newAmounts.splice(i, 1, balance)
    updateState({ amounts: newAmounts })
  }

  const onClickAdd = () => {
    console.log('add')
  }

  if (tokens.length === 0) {
    return (
      <RewardToken
        rewardFeePercent={0.01}
        balance={ZERO}
        onSelectToken={token => onSelectToken(token, 0)}
        onChangeBalance={balance => onChangeBalance(balance, 0)}
      />
    )
  }

  return (
    <>
      {tokens.map((token, i) => (
        <div key={i}>
          <RewardToken
            token={token}
            balance={amounts[i] || ZERO}
            rewardFeePercent={0.01}
            onSelectToken={token => onSelectToken(token, i)}
            onChangeBalance={balance => onChangeBalance(balance, i)}
          />
        </div>
      ))}
      <div className={cl.buttonRow}>
        <Button
          fullWidth
          disableRipple
          color="secondary"
          variant="contained"
          onClick={onClickAdd}
          disabled={!tokens[0] || !amounts[0] || amounts[0].isZero()}
        >
          ADD ANOTHER
        </Button>
      </div>
    </>
  )
}

