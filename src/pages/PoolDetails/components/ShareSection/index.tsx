import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 16,
    [theme.breakpoints.down('xs')]: {
      padding: 8,
    },
  },
  label: {
    color: theme.colors.primary100,
    fontSize: 10,
  },
  content: {
    display: 'flex',
    alignItems: 'center',
  },

  percent: {
    background: theme.colors.primary200,
    fontSize: 12,
    color: theme.colors.white,
    borderRadius: '16px',
    justifyContent: 'center',
    padding: '0 13px',
    marginLeft: 16,
  },
}))

interface IProps {
  percent: string
}

export const ShareSection = (props: IProps) => {
  const classes = useStyles()

  const { percent } = props

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.percent}>{Number(percent).toFixed(2)}%</div>
      </div>
    </div>
  )
}
