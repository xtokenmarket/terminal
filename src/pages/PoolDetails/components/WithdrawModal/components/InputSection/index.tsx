import { BigNumber } from '@ethersproject/bignumber'
import { Button, IconButton, makeStyles, Typography } from '@material-ui/core'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import { LPTokenAmountInput } from 'components'
import { LP_TOKEN_BASIC } from 'config/constants'
import { IWithdrawState } from 'pages/PoolDetails/components'
import { ITerminalPool } from 'types'
import { OutputEstimation, WarningInfo } from '..'

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
  withdrawState: IWithdrawState
  updateState: (e: any) => void
  poolData: ITerminalPool
}

let timerId: any

export const InputSection = (props: IProps) => {
  const classes = useStyles()
  const { onNext, onClose, withdrawState, updateState, poolData } = props

  const earned = poolData.earnedTokens.map((t) => t.amount)

  const loadEstimations = async (amount: BigNumber) => {
    try {
      const token0Deposit = amount
        .mul(poolData.token0.balance as BigNumber)
        .div(poolData.totalSupply)
      const token1Deposit = amount
        .mul(poolData.token1.balance as BigNumber)
        .div(poolData.totalSupply)

      updateState({
        amount0Estimation: token0Deposit,
        amount1Estimation: token1Deposit,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleInputChange = (newLPValue: BigNumber) => {
    updateState({ lpInput: newLPValue })

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
        <WarningInfo
          title="Vesting on rewards"
          description="If this pool has a vesting period on rewards your rewards will be transferred to vesting contract and will be available to claim in the future."
        />
        <Button
          color="primary"
          variant="contained"
          fullWidth
          className={classes.deposit}
          onClick={() => {
            updateState({ withdrawOnly: false })
            onNext()
          }}
          disabled={isDisabled}
        >
          CLAIM & WITHDRAW
        </Button>
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
