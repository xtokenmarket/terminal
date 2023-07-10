import { Button, IconButton, makeStyles, Typography } from '@material-ui/core'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import { TokenBalanceInput } from 'components'
import { WarningInfo } from 'components/Common/WarningInfo'
import { useTokenBalance } from 'helpers'
import { ITerminalPool } from 'types'
import { useEffect } from 'react'
import _ from 'lodash'

import { OutputEstimation, OutputEstimationInfo } from '../index'
import { IStakeState } from '../../index'
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
  depositState: IStakeState
  updateState: (e: any) => void
  clrService: SingleAssetPoolService
  poolData: ITerminalPool
}

export const InputSection = (props: IProps) => {
  const classes = useStyles()
  const { onNext, onClose, depositState, updateState, poolData } = props

  const { balance: tokenBalance } = useTokenBalance(poolData.token0.address)

  useEffect(() => {
    const newErrors: string[] = []
    if (depositState.amount.gt(tokenBalance)) {
      newErrors.push(`${poolData.token0.symbol} input exceeds balance`)
    }

    if (!_.isEqual(depositState.errorMessage, newErrors)) {
      updateState({
        ...depositState,
        errorMessage: newErrors,
      })
    }
  }, [tokenBalance, depositState])

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>Deposit Liquidity</Typography>
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
        <div>
          <TokenBalanceInput
            value={depositState.amount}
            onChange={(amount) => updateState({ amount })}
            token={poolData.token0}
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
        isEstimation={false}
        amount={depositState.amount}
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
            depositState.amount.isZero() || depositState.amount.gt(tokenBalance)
          }
        >
          DEPOSIT
        </Button>
      </div>
    </div>
  )
}
