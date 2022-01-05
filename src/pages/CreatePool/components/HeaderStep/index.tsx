import { useState } from 'react'
import { Stepper, Step, makeStyles } from '@material-ui/core'
import { ECreatePoolStep } from 'utils/enums'
import clsx from 'clsx'

import { CreatePoolStepper  } from './CreatePoolStepper'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
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
}))

interface IProps {
  step: ECreatePoolStep
  onCancel: () => void
}

export const HeaderStep = ({ step, onCancel }: IProps) => {
  const classes = useStyles()
  const [testStep, setTestStep] = useState(0)

  return (
    <div className={classes.root}>
      {Object.values(ECreatePoolStep).map((step, index) => {
        return (
          <div
            className={clsx(classes.item, step === step && 'active')}
            key={step}
          >
            <span>{index + 1}</span>
            <span>{step}</span>
          </div>
        )
      })}
      <span className={classes.cancel} onClick={onCancel}>
        Cancel
      </span>
      <CreatePoolStepper />
    </div>
  )
}
