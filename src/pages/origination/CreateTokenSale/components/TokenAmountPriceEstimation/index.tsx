import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { IToken } from 'types'
import { numberWithCommas } from 'utils'
import { getTokenUsdPrice } from 'helpers/useTerminalPool/helper'
import { makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  priceElement: {
    whiteSpace: 'nowrap',
    color: theme.colors.primary100,
    fontSize: 14,
  },
}))

interface ITokenAmountPriceEstimation {
  token: IToken
  tokenAmount: number
  className?: string
}

export const TokenAmountPriceEstimation = ({
  token,
  tokenAmount,
  className,
}: ITokenAmountPriceEstimation) => {
  const classes = useStyles()
  const [priceEstimation, setPriceEstimation] = useState(0)
  const [tokenUsdPrice, setTokenUsdPrice] = useState(0)

  useEffect(
    () => setPriceEstimation(tokenAmount * tokenUsdPrice),
    [tokenAmount, tokenUsdPrice]
  )

  const updateTokenUsdPrice = async (tokenSymbol: string) => {
    try {
      setTokenUsdPrice(await getTokenUsdPrice(tokenSymbol))
    } catch (error) {
      // token USD price not found
      // reset it
      setTokenUsdPrice(0)
      console.error(error)
    }
  }

  useEffect(() => {
    updateTokenUsdPrice(token.symbol)
    // Update usd token price every 6 seconds
    const interval = setInterval(async () => {
      await updateTokenUsdPrice(token.symbol)
    }, 6 * 1000)

    return () => clearInterval(interval)
  }, [token])

  if (!priceEstimation) {
    return null
  }

  return (
    <Typography className={clsx(className, classes.priceElement)}>
      ~ ${numberWithCommas(priceEstimation.toString())}
    </Typography>
  )
}
