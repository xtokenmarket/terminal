import { BigNumber } from '@ethersproject/bignumber'
import { makeStyles, TextField, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { TokenIcon } from 'components'
import { ethers } from 'ethers'
import { useTokenBalance } from 'helpers'
import { useEffect, useState } from 'react'
import useCommonStyles from 'style/common'
import { IToken } from 'types'
import { formatBigNumber } from 'utils'

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 16,
    position: 'relative',
    paddingTop: 10,
  },
  input: {
    '& .Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.colors.white,
        borderWidth: 1,
      },
    },
  },
  inputBox: { paddingRight: 60, fontWeight: 700 },
  inputBoxDisabled: {
    paddingRight: 60,
    fontWeight: 700,
    color: theme.colors.gray2,
  },
  inputLabel: { color: `${theme.colors.white} !important` },
  inputLabelDisabled: { color: `${theme.colors.gray2} !important` },
  notchedOutline: {
    borderColor: theme.colors.primary200,
  },
  token: {
    position: 'absolute',
    right: 16,
    top: -6,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  tokenIcon: { width: 32, height: 32, borderRadius: '50%' },
  tokenLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: theme.colors.primary100,
    marginTop: 4,
  },
  balance: {
    fontSize: 12,
    color: theme.colors.primary100,
    marginTop: 8,
    textDecoration: 'underline',
    '& span': { fontWeight: 700 },
  },
  bottomRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}))

type Variant = 'normal' | 'rewardToken'

interface IProps {
  className?: string
  variant?: Variant
  rewardFeePercent?: number
  token: IToken
  value: BigNumber
  onChange: (_: BigNumber, balance: BigNumber) => void
  isDisabled?: boolean
}

interface IState {
  amount: string
}

export const TokenBalanceInput: React.FC<IProps> = ({
  token,
  value,
  onChange,
  variant = 'normal',
  rewardFeePercent,
  className,
  isDisabled = false,
}) => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()
  const { balance } = useTokenBalance(token.address)

  const [state, setState] = useState<IState>({ amount: '' })
  useEffect(() => {
    if (
      !ethers.utils.parseUnits(state.amount || '0', token.decimals).eq(value)
    ) {
      if (value.isZero()) {
        setState((prev) => ({ ...prev, amount: '' }))
      } else {
        setState((prev) => ({
          ...prev,
          amount: ethers.utils.formatUnits(value || '0', token.decimals),
        }))
      }
    }
  }, [value, state.amount, token.decimals])

  return (
    <div className={clsx(classes.root, className)}>
      <TextField
        InputLabelProps={{
          className: isDisabled
            ? classes.inputLabelDisabled
            : classes.inputLabel,
        }}
        InputProps={{
          classes: {
            notchedOutline: classes.notchedOutline,
            input: clsx(
              commonClasses.hideInputArrow,
              isDisabled ? classes.inputLabelDisabled : classes.inputBox
            ),
          },
        }}
        className={classes.input}
        value={state.amount}
        onChange={(e) => {
          const amount = Number(e.target.value)
          if (amount < 0) return
          setState((prev) => ({ ...prev, amount: amount.toString() }))
          onChange(
            ethers.utils.parseUnits(amount.toString() || '0', token.decimals),
            balance
          )
        }}
        variant="outlined"
        fullWidth
        type="number"
        label={`${token.symbol.toUpperCase()} amount`}
        disabled={isDisabled}
      />
      <div className={classes.token}>
        <TokenIcon token={token} className={classes.tokenIcon} />
        <span className={classes.tokenLabel}>{token.symbol}</span>
      </div>
      <div className={classes.bottomRow}>
        <Typography className={classes.balance}>
          Available -{' '}
          <b>
            {formatBigNumber(balance, token.decimals, 4)} {token.symbol}
          </b>
        </Typography>
        {variant === 'rewardToken' && rewardFeePercent && (
          <Typography className={classes.balance}>
            Total rewards (incl. {rewardFeePercent * 100}% fee) -{' '}
            <b>
              {Number(state.amount) * (1 + rewardFeePercent)} {token.name}
            </b>
          </Typography>
        )}
      </div>
    </div>
  )
}
