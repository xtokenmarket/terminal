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
    margin: '5px',
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
  onChange: (_: string) => void
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  ticksAtLimit: { [bound in Bound]?: boolean | undefined }
}

export const TokenPriceInput = (props: IProps) => {
  const {
    currencyA,
    currencyB,
    isMinPrice,
    label,
    onChange,
    priceLower,
    priceUpper,
    ticksAtLimit,
    getIncrementLower,
    getDecrementUpper,
    getDecrementLower,
    getIncrementUpper,
  } = props
  console.log('ticksAtLimit', ticksAtLimit)

  //  for focus state, styled components doesnt let you select input parent container
  const [active, setActive] = useState(false)

  // let user type value and only update parent value on blur
  const [localValue, setLocalValue] = useState('')
  const [useLocalValue, setUseLocalValue] = useState(false)

  const classes = useStyles()
  const commonClasses = useCommonStyles()

  const tokenA = (currencyA ?? undefined)?.wrapped
  const tokenB = (currencyB ?? undefined)?.wrapped
  const isSorted = tokenA && tokenB && tokenA.sortsBefore(tokenB)

  const leftPrice = isSorted ? priceLower : priceUpper?.invert()
  const rightPrice = isSorted ? priceUpper : priceLower?.invert()

  let value = ''
  if (isMinPrice) {
    value = ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]
      ? '0'
      : leftPrice?.toSignificant(5) ?? ''
  } else {
    value = ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]
      ? '∞'
      : rightPrice?.toSignificant(5) ?? ''
  }

  useEffect(() => {
    if (localValue !== value && !useLocalValue) {
      setTimeout(() => {
        setLocalValue(value) // reset local value to match parent
      }, 0)
    }
  }, [localValue, useLocalValue, value])

  const decrement = isSorted ? getDecrementLower : getIncrementUpper
  const increment = isSorted ? getIncrementLower : getDecrementUpper

  const handleOnFocus = () => {
    console.log('OnFocu')

    setUseLocalValue(true)
    setActive(true)
  }

  const handleOnBlur = useCallback(() => {
    console.log('OnBlur')
    setUseLocalValue(false)
    setActive(false)
  }, [localValue])

  const handleDecrement = useCallback(() => {
    setUseLocalValue(false)
  }, [decrement])

  const handleIncrement = useCallback(() => {
    setUseLocalValue(false)
  }, [increment])

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.button} onClick={handleIncrement}>
        <Button>
          <IncreaseIcon />{' '}
        </Button>
      </div>
      <div className={classes.button} onClick={handleDecrement}>
        <Button>
          <DecreaseIcon />{' '}
        </Button>
      </div>

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
          if (Number(e.target.value) < 0) return
          onChange(e.target.value || '0')
        }}
        variant="outlined"
        fullWidth
        type="number"
        label={label}
      />
    </div>
  )
}
