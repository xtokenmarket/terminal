import { BigNumber } from '@ethersproject/bignumber'
import { Button, makeStyles, TextField, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import useCommonStyles from 'style/common'
import { IToken } from 'types'
import { Currency, Price, Token } from '@uniswap/sdk-core'
import { Bound } from 'utils/enums'
import { ReactComponent as IncreaseIcon } from 'assets/svgs/increase.svg'
import { ReactComponent as DecreaseIcon } from 'assets/svgs/decrease.svg'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  input: {
    '& .Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.colors.white,
        borderWidth: 1,
      },
    },
  },
  inputBox: {
    paddingRight: 60,
    fontWeight: 700,
    paddingBottom: 50,
  },
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
  button: {
    width: 32,
    height: 32,
    background: theme.colors.primary200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '4px',
    margin: 7,
  },
  border: {
    height: 100,
    display: 'flex',
    alignItems: 'center',
  },
  buttonWrapper: {
    position: 'absolute',
    right: 2,
  },
  inputBottomText: {
    position: 'absolute',
    bottom: 28,
    left: 15,
    color: theme.colors.primary100,
    fontSize: 14,
  },
}))

interface IProps {
  className?: string
  currencyA?: Currency | null
  currencyB?: Currency | null
  feeAmount?: number
  getDecrementLower: () => string
  getDecrementUpper: () => string
  getIncrementLower: () => string
  getIncrementUpper: () => string
  isMinPrice?: boolean
  label: string
  onUserInput: (_: string) => void
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  ticksAtLimit: { [bound in Bound]?: boolean | undefined }
  value: string
  decrement: () => string
  increment: () => string
  decrementDisabled: boolean | undefined
  incrementDisabled: boolean | undefined
}

export const TokenPriceInput = (props: IProps) => {
  const {
    label,
    priceLower,
    priceUpper,
    ticksAtLimit,
    value,
    decrement,
    increment,
    onUserInput,
    currencyA,
    currencyB,
    decrementDisabled,
    incrementDisabled,
  } = props
  //  for focus state, styled components doesnt let you select input parent container
  const [active, setActive] = useState(false)

  // let user type value and only update parent value on blur
  const [localValue, setLocalValue] = useState('')
  const [useLocalValue, setUseLocalValue] = useState(false)

  const classes = useStyles()
  const commonClasses = useCommonStyles()

  const handleOnFocus = () => {
    setUseLocalValue(true)
    setActive(true)
  }

  const handleOnBlur = useCallback(() => {
    setUseLocalValue(false)
    setActive(false)
    onUserInput(localValue)
  }, [localValue, onUserInput])

  const handleDecrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(decrement())
  }, [decrement, onUserInput])

  const handleIncrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(increment())
  }, [increment, onUserInput])

  useEffect(() => {
    if (localValue !== value && !useLocalValue) {
      setTimeout(() => {
        setLocalValue(value) // reset local value to match parent
      }, 0)
    }
  }, [localValue, useLocalValue, value])

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.border}>
        <TextField
          onBlur={handleOnBlur}
          onFocus={handleOnFocus}
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
          value={localValue}
          onChange={(e) => {
            const amount = Number(e.target.value)
            if (amount < 0) return
            setLocalValue(amount.toString() || '0')
          }}
          variant="outlined"
          fullWidth
          // for ∞ to be shown
          type={localValue === '∞' ? 'text' : 'number'}
          label={label}
        />
        <div className={classes.inputBottomText}>
          {' '}
          {currencyB?.symbol?.toUpperCase()} per{' '}
          {currencyA?.symbol?.toUpperCase()}
        </div>
        <div className={classes.buttonWrapper}>
          <div className={classes.button}>
            <Button disabled={incrementDisabled} onClick={handleIncrement}>
              <IncreaseIcon />{' '}
            </Button>
          </div>
          <div className={classes.button}>
            <Button disabled={decrementDisabled} onClick={handleDecrement}>
              <DecreaseIcon />{' '}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
