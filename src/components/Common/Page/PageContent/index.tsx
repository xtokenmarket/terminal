import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      margin: 16,
      backgroundColor: theme.colors.primary500,
      padding: 16,
    },
  },
}))

interface IProps {
  children?: React.ReactNode | React.ReactNode[]
}

export const PageContent = (props: IProps) => {
  const classes = useStyles()

  return <div className={classes.root}>{props.children}</div>
}
