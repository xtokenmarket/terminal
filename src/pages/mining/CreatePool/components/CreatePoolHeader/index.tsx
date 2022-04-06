import { useState } from 'react'
import { Stepper, Step, makeStyles, Grid, Typography } from '@material-ui/core'
import { ECreatePoolStep } from 'utils/enums'
import clsx from 'clsx'

import { CreatePoolStepper } from './CreatePoolStepper'

const useStyles = makeStyles((theme) => ({
  headerTop: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    background: theme.colors.primary500,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      justifyContent: 'center',
      padding: theme.spacing(3, 0),
      margin: theme.spacing(2),
    },
  },
  title: {
    fontSize: 18,
    color: theme.colors.white,
    fontWeight: 700,
  },
  cancel: {
    color: theme.colors.primary100,
    fontWeight: 600,
    cursor: 'pointer',
  },
}))

interface IProps {
  step: ECreatePoolStep
  onCancel: () => void
}

export const CreatePoolHeader = ({ step, onCancel }: IProps) => {
  const classes = useStyles()

  return (
    <div className={classes.headerTop}>
      <Typography className={classes.title}>Create New Pool</Typography>
      <CreatePoolStepper step={step} />
      <span className={classes.cancel} onClick={onCancel}>
        Cancel
      </span>
    </div>
  )
}
