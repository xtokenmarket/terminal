import { BigNumber } from '@ethersproject/bignumber'
import { makeStyles, TextField, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import useCommonStyles from 'style/common'
import { IToken } from 'types'
import { Currency, Price, Token } from '@uniswap/sdk-core'
import { Bound } from 'utils/enums'

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
  } = props
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

  // TODO: Add increment and decrement symbols along with functionality
  return (
    <div className={clsx(classes.root, props.className)}>
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
        value={value}
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
