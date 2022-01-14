import { Button, IconButton, makeStyles, Typography } from '@material-ui/core'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import { IRewardState, TokenBalanceInput } from 'components'
import { useConnectedWeb3Context } from 'contexts'
import { useIsMountedRef, useServices } from 'helpers'
import { RewardPeriodInput } from '../index'

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
  },
  description: {
    color: theme.colors.white,
    marginTop: 8,
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 12,
    color: theme.colors.white1,
  },
  content: { padding: '0 32px' },
  actions: {
    padding: 32,
  },
  deposit: {},
}))

interface IProps {
  onNext: () => void
  onClose: () => void
  rewardState: IRewardState
  updateState: (e: any) => void
}

export const InputSection = (props: IProps) => {
  const classes = useStyles()
  const { onNext, onClose, rewardState, updateState } = props
  const { account, library: provider, networkId } = useConnectedWeb3Context()
  const isMountedRef = useIsMountedRef()
  const { multicall } = useServices()

  const isDisabled =
    (() => {
      for (let index = 0; index < rewardState.amounts.length; index++) {
        if (rewardState.amounts[index].isZero()) {
          return true
        }
      }
      return false
    })() ||
    rewardState.period === '' ||
    Number(rewardState.period) === 0

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>
          Create a rewards program
        </Typography>
        <Typography className={classes.description}>
          Select a reward token and adjust the settings.
        </Typography>
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
      </div>
      <div className={classes.content}>
        {/* TODO: Add select token and update it to `rewardState.tokens` */}
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
      <div className={classes.actions}>
        <Button
          color="primary"
          variant="contained"
          fullWidth
          className={classes.deposit}
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
