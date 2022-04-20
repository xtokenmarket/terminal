import { makeStyles } from '@material-ui/core'
import { Tabs } from './components'

const useStyles = makeStyles((theme) => ({
  root: {},
  tabs: {
    height: 48,
  },
  content: {
    backgroundColor: theme.colors.primary500,
    borderRadius: 4,
    padding: 24,
    [theme.breakpoints.down('xs')]: {
      backgroundColor: theme.colors.primary700,
    },
  },
}))

interface IProps {
  children?: React.ReactNode[] | React.ReactNode
}

export const OriginationLayout = (props: IProps) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.tabs}>
        <Tabs />
      </div>
      <div className={classes.content}>{props.children}</div>
    </div>
  )
}
