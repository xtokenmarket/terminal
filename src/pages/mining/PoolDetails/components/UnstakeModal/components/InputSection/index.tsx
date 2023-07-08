import { Button, IconButton, makeStyles, Typography } from '@material-ui/core'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import { LPTokenAmountInput } from 'components'
import { LP_TOKEN_BASIC } from 'config/constants'
import { ITerminalPool } from 'types'

import { OutputEstimation } from '../index'
import { IUnstakeState } from '../../index'
import { SingleAssetPoolService } from 'services/singleAssetPoolService'

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
  unstakeState: IUnstakeState
  updateState: (e: any) => void
  clrService: SingleAssetPoolService
  poolData: ITerminalPool
}

export const InputSection = (props: IProps) => {
  const classes = useStyles()
  const { onNext, onClose, unstakeState, updateState, poolData } = props

  const earned = poolData.earnedTokens.map((t) => t.amount)
  const isDisabled =
    unstakeState.lpInput.isZero() ||
    unstakeState.lpInput.gt(poolData.user.stakedTokenBalance)

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>Withdraw Liquidity</Typography>
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
        <div>
          <LPTokenAmountInput
            value={unstakeState.lpInput}
            onChange={(amount) => updateState({ lpInput: amount })}
            tokens={[poolData.token0]}
            lpToken={{ ...LP_TOKEN_BASIC, address: poolData.uniswapPool }}
            max={poolData.user.stakedTokenBalance}
          />
        </div>
      </div>
      <OutputEstimation
        poolData={poolData}
        amount0={unstakeState.lpInput}
        earned={earned}
      />
      <div className={classes.actions}>
        {poolData.poolOffersRewards && (
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
