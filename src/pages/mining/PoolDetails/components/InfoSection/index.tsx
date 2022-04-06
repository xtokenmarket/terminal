import { makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 16,
  },
  label: {
    color: theme.colors.primary100,
    fontSize: 10,
    fontWeight: 700,
  },
  value: { color: theme.colors.white, fontSize: 18, fontWeight: 700 },
  valueWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    '&>*+*': { marginLeft: 8 },
  },
}))

interface IProps {
  label: string
  value: string
  right?: React.ReactNode
}

export const InfoSection = (props: IProps) => {
  const classes = useStyles()
  const { label, value, right: RightComponent } = props

  return (
    <div className={classes.root}>
      <Typography className={classes.label}>{label}</Typography>
      <div className={classes.valueWrapper}>
        <Typography className={classes.value}>{value}</Typography>
        {RightComponent}
      </div>
    </div>
  )
}
