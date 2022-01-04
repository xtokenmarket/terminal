import { Button, makeStyles, Typography } from '@material-ui/core'
import { IRewardState } from 'pages/PoolDetails/components'
import { ITerminalPool } from 'types'
import { WarningInfo, OutputEstimation } from '..'

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
    marginBottom: 8,
  },
  description: {
    marginBottom: 24,
    color: theme.colors.white,
  },
  content: {
    padding: 32,
  },
  warning: {
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
  actions: {},
  tokenIcon: {
    width: 24,
    height: 24,
    borderRadius: '50%',
  },
}))

interface IProps {
  onNext: () => void
  rewardState: IRewardState
  poolData: ITerminalPool
  updateState: (e: any) => void
}

export const ConfirmSection = (props: IProps) => {
  const classes = useStyles()

  const { onNext, rewardState, poolData } = props

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>Confirm rewards data</Typography>
        <Typography className={classes.description}>
          Please confirm rewards data to proceed with rewards initialization
          process.
        </Typography>
      </div>
      <OutputEstimation
        poolData={poolData}
        rewardState={rewardState}
        amounts={rewardState.amounts}
      />
      <div className={classes.content}>
        <div className={classes.actions}>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={onNext}
          >
            CONFIRM
          </Button>
        </div>
      </div>
    </div>
  )
}
