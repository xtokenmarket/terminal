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
  isCreatePool: boolean
  onNext: () => void
  onClose: () => void
  rewardState: IRewardState
  updateState: (e: any) => void
}

export const InputSection: React.FC<IProps> = ({
  isCreatePool,
  onNext,
  onClose,
  rewardState,
  updateState,
}) => {
  const cl = useStyles()

  const { duration, errors, tokens } = rewardState
  const isDurationInvalid =
    !isCreatePool && (duration === '' || Number(duration) === 0)
  const isDisabled =
    tokens.length === 0 || errors.some((error) => !!error) || isDurationInvalid

  return (
    <div className={cl.root}>
      <div className={cl.header}>
        <Typography className={cl.title}>
          {isCreatePool ? 'Create a' : 'Initiate'} rewards program
        </Typography>
        <Typography className={cl.description}>
          {isCreatePool
            ? 'Select rewards token(s) and set vesting period'
            : 'Configure rewards period and token amounts'}
        </Typography>
        <IconButton className={cl.closeButton} onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
      </div>
      <div className={cl.content}>
        {!isCreatePool && (
          <RewardPeriodInput
            label={'Rewards period'}
            value={rewardState.duration}
            onChange={(newValue) =>
              updateState({
                duration: newValue,
              })
            }
          />
        )}
        <RewardPeriodInput
          isDisabled={!isCreatePool}
          label={'Vesting period'}
          value={rewardState.vesting}
          isVesting
          onChange={(newValue) =>
            updateState({
              vesting: newValue,
            })
          }
        />
        <RewardTokens
          isCreatePool={isCreatePool}
          rewardState={rewardState}
          updateState={updateState}
        />
      </div>
      <div className={cl.actions}>
        {!isCreatePool && <FeeInfo />}
        <Button
          color="primary"
          variant="contained"
          fullWidth
          className={cl.deposit}
          onClick={onNext}
          disabled={isDisabled}
        >
          {isCreatePool ? 'CONFIRM REWARDS CONFIGURATION' : 'INITIATE REWARDS'}
        </Button>
      </div>
    </div>
  )
}
