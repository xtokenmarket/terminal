import { BigNumber } from '@ethersproject/bignumber'
import { Button, Grid, makeStyles, Typography } from '@material-ui/core'
import { Token } from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import { TokenBalanceInput, TokenPriceInput } from 'components'
import { DEFAULT_NETWORK_ID } from 'config/constants'
import { useConnectedWeb3Context } from 'contexts'
import { ethers } from 'ethers'
import { useTokenBalance } from 'helpers'
import {
  usePools,
  useRangeHopCallbacks,
  useV3DerivedMintInfo,
} from 'helpers/univ3/hooks'
import { useState } from 'react'
import { ICreatePoolData, MintState } from 'types'
import { Bound, Field } from 'utils/enums'
import { ApproveTokenModal } from '../ApproveTokenModal'
import { WarningInfo } from '../ApproveTokenModal/components'

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
  const { balance: balance0 } = useTokenBalance(data.token0.address)
  const { balance: balance1 } = useTokenBalance(data.token1.address)

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [state, setState] = useState<IState>({
    ...initialState,
    independentField: !data.amount1.isZero()
      ? Field.CURRENCY_B
      : Field.CURRENCY_A,
    typedValue: !data.amount1.isZero()
      ? data.amount1.toString()
      : !data.amount0.isZero()
      ? data.amount0.toString()
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
    tickLower === undefined || tickUpper === undefined || invalidRange

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
    setState((prev) => ({
      ...prev,
      independentField: Field.CURRENCY_A,
      typedValue,
    }))
  }

  const onFieldBInput = (typedValue: string) => {
    setState((prev) => ({
      ...prev,
      independentField: Field.CURRENCY_B,
      typedValue,
    }))
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
      amount0: BigNumber.from(
        parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)
      ),
      amount1: BigNumber.from(
        parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)
      ),
      minPrice: state.leftRangeTypedValue,
      maxPrice: state.rightRangeTypedValue,
      ticks: {
        lowerTick: tickLower,
        upperTick: tickUpper,
      },
    })
    toggleApproveModal()
  }

  const toggleApproveModal = () => {
    setIsApproveModalOpen((prevState) => !prevState)
  }

  const onTokensApproved = () => {
    props.onNext()
  }

  const renderErrorMessage = () => {
    const getWarningInfo = (text: string) => {
      return (
        <WarningInfo
          className={classes.warning}
          title="Warning"
          description={text}
        />
      )
    }

    const getIsInsufficientBalance = (
      amount: string,
      balance: BigNumber,
      decimal: number
    ) => {
      return (
        amount &&
        Number(ethers.utils.formatUnits(balance, decimal)) <
          Number(ethers.utils.formatUnits(amount, decimal))
      )
    }

    if (invalidRange) {
      const text =
        'Invalid range selected. The min price must be lower than the max'
      return getWarningInfo(text)
    }

    if (
      getIsInsufficientBalance(
        formattedAmounts[Field.CURRENCY_A],
        balance0,
        data.token0.decimals
      )
    ) {
      const text = `Insufficient ${data.token0.symbol} balance`
      return getWarningInfo(text)
    }

    if (
      getIsInsufficientBalance(
        formattedAmounts[Field.CURRENCY_B],
        balance1,
        data.token1.decimals
      )
    ) {
      const text = `Insufficient ${data.token1.symbol} balance`
      return getWarningInfo(text)
    }
    return null
  }

  const getIsDisabled = () => {
    return !(
      state.leftRangeTypedValue &&
      state.rightRangeTypedValue &&
      parsedAmounts.CURRENCY_A &&
      parsedAmounts.CURRENCY_B &&
      !invalidRange &&
      !renderErrorMessage()
    )
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
              value={BigNumber.from(formattedAmounts[Field.CURRENCY_A] || '0')}
              onChange={(amount0) => {
                onFieldAInput(amount0.toString())
              }}
              token={data.token0}
              isDisabled={isTokenInputDisabled}
            />
            <TokenBalanceInput
              value={BigNumber.from(formattedAmounts[Field.CURRENCY_B] || '0')}
              onChange={(amount1) => {
                onFieldBInput(amount1.toString())
              }}
              token={data.token1}
              isDisabled={isTokenInputDisabled}
            />
          </Grid>
        </Grid>
      </div>
      <Typography className={classes.fee}>
        Pool Deployment fee is 0.1 ETH. Additional 1% fee on any rewards
        distributed for this pool.
      </Typography>
      {renderErrorMessage()}
      <Button
        color="primary"
        fullWidth
        onClick={onClickNext}
        variant="contained"
        disabled={getIsDisabled()}
      >
        Next
      </Button>

      {/* TODO: Skip token approval step, if tokens have been approved already */}
      <ApproveTokenModal
        isOpen={isApproveModalOpen}
        onClose={toggleApproveModal}
        onSuccess={onTokensApproved}
        poolData={data}
      />
    </div>
  )
}
