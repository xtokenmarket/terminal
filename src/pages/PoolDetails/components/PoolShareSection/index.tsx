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
    fontWeight: 700,
    color: theme.colors.white,
    borderRadius: '16px',
    justifyContent: 'center',
    padding: '7px 13px',
    height: 28,
  },
}))

interface IProps {
  percent: string
}

export const PoolShareSection = (props: IProps) => {
  const classes = useStyles()

  const { percent } = props

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.percent}>
          {(Number(percent) * 100).toFixed(2)}%
        </div>
      </div>
    </div>
  )
}
