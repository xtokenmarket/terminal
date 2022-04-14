import React from 'react'
import clsx from 'clsx'
import { makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  desc: {
    color: theme.colors.primary100,
    fontSize: 12,
    lineHeight: '14.4px',
    width: 'fit-content',
  },
  descriptionUnderline: {
    marginTop: 2,
    height: 1,
    backgroundColor: theme.colors.primary200,
  },
}))

interface IInputDescription {
  className?: string
  underlined?: boolean
}

export const InputDescription = ({
  className,
  underlined = true,
  children,
}: React.PropsWithChildren<IInputDescription>) => {
  const classes = useStyles()

  return (
    <Typography className={clsx(classes.desc, className)}>
      {children}
      {underlined && <div className={classes.descriptionUnderline} />}
    </Typography>
  )
}
