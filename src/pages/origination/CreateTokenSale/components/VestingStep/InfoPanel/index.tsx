import clsx from 'clsx'
import { makeStyles, Typography } from '@material-ui/core'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'

const useStyles = makeStyles((theme) => ({
  panelContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: 16,
    backgroundColor: theme.colors.primary200,
    border: `2px solid ${theme.colors.primary100}`,
    borderRadius: 4,
    color: theme.colors.white,
  },
  title: {
    fontWeight: 700,
    lineHeight: '19.2px',
    marginBottom: 3,
  },
  description: {
    fontSize: 14,
    lineHeight: '16.8px',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 27,
  },
}))

interface IInfoPanel {
  title?: string
  description: string
  className?: string
}

export const InfoPanel = ({ title, description, className }: IInfoPanel) => {
  const classes = useStyles()

  return (
    <div className={clsx(classes.panelContainer, className)}>
      <div className={classes.icon}>
        <InfoOutlinedIcon />
      </div>
      <div>
        {title && <Typography className={classes.title}>{title}</Typography>}
        <Typography className={classes.description}>{description}</Typography>
      </div>
    </div>
  )
}
