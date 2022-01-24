import { Button, IconButton, makeStyles, Typography } from '@material-ui/core'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import { IRewardState } from 'components'
import { RewardPeriodInput } from '../index'
import { RewardTokens } from '../RewardToken/RewardTokens'
import { FeeInfo } from '../FeeInfo'

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
  deposit: {
    marginTop: 16,
  },
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

  const { duration, errors, vesting, tokens } = rewardState

  const isDisabled = (() => {
    if (tokens.length === 0) return true
    const hasDuration = duration !== '' || Number(duration) !== 0
    const hasVesting = vesting !== '' || Number(vesting) !== 0
    if (!hasDuration || !hasVesting) return true

    return errors.some((error) => !!error)
  })()

  return (
    <div className={cl.root}>
      <div className={cl.header}>
        <Typography className={cl.title}>Create a rewards program</Typography>
        <Typography className={cl.description}>
          Select a reward token and adjust the settings.
        </Typography>
        <IconButton className={cl.closeButton} onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
      </div>
      <div className={cl.content}>
        <RewardPeriodInput
          label={'Rewards period'}
          value={rewardState.duration}
          onChange={(newValue) =>
            updateState({
              duration: newValue,
            })
          }
        />
        <RewardPeriodInput
          label={'Vesting period'}
          value={rewardState.vesting}
          onChange={(newValue) =>
            updateState({
              vesting: newValue,
            })
          }
        />
        <RewardTokens rewardState={rewardState} updateState={updateState} />
      </div>
      <div className={cl.actions}>
        <FeeInfo />
        <Button
          color="primary"
          variant="contained"
          fullWidth
          className={cl.deposit}
          onClick={onNext}
          disabled={isDisabled}
        >
          CREATE REWARDS
        </Button>
      </div>
    </div>
  )
}
