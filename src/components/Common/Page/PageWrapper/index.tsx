import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.primary500,
    borderRadius: 4,
    padding: theme.spacing(0, 4),
    [theme.breakpoints.down('xs')]: {
      backgroundColor: theme.colors.transparent,
      padding: 0,
    },
  },
}))

interface IProps {
  className?: string
}

export const PageWrapper = ({
  className,
  children,
}: React.PropsWithChildren<IProps>) => {
  const classes = useStyles()

  return <div className={clsx(classes.root, className)}>{children}</div>
}
