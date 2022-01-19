import { useState } from 'react'
import { Button, IconButton, makeStyles, Typography } from '@material-ui/core'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import { IRewardState, TokenBalanceInput, TokenSelect } from 'components'
import { useConnectedWeb3Context } from 'contexts'
import { useIsMountedRef, useServices } from 'helpers'
import { RewardPeriodInput } from '../index'
import { IToken } from 'types'

const useStyles = makeStyles((theme) => ({
  root: { backgroundColor: theme.colors.primary500 },
  header: {
    position: 'relative',
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2, 5, 2, 2),
    },
  },
  title: {
    color: theme.colors.white,
    fontWeight: 600,
    fontSize: 22,
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
    },
  },
  description: {
    color: theme.colors.white,
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
    },
  },
  closeButton: {
    padding: 0,
    color: theme.colors.white1,
    position: 'absolute',
    right: 24,
    top: 24,
    [theme.breakpoints.down('xs')]: {
      top: 12,
      right: 12,
    },
  },
  content: {
    padding: theme.spacing(0, 3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
    },
  },
  actions: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
  deposit: {},
}))

interface IProps {
  onNext: () => void
  onClose: () => void
  rewardState: IRewardState
  updateState: (e: any) => void
}

export const InputSection: React.FC<IProps> = ({
  onNext,
  onClose,
  rewardState,
  updateState,
}) => {
  const cl = useStyles()
  const { account, library: provider, networkId } = useConnectedWeb3Context()
  const isMountedRef = useIsMountedRef()
  const { multicall } = useServices()

  const { period, amounts, tokens } = rewardState
  const isDisabled = (
    amounts.some(amount => amount.isZero()) ||
    period === '' ||
    Number(period) === 0
  )

  const [activeTokenIndex, setActiveTokenIndex] = useState(0)
  const activeToken = tokens[activeTokenIndex]
  // const activeAmount = amounts[activeTokenIndex]

  const onSelectToken = (token: IToken) => {
    const newTokens = tokens
    newTokens.splice(activeTokenIndex, 1, token)
    updateState({ tokens: newTokens })
  }

  return (
    <div className={cl.root}>
      <div className={cl.header}>
        <Typography className={cl.title}>
          Create a rewards program
        </Typography>
        <Typography className={cl.description}>
          Select a reward token and adjust the settings.
        </Typography>
        <IconButton className={cl.closeButton} onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
      </div>
      <div className={cl.content}>
        <TokenSelect
          onChange={onSelectToken}
          token={activeToken}
        />
        <RewardPeriodInput
          value={rewardState.period}
          onChange={(newValue) =>
            updateState({
              period: newValue,
            })
          }
        />
        {/* TODO: Re-enable `TokenBalanceInput`, after user selects token */}
        {/*<TokenBalanceInput
          token={rewardState}
          value={rewardState.amounts[index]}
          onChange={(newValue) => {
            updateState({
              amounts: rewardState.amounts.map((e, ind) =>
                ind === index ? newValue : e
              ),
            })
          }}
        />*/}
      </div>
      <div className={cl.actions}>
        <Button
          color="primary"
          variant="contained"
          fullWidth
          className={cl.deposit}
          onClick={() => {
            onNext()
          }}
          disabled={isDisabled}
        >
          INITIALIZE
        </Button>
      </div>
    </div>
  )
}
