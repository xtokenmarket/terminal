import { useState } from 'react'
import { Stepper, Step, makeStyles, Grid, Typography } from '@material-ui/core'
import { ECreatePoolStep } from 'utils/enums'
import clsx from 'clsx'

import { CreatePoolStepper  } from './CreatePoolStepper'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    // flexWrap: 'wrap',
  },
  item: {
    marginRight: 40,
    display: 'flex',
    alignItems: 'center',
    '& span': {
      '&:first-child': {
        marginRight: 8,
        width: 32,
        height: 32,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px solid ${theme.colors.primary200}`,
        color: theme.colors.primary100,
        lineHeight: 1,
        transition: 'all 0.4s',
      },
      '&:last-child': {
        color: theme.colors.primary100,
        lineHeight: 1,
        transition: 'all 0.4s',
      },
    },
    '&.active': {
      '& span': {
        '&:first-child': {
          borderColor: theme.colors.primary200,
          backgroundColor: theme.colors.primary200,
          color: theme.colors.white,
        },
        '&:last-child': { color: theme.colors.white },
      },
    },
  },
  cancel: {
    color: theme.colors.primary100,
    fontWeight: 600,
    cursor: 'pointer',
  },

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
}))

interface IProps {
  step: ECreatePoolStep
  onCancel: () => void
}

export const HeaderStep = ({ step, onCancel }: IProps) => {
  const classes = useStyles()

  return (
    <div className={classes.headerTop}>
      <Typography className={classes.title}>
        Create New Pool
      </Typography>
      <CreatePoolStepper step={step} />
      <span className={classes.cancel} onClick={onCancel}>
        Cancel
      </span>
    </div>
  )
}
