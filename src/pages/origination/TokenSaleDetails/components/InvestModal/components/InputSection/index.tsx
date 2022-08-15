import { makeStyles, Typography, IconButton, Button } from '@material-ui/core'
import { useConnectedWeb3Context } from 'contexts'
import { useEffect, useReducer } from 'react'
import { FungiblePoolService } from 'services'
import { IUserPosition, IOfferingOverview, IWhitelistSale } from 'types'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import { TokenBalanceInput } from 'components'
import { ZERO } from 'utils/number'
import { BigNumber } from 'ethers'
import { useTokenBalance } from 'helpers'
import { formatBigNumber, numberWithCommas } from 'utils'

const useStyles = makeStyles((theme) => ({
  root: {},
  header: {
    padding: 32,
    position: 'relative',
    paddingBottom: 16,
    display: 'flex',
    backgroundColor: theme.colors.primary500,
  },
  title: {
    color: theme.colors.white,
    fontWeight: 600,
    fontSize: 22,
    marginBottom: 8,
  },
  content: {
    padding: 32,
    paddingTop: 2,
    backgroundColor: theme.colors.primary400,
    width: 600,
    maxWidth: '90vw',
    minHeight: '20vh',
    maxHeight: '50vh',
  },
  actions: {
    marginTop: 32,
  },
  tokenIcon: {
    width: 24,
    height: 24,
    borderRadius: '50%',
  },
  closeButton: {
    padding: 0,
    color: theme.colors.white1,
    position: 'absolute',
    right: 24,
    top: 36,
    [theme.breakpoints.down('xs')]: {
      top: 12,
      right: 12,
    },
  },
  initiateBtn: {
    marginTop: 32,
  },
  progress: { color: theme.colors.white },
  warning: {
    width: '100%',
    color: theme.colors.warn,
    fontSize: '14px',
    marginTop: '10px',
  },
}))

interface IProps {
  onClose: () => void
  onNext: () => void
  offerData: IOfferingOverview
  updateState: (e: any) => void
  whitelistData: IWhitelistSale
  userPositionData: IUserPosition
  isWhitelist: boolean
}

interface IState {
  isEstimating: boolean
  offerAmount: BigNumber
  purchaseAmount: BigNumber
  errorMessage: string
  maxLimit: BigNumber
}

export const InputSection = (props: IProps) => {
  const classes = useStyles()
  const { account, library: provider } = useConnectedWeb3Context()
  const { offerData, onClose, onNext, updateState } = props
  const { balance, isLoading } = useTokenBalance(
    offerData.purchaseToken.address || ''
  )

  const [state, setState] = useReducer(
    (prevState: IState, newState: Partial<IState>) => ({
      ...prevState,
      ...newState,
    }),
    {
      isEstimating: false,
      offerAmount: ZERO,
      purchaseAmount: ZERO,
      errorMessage: '',
      maxLimit: ZERO,
    }
  )

  useEffect(() => {
    const getMaxLimit = async () => {
      const availableAmount = props.offerData.totalOfferingAmount.sub(
        props.offerData.offerTokenAmountSold
      )

      const fungiblePool = new FungiblePoolService(
        provider,
        account,
        offerData.poolAddress
      )

      let maxLimit
      try {
        maxLimit = await fungiblePool.getPurchaseAmountFromOfferAmount(
          availableAmount
        )
      } catch (error) {
        console.error('getPurchaseAmountFromOfferAmount error', error)
      }
      setState({ maxLimit })
    }

    getMaxLimit()
  }, [])

  useEffect(() => {
    const isInsufficientBalance = state.purchaseAmount.gt(balance) && !isLoading

    const maxLimit = props.isWhitelist
      ? props.whitelistData.addressCap.gt(state.maxLimit)
        ? state.maxLimit
        : props.whitelistData.addressCap
      : state.maxLimit
    const isInvalidAmount = state.purchaseAmount.gt(maxLimit)

    if (isInsufficientBalance) {
      setState({ errorMessage: 'Insufficient balance.' })
      return
    }

    if (isInvalidAmount) {
      setState({
        errorMessage: `Maximum contribution is ${numberWithCommas(
          formatBigNumber(maxLimit, props.offerData.purchaseToken.decimals)
        )} ${offerData.purchaseToken.symbol}`,
      })
      return
    }

    setState({ errorMessage: '' })
  }, [balance, state.offerAmount, state.purchaseAmount])

  const estimateOfferAmount = async (purchaseAmount: BigNumber) => {
    if (!account || !provider) {
      return
    }

    const fungiblePool = new FungiblePoolService(
      provider,
      account,
      offerData.poolAddress
    )

    const offerAmount = await fungiblePool.getCurrentMintAmount(purchaseAmount)
    setState({
      isEstimating: false,
      offerAmount,
      purchaseAmount,
    })
  }

  const _onInvest = () => {
    updateState({
      offerAmount: state.offerAmount,
      purchaseAmount: state.purchaseAmount,
    })
    onNext()
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>Invest</Typography>
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
      </div>
      <div className={classes.content}>
        <div>
          <TokenBalanceInput
            label={'Amount to Invest'}
            onChange={estimateOfferAmount}
            setLoadingStart={() => setState({ isEstimating: true })}
            showSwapCTA={false}
            token={offerData.purchaseToken}
            value={state.purchaseAmount}
          />
          <TokenBalanceInput
            isDisabled
            label={'Estimated Amount to Receive'}
            loading={state.isEstimating}
            onChange={() => undefined}
            showAvailableBalance={false}
            showSwapCTA={false}
            token={offerData.offerToken}
            value={state.offerAmount}
          />
        </div>
        <div className={classes.actions}>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            className={classes.initiateBtn}
            onClick={_onInvest}
            disabled={
              state.offerAmount.isZero() ||
              state.purchaseAmount.isZero() ||
              !!state.errorMessage
            }
          >
            INVEST
          </Button>
          {state.errorMessage && (
            <div className={classes.warning}>{state.errorMessage}</div>
          )}
        </div>
      </div>
    </div>
  )
}
