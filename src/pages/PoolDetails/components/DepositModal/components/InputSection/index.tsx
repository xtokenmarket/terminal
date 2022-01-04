import { BigNumber } from '@ethersproject/bignumber'
import { Button, IconButton, makeStyles, Typography } from '@material-ui/core'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import { TokenBalanceInput } from 'components'
import { DefaultReadonlyProvider } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { useIsMountedRef, useTokenBalance } from 'helpers'
import { IDepositState } from 'pages/PoolDetails/components'
import { xAssetCLRService } from 'services'
import { ITerminalPool } from 'types'
import { ZERO } from 'utils/number'
import { OutputEstimation, OutputEstimationInfo } from '..'

const useStyles = makeStyles((theme) => ({
  root: { backgroundColor: theme.colors.primary500 },
  header: {
    padding: 32,
    position: 'relative',
    paddingBottom: 16,
  },
  title: {
    color: theme.colors.white,
    fontWeight: 600,
    fontSize: 22,
    marginBottom: 24,
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 12,
    color: theme.colors.white1,
  },

  actions: {
    padding: 32,
  },

  deposit: { marginTop: 32 },
  buy: { marginTop: 8 },
}))

interface IProps {
  onNext: () => void
  onClose: () => void
  depositState: IDepositState
  updateState: (e: any) => void
  poolData: ITerminalPool
}

let timer: any = undefined

export const InputSection = (props: IProps) => {
  const classes = useStyles()
  const { onNext, onClose, depositState, updateState, poolData } = props
  const { account, library: provider, networkId } = useConnectedWeb3Context()
  const isMountedRef = useIsMountedRef()
  const { balance: balance0 } = useTokenBalance(poolData.token0.address)
  const { balance: balance1 } = useTokenBalance(poolData.token1.address)

  const loadEstimations = async (amount0: BigNumber, amount1: BigNumber) => {
    try {
      if (amount0.isZero() && amount1.isZero()) {
        updateState({
          amount0Estimation: ZERO,
          amount1Estimation: ZERO,
          lpEstimation: ZERO,
          totalLiquidity: ZERO,
        })
        return
      }
      const xAssetCLR = new xAssetCLRService(
        provider || DefaultReadonlyProvider,
        account,
        poolData.address
      )
      const [amount0Estimation, amount1Estimation] =
        await xAssetCLR.calculateAmountsMintedSingleToken(
          amount0.isZero() ? 1 : 0,
          amount0.isZero() ? amount1 : amount0
        )
      const [lpEstimation, totalLiquidity] = await Promise.all([
        xAssetCLR.getLiquidityForAmounts(amount0Estimation, amount1Estimation),
        xAssetCLR.getTotalLiquidity(),
      ])
      if (isMountedRef.current === true) {
        updateState({
          amount0Estimation,
          amount1Estimation,
          lpEstimation,
          totalLiquidity,
        })
      }
    } catch (error) {
      if (isMountedRef.current === true)
        updateState({
          amount0Estimation: ZERO,
          amount1Estimation: ZERO,
          lpEstimation: ZERO,
          totalLiquidity: ZERO,
        })
    }
  }

  const handleAmountsChange = (amount0: BigNumber, amount1: BigNumber) => {
    updateState({ amount0, amount1 })
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      loadEstimations(amount0, amount1)
    }, 1000)
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>Deposit Liquidity</Typography>
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
        <div>
          <TokenBalanceInput
            value={depositState.amount0}
            onChange={(amount0) => {
              handleAmountsChange(amount0, ZERO)
            }}
            token={poolData.token0}
          />
          <TokenBalanceInput
            value={depositState.amount1}
            onChange={(amount1) => {
              handleAmountsChange(ZERO, amount1)
            }}
            token={poolData.token1}
          />
        </div>
      </div>
      <OutputEstimation
        poolData={poolData}
        amount0={depositState.amount0Estimation}
        amount1={depositState.amount1Estimation}
        lpValue={depositState.lpEstimation}
        totalLiquidity={depositState.totalLiquidity}
      />
      <div className={classes.actions}>
        <OutputEstimationInfo />
        <Button
          color="primary"
          variant="contained"
          fullWidth
          className={classes.deposit}
          onClick={onNext}
          disabled={
            (depositState.amount0.isZero() && depositState.amount1.isZero()) ||
            depositState.amount0.gt(balance0) ||
            depositState.amount1.gt(balance1)
          }
        >
          DEPOSIT
        </Button>
        <Button
          color="secondary"
          variant="contained"
          fullWidth
          className={classes.buy}
        >
          BUY
        </Button>
      </div>
    </div>
  )
}
