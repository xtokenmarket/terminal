import { BigNumber } from '@ethersproject/bignumber'
import { makeStyles, TextField, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { TokenIcon } from 'components'
import { ethers } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { useTokenBalance } from 'helpers'
import { useEffect, useState } from 'react'
import useCommonStyles from 'style/common'
import { IToken } from 'types'
import { formatBigNumber } from 'utils'
import { ZERO } from 'utils/number'

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
  inputLabel: { color: `${theme.colors.white} !important` },
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

type Variant =
  | 'normal'
  | 'rewardToken'

interface IProps {
  className?: string
  variant?: Variant
  rewardFeePercent?: number
  token: IToken
  value: BigNumber
  onChange: (_: BigNumber) => void
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
}) => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()
  const { balance } = useTokenBalance(token.address)

  const [state, setState] = useState<IState>({ amount: '' })
  useEffect(() => {
    if (
      !ethers.utils
        .parseUnits(state.amount || '0', token.decimals)
        .eq(value)
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
          className: classes.inputLabel,
        }}
        InputProps={{
          classes: {
            notchedOutline: classes.notchedOutline,
            input: clsx(commonClasses.hideInputArrow, classes.inputBox),
          },
        }}
        className={classes.input}
        value={state.amount}
        onChange={(e) => {
          const { value } = e.target
          if (Number(value) < 0) return
          if (value === '') {
            setState((prev) => ({ ...prev, amount: '' }))
            onChange(ZERO)
            return
          }

          const precision = value.split('.')[1]?.length || 0
          let amount = ethers.utils.parseUnits(value || '0', token.decimals)
          if (amount.gt(balance)) amount = balance

          const newValue = Number(formatEther(amount)).toFixed(precision)
          setState((prev) => ({ ...prev, amount: newValue }))
          onChange(
            ethers.utils.parseUnits(newValue || '0', token.decimals)
          )
        }}
        variant="outlined"
        fullWidth
        type="number"
        label={`${token.symbol.toUpperCase()} amount`}
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
            Total rewards (incl. {(rewardFeePercent * 100)}% fee) -{' '}
            <b>
              {Number(state.amount) * (1 + rewardFeePercent)}
              {' '}{token.name}
            </b>
          </Typography>
        )}
      </div>
    </div>
  )
}
