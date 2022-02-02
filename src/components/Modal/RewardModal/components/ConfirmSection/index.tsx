import { Button, makeStyles, Typography, IconButton } from '@material-ui/core'
import { IRewardState } from 'components'
import { OutputEstimation } from '../index'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'

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
}))

interface IProps {
  isCreatePool: boolean
  onNext: () => void
  rewardState: IRewardState
  updateState: (e: any) => void
  goBack: () => void
  onClose: () => void
}

export const ConfirmSection = (props: IProps) => {
  const classes = useStyles()

  const { isCreatePool, onNext, rewardState, goBack, onClose } = props

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
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
      </div>
      <OutputEstimation isCreatePool={isCreatePool} rewardState={rewardState} />
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
