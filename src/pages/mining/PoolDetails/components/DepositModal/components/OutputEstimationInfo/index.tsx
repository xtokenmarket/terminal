import { makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { transparentize } from 'polished'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: transparentize(0.7, theme.colors.primary200),
    border: `2px solid ${theme.colors.primary200}`,
    padding: 16,
    borderRadius: 4,
    display: 'flex',
    [theme.breakpoints.down(theme.custom.xss)]: {
      flexDirection: 'column',
    },
  },
  icon: {
    color: theme.colors.white,
    width: 40,
    height: 40,
    minWidth: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary200,
    borderRadius: 4,
    marginRight: 16,
    transform: 'rotate(180deg)',
  },
  title: { color: theme.colors.white, fontWeight: 600 },
  description: { color: theme.colors.white, fontSize: 14 },
}))

interface IProps {
  className?: string
}

export const OutputEstimationInfo = (props: IProps) => {
  const classes = useStyles()

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.icon}>
        <InfoOutlinedIcon />
      </div>
      <div>
        <Typography className={classes.title}>Output is estimated</Typography>
        <Typography className={classes.description}>
          If the price changes by more than 1% your transaction will be
          reverted.
        </Typography>
      </div>
    </div>
  )
}
