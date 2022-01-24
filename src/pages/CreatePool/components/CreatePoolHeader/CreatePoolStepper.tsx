import React from 'react'
import {
  Stepper,
  Step,
  StepLabel,
  makeStyles,
  Typography,
  useMediaQuery,
} from '@material-ui/core'
import { ECreatePoolStep } from 'utils/enums'

const useStyles = makeStyles((theme) => ({
  stepper: {
    background: theme.colors.primary500,
    [theme.breakpoints.up('md')]: {
      width: '100%',
    },
    '& .MuiStepConnector-vertical': {
      padding: '10px 4px',
    },
  },
  step: {
    '& .MuiStepLabel-label': {
      color: theme.colors.gray2,
      '&.MuiStepLabel-active': {
        color: theme.colors.white,
      },
      '&.MuiStepLabel-completed': {},
    },
    '& .MuiStepIcon-root text': {
      fill: theme.colors.gray2,
    },
    '& .MuiStepIcon-active': {
      color: theme.colors.primary200,
      '& text': {
        fill: theme.colors.white,
      },
    },
    '& .MuiStepIcon-completed': {
      color: theme.colors.primary200,
      '& text': {
        fill: theme.colors.gray2,
      },
    },
    '& svg': {
      fontSize: 36,
    },
  },
}))

interface IProps {
  step: ECreatePoolStep
}

const STEPS_DATA: Record<ECreatePoolStep, { index: number; label: string }> = {
  [ECreatePoolStep.TokenPair]: {
    index: 0,
    label: 'Token Pair',
  },
  [ECreatePoolStep.PriceRange]: {
    index: 1,
    label: 'Price Range',
  },
  [ECreatePoolStep.Rewards]: {
    index: 2,
    label: 'Rewards (Optional)',
  },
  // [ECreatePoolStep.Done]: {
  //   index: 3,
  //   label: 'Done',
  // },
}

export const CreatePoolStepper: React.FC<IProps> = ({ step }) => {
  const cl = useStyles()
  const stepNum = STEPS_DATA[step].index
  const isSm = useMediaQuery('(max-width: 959px)')
  const orientation = isSm ? 'vertical' : 'horizontal'
  return (
    <Stepper
      activeStep={stepNum}
      className={cl.stepper}
      orientation={orientation}
    >
      {Object.values(STEPS_DATA).map(({ index, label }) => (
        <Step key={index} className={cl.step}>
          <StepLabel>
            <Typography variant="body1">{label}</Typography>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}
