import { BigNumber } from '@ethersproject/bignumber'
import { Button, IconButton, makeStyles, Typography } from '@material-ui/core'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import Abi from 'abis'
import { LPTokenAmountInput } from 'components'
import { LP_TOKEN_BASIC } from 'config/constants'
import { useConnectedWeb3Context } from 'contexts'
import { useIsMountedRef, useServices } from 'helpers'
import { IWithdrawState } from 'pages/PoolDetails/components'
import { useEffect } from 'react'
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
  const { account, library: provider } = useConnectedWeb3Context()
  const isMountedRef = useIsMountedRef()
  const { multicall } = useServices()

  const loadBasicInfo = async () => {
    if (!account || !provider) {
      return
    }
    try {
      const earnedCall = poolData.rewardState.tokens.map((rewardToken) => ({
        name: 'earned',
        address: poolData.address,
        params: [account, rewardToken.address],
      }))
      const earned = await multicall.multicallv2(Abi.xAssetCLR, earnedCall, {
        requireSuccess: false,
      })
      if (isMountedRef.current) {
        updateState({
          earned: earned.map((res: any) => res[0]),
          userLP: poolData.user.stakedTokenBalance,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadBasicInfo()
  }, [])

  const loadEstimations = async (amount: BigNumber) => {
    try {
      const token0Deposit = amount
        .mul(poolData.user.token0Deposit)
        .div(poolData.totalSupply)
      const token1Deposit = amount
        .mul(poolData.user.token1Deposit)
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
    withdrawState.lpInput.gt(withdrawState.userLP)

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
            max={withdrawState.userLP}
          />
        </div>
      </div>
      <OutputEstimation
        poolData={poolData}
        amount0={withdrawState.amount0Estimation}
        amount1={withdrawState.amount1Estimation}
        earned={withdrawState.earned}
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
