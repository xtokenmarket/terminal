import { BigNumber } from '@ethersproject/bignumber'
import { Button, Grid, makeStyles, Typography } from '@material-ui/core'
import { Token } from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import { TokenBalanceInput, TokenPriceInput } from 'components'
import { DEFAULT_NETWORK_ID, FEE_TIPS } from 'config/constants'
import { useConnectedWeb3Context } from 'contexts'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { useTokenBalance } from 'helpers'
import {
  usePools,
  useRangeHopCallbacks,
  useV3DerivedMintInfo,
} from 'helpers/univ3/hooks'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { ICreatePoolData, MintState } from 'types'
import { Bound, Field } from 'utils/enums'
import { WarningInfo } from 'components/Common/WarningInfo'
import { useNetworkContext } from 'contexts/networkContext'

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
  warning: {
    margin: '20px 0',
    padding: '16px !important',
    '& div': {
      '&:first-child': {
        marginTop: 0,
        marginRight: 16,
      },
      '& p': {
        fontSize: 14,
        marginTop: 3,
        '&:first-child': { fontSize: 16, marginTop: 0 },
      },
    },
  },
  fullRangeButtonText: {
    color: 'white',
    fontFamily: 'Gilmer',
    fontWeight: 700,
  },
  fullRangeButton: {
    margin: '0px 12px 30px 12px',
  },
}))

interface IProps {
  data: ICreatePoolData
  updateData: (_: any) => void
  onNext: () => void
}

interface IState extends MintState {
  successVisible: boolean
  balanceErrors: (string | null)[]
}

const initialState: IState = {
  independentField: Field.CURRENCY_A,
  typedValue: '',
  otherTypedValue: '',
  startPriceTypedValue: '',
  leftRangeTypedValue: '',
  rightRangeTypedValue: '',
  successVisible: false,
  balanceErrors: [],
}

export const PriceRangeStep = (props: IProps) => {
  const { data, updateData } = props
  const classes = useStyles()
  const { networkId } = useConnectedWeb3Context()
  const { chainId } = useNetworkContext()

  const [state, setState] = useState<IState>({
    ...initialState,
    independentField: !data.amount1.isZero()
      ? Field.CURRENCY_B
      : Field.CURRENCY_A,
    typedValue: !data.amount1.isZero()
      ? formatUnits(data.amount1, data.token1.decimals)
      : !data.amount0.isZero()
      ? formatUnits(data.amount0, data.token0.decimals)
      : '',
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
  const feeTip = FEE_TIPS[chainId]

  // prevent an error if they input ETH/WETH
  const quoteCurrency =
    baseCurrency && currencyB && baseCurrency.equals(currencyB)
      ? undefined
      : currencyB

  const [poolState, pool] = usePools([[baseCurrency, currencyB, feeAmount]])[0]

  const {
    ticks,
    dependentField,
    parsedAmounts,
    pricesAtTicks,
    ticksAtLimit,
    invalidRange,
    errorMessage,
    outOfRange,
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

  // get value and prices at ticks
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

  // get formatted amounts
  const formattedAmounts = {
    [state.independentField]: state.typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const tokenA = (baseCurrency ?? undefined)?.wrapped
  const tokenB = (currencyB ?? undefined)?.wrapped
  const isSorted = tokenA && tokenB && tokenA.sortsBefore(tokenB)

  const leftPrice = isSorted ? priceLower : priceUpper?.invert()
  const rightPrice = isSorted ? priceUpper : priceLower?.invert()

  const isTokenInputDisabled =
    tickLower === undefined ||
    tickUpper === undefined ||
    invalidRange ||
    outOfRange

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
      amount0: parseUnits(
        parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) || '0',
        data.token0.decimals
      ),
      amount1: parseUnits(
        parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) || '0',
        data.token1.decimals
      ),
      minPrice: state.leftRangeTypedValue,
      maxPrice: state.rightRangeTypedValue,
      ticks: {
        lowerTick: tickLower,
        upperTick: tickUpper,
      },
    })
    props.onNext()
  }

  const onTokenInputChange = (field: Field, amount: BigNumber) => {
    setState((prev) => ({
      ...prev,
      independentField: field,
      typedValue: formatUnits(
        amount.toString(),
        field === Field.CURRENCY_A ? data.token0.decimals : data.token1.decimals
      ),
    }))
  }

  const { balance: balanceA } = useTokenBalance(data.token0.address)
  const { balance: balanceB } = useTokenBalance(data.token1.address)

  useEffect(() => {
    const amountA = Number(formattedAmounts[Field.CURRENCY_A] || '0')
    const amountB = Number(formattedAmounts[Field.CURRENCY_B] || '0')

    const newErrors: string[] = []
    const newErrorA = `${data.token0.symbol} input exceeds balance`
    const newErrorB = `${data.token1.symbol} input exceeds balance`
    const newErrorC = `Your position will not earn fees or be used in trades until the market price moves into your range.`

    if (amountA > Number(formatUnits(balanceA, data.token0.decimals))) {
      newErrors.push(newErrorA)
    }
    if (amountB > Number(formatUnits(balanceB, data.token1.decimals))) {
      newErrors.push(newErrorB)
    }
    if ((amountA > 0 && amountB === 0) || (amountB > 0 && amountA === 0)) {
      newErrors.push(newErrorC)
    }

    if (!_.isEqual(state.balanceErrors, newErrors)) {
      setState((prev) => ({
        ...prev,
        balanceErrors: newErrors,
      }))
    }
  }, [balanceA, balanceB, formattedAmounts, data, state.balanceErrors])

  const isNextBtnDisabled = !(
    state.leftRangeTypedValue &&
    state.rightRangeTypedValue &&
    parsedAmounts.CURRENCY_A &&
    parsedAmounts.CURRENCY_B &&
    !invalidRange &&
    !errorMessage &&
    !state.balanceErrors.some((e) => !!e) &&
    !outOfRange
  )

  const onFullRangeClick = () => {
    setState((prev) => ({
      ...prev,
      leftRangeTypedValue: true,
      rightRangeTypedValue: true,
    }))
  }

  const totalErrors = [...state.balanceErrors].filter((e) => !!e)

  if (errorMessage) totalErrors.push(errorMessage)

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
                    decrementDisabled={
                      ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]
                    }
                    incrementDisabled={
                      ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]
                    }
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
                    decrementDisabled={
                      ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]
                    }
                    incrementDisabled={
                      ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]
                    }
                  />
                </Grid>

                <Button
                  color="secondary"
                  fullWidth
                  onClick={onFullRangeClick}
                  variant="contained"
                  className={classes.fullRangeButton}
                >
                  <span className={classes.fullRangeButtonText}>
                    FULL RANGE
                  </span>
                </Button>
              </Grid>
            </div>
          </Grid>

          <Grid item xs={12} sm={12} md={6}>
            <Typography className={classes.label}>Deposit amounts</Typography>
            <TokenBalanceInput
              className="token0-balance-input"
              value={parseUnits(
                formattedAmounts[Field.CURRENCY_A] || '0',
                data.token0.decimals
              )}
              onChange={(amount) =>
                onTokenInputChange(Field.CURRENCY_A, amount)
              }
              token={data.token0}
              isDisabled={isTokenInputDisabled}
            />
            <TokenBalanceInput
              className="token1-balance-input"
              value={parseUnits(
                formattedAmounts[Field.CURRENCY_B] || '0',
                data.token1.decimals
              )}
              onChange={(amount) =>
                onTokenInputChange(Field.CURRENCY_B, amount)
              }
              token={data.token1}
              isDisabled={isTokenInputDisabled}
            />
          </Grid>
        </Grid>
      </div>
      <Typography className={classes.fee}>{feeTip}</Typography>
      {totalErrors.length > 0 && (
        <WarningInfo
          className={classes.warning}
          title="Warning"
          description={totalErrors.join('; ')}
        />
      )}
      <Button
        color="primary"
        fullWidth
        onClick={onClickNext}
        variant="contained"
        disabled={isNextBtnDisabled}
      >
        Next
      </Button>
    </div>
  )
}
