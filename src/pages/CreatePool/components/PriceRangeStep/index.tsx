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
import { TokenBalanceInput, TokenSelect } from 'components'
import { DEFAULT_NETWORK_ID, NULL_ADDRESS } from 'config/constants'
import { useConnectedWeb3Context } from 'contexts'
import { useIsMountedRef, useServices } from 'helpers'
import { useRangeHopCallbacks, useV3DerivedMintInfo } from 'helpers/univ3/hooks'
import { transparentize } from 'polished'
import { useEffect, useState } from 'react'
import { IToken, MintState } from 'types'
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
  data: {
    token0: IToken
    token1: IToken
    tier: BigNumber
    uniPool: string
    amount0: BigNumber
    amount1: BigNumber
  }
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
  const classes = useStyles()
  const { account, networkId, setWalletConnectModalOpened, setTxModalInfo } =
    useConnectedWeb3Context()
  const { lmService, uniPositionService } = useServices()
  const [state, setState] = useState<IState>(initialState)

  const mountedRef = useIsMountedRef()
  const { data, updateData } = props
  const feeAmount: FeeAmount = data.tier.toNumber()

  const handleAmountsChange = (amount0: BigNumber, amount1: BigNumber) => {
    updateData({ amount0, amount1 })
  }

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
  // prevent an error if they input ETH/WETH
  const quoteCurrency =
    baseCurrency && currencyB && baseCurrency.equals(currencyB)
      ? undefined
      : currencyB

  const {
    pool,
    ticks,
    dependentField,
    price,
    pricesAtTicks,
    parsedAmounts,
    currencyBalances,
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
  } = useV3DerivedMintInfo(
    state,
    baseCurrency ?? undefined,
    currencyB ?? undefined,
    feeAmount,
    baseCurrency ?? undefined,
    undefined
  )

  // get value and prices at ticks
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

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

  return (
    <div className={classes.root}>
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography className={classes.label}>Set price range</Typography>
            <div className={classes.rangeWrapper}>full range</div>
          </Grid>

          <Grid item xs={12} sm={6}>
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
                handleAmountsChange(amount1, ZERO)
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
        onClick={props.onNext}
        variant="contained"
      >
        Next
      </Button>
    </div>
  )
}
