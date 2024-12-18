import { BigNumber } from '@ethersproject/bignumber'
import { Button, IconButton, makeStyles, Typography } from '@material-ui/core'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import { LPTokenAmountInput } from 'components'
import { parseUnits } from 'ethers/lib/utils'
import { ETHER_DECIMAL, LP_TOKEN_BASIC } from 'config/constants'
import { ITerminalPool, PoolService } from 'types'
import { formatBigNumber } from 'utils'

import { OutputEstimation } from '../index'
import { IWithdrawState } from '../../index'

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

  buy: { marginTop: 8 },
}))

interface IProps {
  onNext: () => void
  onClose: () => void
  withdrawState: IWithdrawState
  updateState: (e: any) => void
  clrService: PoolService
  poolData: ITerminalPool
}

let timerId: any

export const InputSection = (props: IProps) => {
  const classes = useStyles()
  const { onNext, onClose, withdrawState, updateState, clrService, poolData } =
    props

  const earned = poolData.earnedTokens.map((t) => t.amount)

  const loadEstimations = async (amount: BigNumber) => {
    try {
      let amount0Estimation
      let amount1Estimation

      if (clrService.version === 'v1.0.0') {
        const { token0, token1, totalSupply } = poolData

        amount0Estimation = amount
          .mul(token0.balance as BigNumber)
          .div(totalSupply)
        amount1Estimation = amount
          .mul(token1.balance as BigNumber)
          .div(totalSupply)

        if (token0.decimals !== ETHER_DECIMAL) {
          amount0Estimation = parseUnits(
            formatBigNumber(amount0Estimation, ETHER_DECIMAL, 4),
            token0.decimals
          )
        }

        if (token1.decimals !== ETHER_DECIMAL) {
          amount1Estimation = parseUnits(
            formatBigNumber(amount1Estimation, ETHER_DECIMAL, 4),
            token1.decimals
          )
        }
      } else {
        const { amount0, amount1 } = await clrService.calculateWithdrawAmounts(
          amount
        )
        amount0Estimation = amount0
        amount1Estimation = amount1
      }

      updateState({
        amount0Estimation,
        amount1Estimation,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleInputChange = (newLPValue: BigNumber) => {
    updateState({ lpInput: newLPValue })

    // TODO: Replace with `useDebounce` hook
    if (timerId) {
      clearTimeout(timerId)
    }

    timerId = setTimeout(() => {
      loadEstimations(newLPValue)
    }, 800)
  }

  const isDisabled =
    withdrawState.lpInput.isZero() ||
    withdrawState.lpInput.gt(poolData.user.stakedTokenBalance)

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>Withdraw Liquidity</Typography>
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
        <div>
          <LPTokenAmountInput
            value={withdrawState.lpInput}
            onChange={(amount) => {
              handleInputChange(amount)
            }}
            tokens={[poolData.token0, poolData.token1]}
            lpToken={{ ...LP_TOKEN_BASIC, address: poolData.uniswapPool }}
            max={poolData.user.stakedTokenBalance}
          />
        </div>
      </div>
      <OutputEstimation
        poolData={poolData}
        amount0={withdrawState.amount0Estimation}
        amount1={withdrawState.amount1Estimation}
        earned={earned}
      />
      <div className={classes.actions}>
        {poolData.isReward && (
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => {
              updateState({ withdrawOnly: false })
              onNext()
            }}
            disabled={isDisabled}
          >
            CLAIM & WITHDRAW
          </Button>
        )}
        <Button
          color="secondary"
          variant="contained"
          fullWidth
          className={classes.buy}
          disabled={isDisabled}
          onClick={() => {
            updateState({ withdrawOnly: true })
            onNext()
          }}
        >
          WITHDRAW
        </Button>
      </div>
    </div>
  )
}
