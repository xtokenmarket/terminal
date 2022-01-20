import { BigNumber } from '@ethersproject/bignumber'
import {
  Button,
  CircularProgress,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core'
import { Token } from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import { TokenBalanceInput, TokenPriceInput } from 'components'
import { DEFAULT_NETWORK_ID } from 'config/constants'
import { useConnectedWeb3Context } from 'contexts'
import { useIsMountedRef, useServices } from 'helpers'
import {
  usePools,
  useRangeHopCallbacks,
  useV3DerivedMintInfo,
} from 'helpers/univ3/hooks'
import { transparentize } from 'polished'
import { useEffect, useState } from 'react'
import { ICreatePoolData, IToken, MintState } from 'types'
import { Bound, Field } from 'utils/enums'
import { ZERO } from 'utils/number'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  label: {
    color: theme.colors.white,
    marginBottom: 16,
  },
  fee: {
    marginTop: 16,
    fontSize: 12,
    color: theme.colors.primary100,
    marginBottom: 8,
  },
  rangeWrapper: {
    borderRadius: 4,
    backgroundColor: theme.colors.seventh,
    padding: 8,
  },
}))

interface IProps {
  data: ICreatePoolData
  updateData: (_: any) => void
  onNext: () => void
}

interface IState extends MintState {
  successVisible: boolean
}

const initialState: IState = {
  independentField: Field.CURRENCY_A,
  typedValue: '',
  otherTypedValue: '',
  startPriceTypedValue: '',
  leftRangeTypedValue: '',
  rightRangeTypedValue: '',
  successVisible: false,
}

export const PriceRangeStep = (props: IProps) => {
  const { data, updateData } = props
  const classes = useStyles()
  const { networkId } = useConnectedWeb3Context()
  const [state, setState] = useState<IState>({
    ...initialState,
    leftRangeTypedValue: data.minPrice,
    rightRangeTypedValue: data.maxPrice,
  })

  const baseCurrency = new Token(
    networkId || DEFAULT_NETWORK_ID,
    data.token0.address,
    data.token0.decimals,
    data.token0.symbol,
    data.token0.name
  )
  const currencyB = new Token(
    networkId || DEFAULT_NETWORK_ID,
    data.token1.address,
    data.token1.decimals,
    data.token1.symbol,
    data.token1.name
  )
  const feeAmount: FeeAmount = data.tier.toNumber()

  // prevent an error if they input ETH/WETH
  const quoteCurrency =
    baseCurrency && currencyB && baseCurrency.equals(currencyB)
      ? undefined
      : currencyB

  const handleAmountsChange = (amount0: BigNumber, amount1: BigNumber) => {
    updateData({ amount0, amount1 })
  }

  const [poolState, pool] = usePools([[baseCurrency, currencyB, feeAmount]])[0]
  console.log(poolState, pool)

  const {
    ticks,
    dependentField,
    price,
    pricesAtTicks,
    position,
    noLiquidity,
    currencies,
    errorMessage,
    invalidPool,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    invertPrice,
    ticksAtLimit,
  } = useV3DerivedMintInfo(
    state,
    baseCurrency ?? undefined,
    currencyB ?? undefined,
    feeAmount,
    baseCurrency ?? undefined,
    undefined,
    poolState,
    pool
  )

  console.log('ticks', ticks, pricesAtTicks)

  // get value and prices at ticks
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

  const tokenA = (baseCurrency ?? undefined)?.wrapped
  const tokenB = (currencyB ?? undefined)?.wrapped
  const isSorted = tokenA && tokenB && tokenA.sortsBefore(tokenB)

  const leftPrice = isSorted ? priceLower : priceUpper?.invert()
  const rightPrice = isSorted ? priceUpper : priceLower?.invert()

  const {
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
  } = useRangeHopCallbacks(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount,
    tickLower,
    tickUpper,
    pool
  )

  const onFieldAInput = (typedValue: string) => {
    if (noLiquidity) {
      if (state.independentField === Field.CURRENCY_A) {
        setState((prev) => ({
          ...prev,
          independentField: Field.CURRENCY_A,
          typedValue,
        }))
      } else {
        setState((prev) => ({
          ...prev,
          independentField: Field.CURRENCY_A,
          typedValue,
        }))
      }
    } else {
      setState((prev) => ({
        ...prev,
        independentField: Field.CURRENCY_A,
        typedValue,
      }))
    }
  }

  const onFieldBInput = (typedValue: string) => {
    if (noLiquidity) {
      if (state.independentField === Field.CURRENCY_B) {
        setState((prev) => ({
          ...prev,
          independentField: Field.CURRENCY_B,
          typedValue,
        }))
      } else {
        setState((prev) => ({
          ...prev,
          independentField: Field.CURRENCY_B,
          typedValue,
        }))
      }
    } else {
      setState((prev) => ({
        ...prev,
        independentField: Field.CURRENCY_B,
        typedValue,
      }))
    }
  }

  const onLeftRangeInput = (typedValue: string) => {
    setState((prev) => ({
      ...prev,
      leftRangeTypedValue: typedValue,
    }))
  }

  const onRightRangeInput = (typedValue: string) => {
    setState((prev) => ({
      ...prev,
      rightRangeTypedValue: typedValue,
    }))
  }

  const onClickNext = () => {
    updateData({
      minPrice: state.leftRangeTypedValue,
      maxPrice: state.rightRangeTypedValue,
    })
    props.onNext()
  }

  return (
    <div className={classes.root}>
      <div>
        <Grid container spacing={3}>
          <Grid item sm={12} md={6}>
            <Typography className={classes.label}>Set price range</Typography>
            <div className={classes.rangeWrapper}>
              {/* TODO: Add price range graph */}
              <Grid container spacing={3}>
                <Grid item xs={6} sm={6}>
                  <TokenPriceInput
                    value={
                      ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]
                        ? '0'
                        : leftPrice?.toSignificant(5) ?? ''
                    }
                    currencyA={baseCurrency}
                    currencyB={quoteCurrency}
                    feeAmount={feeAmount}
                    getDecrementLower={getDecrementLower}
                    getIncrementLower={getIncrementLower}
                    getDecrementUpper={getDecrementUpper}
                    getIncrementUpper={getIncrementUpper}
                    isMinPrice
                    priceLower={priceLower}
                    priceUpper={priceUpper}
                    label={'Min price'}
                    onUserInput={(amount0) => onLeftRangeInput(amount0)}
                    ticksAtLimit={ticksAtLimit}
                    decrement={isSorted ? getDecrementLower : getIncrementUpper}
                    increment={isSorted ? getIncrementLower : getDecrementUpper}
                  />
                </Grid>
                <Grid item xs={6} sm={6}>
                  <TokenPriceInput
                    value={
                      ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]
                        ? '∞'
                        : rightPrice?.toSignificant(5) ?? ''
                    }
                    currencyA={baseCurrency}
                    currencyB={quoteCurrency}
                    feeAmount={feeAmount}
                    getDecrementLower={getDecrementLower}
                    getIncrementLower={getIncrementLower}
                    getDecrementUpper={getDecrementUpper}
                    getIncrementUpper={getIncrementUpper}
                    priceLower={priceLower}
                    priceUpper={priceUpper}
                    label={'Max price'}
                    onUserInput={(amount1) => onRightRangeInput(amount1)}
                    ticksAtLimit={ticksAtLimit}
                    decrement={isSorted ? getDecrementUpper : getIncrementLower}
                    increment={isSorted ? getIncrementUpper : getDecrementLower}
                  />
                </Grid>
              </Grid>
            </div>
          </Grid>

          <Grid item xs={12} sm={12} md={6}>
            <Typography className={classes.label}>Deposit amounts</Typography>
            <TokenBalanceInput
              value={data.amount0}
              onChange={(amount0) => {
                handleAmountsChange(amount0, ZERO)
              }}
              token={data.token0}
            />
            <TokenBalanceInput
              value={data.amount1}
              onChange={(amount1) => {
                handleAmountsChange(ZERO, amount1)
              }}
              token={data.token1}
            />
          </Grid>
        </Grid>
      </div>
      <Typography className={classes.fee}>
        Pool Deployment fee is 0.1 ETH. Additional 1% fee on any rewards
        distributed for this pool.
      </Typography>
      <Button
        color="primary"
        fullWidth
        onClick={onClickNext}
        variant="contained"
      >
        Next
      </Button>
    </div>
  )
}
