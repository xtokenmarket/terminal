import { Button, makeStyles, Typography } from '@material-ui/core'
import { IRewardState } from 'components'
import { OutputEstimation } from '../index'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

const useStyles = makeStyles((theme) => ({
  root: { backgroundColor: theme.colors.primary500 },
  header: {
    padding: 32,
    position: 'relative',
    paddingBottom: 16,
    display: 'flex',
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
  arrowBackIosStyle: {
    color: theme.colors.white,
    cursor: 'pointer',
    marginTop: 5,
    marginRight: 20,
  },
}))

interface IProps {
  onNext: () => void
  rewardState: IRewardState
  updateState: (e: any) => void
  goBack: () => void
}

export const ConfirmSection = (props: IProps) => {
  const classes = useStyles()

  const { onNext, rewardState, goBack } = props

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <ArrowBackIosIcon
          className={classes.arrowBackIosStyle}
          onClick={goBack}
        />
        <div>
          <Typography className={classes.title}>
            Confirm rewards data
          </Typography>
          <Typography className={classes.description}>
            Please confirm rewards data to proceed with rewards initialization
            process.
          </Typography>
        </div>
      </div>
      <OutputEstimation
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
