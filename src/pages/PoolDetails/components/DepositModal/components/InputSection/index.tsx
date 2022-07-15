import { BigNumber } from '@ethersproject/bignumber'
import { Button, IconButton, makeStyles, Typography } from '@material-ui/core'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import { TokenBalanceInput } from 'components'
import { WarningInfo } from 'components/Common/WarningInfo'
import { useIsMountedRef, useTokenBalance } from 'helpers'
import { IDepositState } from 'pages/PoolDetails/components'
import { CLRService } from 'services'
import { ITerminalPool } from 'types'
import { ZERO } from 'utils/number'
import { useEffect, useState } from 'react'
import _ from 'lodash'
import { Network } from 'utils/enums'

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
  onNext: () => void
  onClose: () => void
  depositState: IDepositState
  updateState: (e: any) => void
  clrService: CLRService
  poolData: ITerminalPool
}

export const InputSection = (props: IProps) => {
  const classes = useStyles()
  const { onNext, onClose, depositState, updateState, clrService, poolData } =
    props
  const isMountedRef = useIsMountedRef()

  const { balance: balance0 } = useTokenBalance(poolData.token0.address)
  const { balance: balance1 } = useTokenBalance(poolData.token1.address)

  const [state, setState] = useState({
    isAmount0Estimating: false,
    isAmount1Estimating: false,
  })

  const resetLoading = () => {
    setState((prev) => ({
      ...prev,
      isAmount0Estimating: false,
      isAmount1Estimating: false,
    }))
  }

  const loadEstimations = async (amount0: BigNumber, amount1: BigNumber) => {
    try {
      if (amount0.isZero() && amount1.isZero()) {
        updateState({
          amount0Estimation: ZERO,
          amount1Estimation: ZERO,
          lpEstimation: ZERO,
        })
        return
      }

      const [amount0Estimation, amount1Estimation] =
        await clrService.calculateAmountsMintedSingleToken(
          amount0.isZero() ? 1 : 0,
          amount0.isZero() ? amount1 : amount0
        )
      if (isMountedRef.current === true) {
        updateState({
          amount0Estimation,
          amount1Estimation,
        })
      }
      if (amount0.isZero()) {
        updateState({
          amount0: amount0Estimation,
        })
      } else {
        updateState({
          amount1: amount1Estimation,
        })
      }
      resetLoading()
    } catch (error) {
      if (isMountedRef.current === true)
        updateState({
          amount0Estimation: ZERO,
          amount1Estimation: ZERO,
        })
      resetLoading()
    }
  }

  const handleAmountsChange = (amount0: BigNumber, amount1: BigNumber) => {
    if (amount0.isZero() && amount1.isZero()) {
      updateState({ amount0, amount1 })
    } else if (amount0.isZero()) {
      updateState({ amount1 })
    } else {
      updateState({ amount0 })
    }

    loadEstimations(amount0, amount1)
  }

  useEffect(() => {
    const newErrors: string[] = []
    const newErrorA = `${poolData.token0.symbol} input exceeds balance`
    const newErrorB = `${poolData.token1.symbol} input exceeds balance`
    if (depositState.amount0.gt(balance0)) {
      newErrors.push(newErrorA)
    }

    if (depositState.amount1.gt(balance1)) {
      newErrors.push(newErrorB)
    }

    if (!_.isEqual(depositState.errorMessage, newErrors)) {
      updateState({
        ...depositState,
        errorMessage: newErrors,
      })
    }
  }, [balance0, balance1, depositState])

  // TODO: Remove the disable check after PONY pool upgrade
  const PONY_LP_ADDRESS = '0x11AE2b89175792F57D320a020eaEa879E837fe6c'
  const isPonyLP =
    poolData.network === Network.MAINNET &&
    poolData.address.toLowerCase() === PONY_LP_ADDRESS.toLowerCase()

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>Deposit Liquidity</Typography>
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
        <div>
          <TokenBalanceInput
            isDisabled={isPonyLP}
            value={depositState.amount0}
            onChange={(amount0) => {
              handleAmountsChange(amount0, ZERO)
            }}
            token={poolData.token0}
            loading={state.isAmount0Estimating}
            setLoadingStart={() =>
              setState((prev) => ({ ...prev, isAmount1Estimating: true }))
            }
          />
          <TokenBalanceInput
            value={depositState.amount1}
            onChange={(amount1) => {
              handleAmountsChange(ZERO, amount1)
            }}
            token={poolData.token1}
            loading={state.isAmount1Estimating}
            setLoadingStart={() =>
              setState((prev) => ({ ...prev, isAmount0Estimating: true }))
            }
          />
        </div>
        {depositState.errorMessage.some((x) => x) && (
          <WarningInfo
            className={classes.warning}
            title="Warning"
            description={depositState.errorMessage.join('; ')}
          />
        )}
      </div>
      <OutputEstimation
        poolData={poolData}
        amount0={depositState.amount0Estimation}
        amount1={depositState.amount1Estimation}
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
      </div>
    </div>
  )
}
