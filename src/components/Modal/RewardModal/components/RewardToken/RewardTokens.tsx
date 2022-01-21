import React, { useEffect, useState } from 'react'
import { Button, makeStyles } from '@material-ui/core'
import { TokenBalanceInput, TokenSelect } from 'components'
import { IToken } from 'types'
import { BigNumber } from 'ethers'
import { ZERO } from 'utils/number'
import { RewardToken } from '.'
import { IRewardState } from '../..'
import { useIsMountedRef, useServices } from 'helpers'

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
  const { lmService } = useServices()
  const [rewardFeePercent, setRewardFeePercent] = useState(0)
  useEffect(() => {
    (async () => {
      const fee = await lmService.getRewardFee()
      setRewardFeePercent(fee / 100)
    })()
  }, [lmService])

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
    const newAmounts = amounts
    newAmounts.push(ZERO)
    updateState({ amounts: newAmounts })
  }

  const onClickRemove = (i: number) => {
    const newAmounts = amounts
    newAmounts.splice(i, 1)

    const newTokens = tokens
    newTokens.splice(i, 1)

    updateState({
      amounts: newAmounts,
      tokens: newTokens,
    })
  }

  if (tokens.length === 0) {
    return (
      <RewardToken
        rewardFeePercent={rewardFeePercent}
        balance={ZERO}
        onSelectToken={token => onSelectToken(token, 0)}
        onChangeBalance={balance => onChangeBalance(balance, 0)}
        onRemove={() => onClickRemove(0)}
      />
    )
  }

  return (
    <>
      {amounts.map((amount, i) => (
        <div key={i}>
          <RewardToken
            token={tokens[i]}
            balance={amount}
            rewardFeePercent={rewardFeePercent}
            onSelectToken={token => onSelectToken(token, i)}
            onChangeBalance={balance => onChangeBalance(balance, i)}
            onRemove={() => onClickRemove(i)}
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

