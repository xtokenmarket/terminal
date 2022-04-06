import {
  Button,
  CircularProgress,
  makeStyles,
  Typography,
} from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    '&+&': {
      paddingTop: 32,
      '&::before': {
        position: 'absolute',
        top: -15,
        left: 15,
        width: 2,
        bottom: 32,
        backgroundColor: theme.colors.primary200,
        content: `""`,
      },
    },
  },
  step: {
    zIndex: 1,
    backgroundColor: theme.colors.primary500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    minWidth: 32,
    borderRadius: '50%',
    border: `1px solid ${theme.colors.primary200}`,
    color: theme.colors.primary200,
    '&.active': {
      color: theme.colors.white,
      borderColor: theme.colors.white,
    },
    marginRight: 16,
    fontSize: 15,
  },
  content: { flex: 1 },
  comment: {
    fontSize: 14,
    color: theme.colors.primary100,
    '&.active': { color: theme.colors.white },
  },
  titleWrapper: { display: 'flex', alignItems: 'center' },
  title: {
    fontSize: 22,
    fontWeight: 600,
    color: theme.colors.primary100,
    '&.active': { color: theme.colors.white },
    marginRight: 8,
  },
  button: {
    height: 48,
    minWidth: 132,
    '&.pending': {
      color: theme.colors.white,
    },
  },
  progress: { color: theme.colors.white },
  right: {},
}))

interface IProps {
  step: number
  comment: string
  title: string
  titleIcon?: React.ReactNode
  rightComponent?: React.ReactNode
  isActiveStep: boolean
  actionLabel: string
  actionDone: boolean
  actionPending: boolean
  onConfirm: () => Promise<void>
}

export const ActionStepRow = (props: IProps) => {
  const classes = useStyles()
  const {
    step,
    comment,
    title,
    titleIcon,
    isActiveStep,
    actionLabel,
    actionDone,
    actionPending,
    onConfirm,
    rightComponent,
  } = props

  return (
    <div className={clsx(classes.root)}>
      <div className={clsx(classes.step, isActiveStep && 'active')}>{step}</div>
      <div className={classes.content}>
        <Typography className={clsx(classes.comment, isActiveStep && 'active')}>
          {comment}
        </Typography>
        <div className={classes.titleWrapper}>
          <Typography className={clsx(classes.title, isActiveStep && 'active')}>
            {title}
          </Typography>
          {titleIcon ? titleIcon : null}
        </div>
      </div>
      {rightComponent ? (
        rightComponent
      ) : (
        <Button
          color="primary"
          disabled={!isActiveStep || actionPending || actionDone}
          variant="contained"
          className={clsx(
            classes.button,
            (actionPending || actionDone) && 'pending'
          )}
          onClick={onConfirm}
        >
          {actionPending ? 'Pending' : actionLabel}
          {actionPending && (
            <>
              &nbsp;
              <CircularProgress className={classes.progress} size={10} />
            </>
          )}
        </Button>
      )}
    </div>
  )
}
