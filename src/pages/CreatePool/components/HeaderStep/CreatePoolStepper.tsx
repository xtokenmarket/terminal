import React, { useState } from 'react'
import { Stepper, Step, StepLabel, makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  stepper: {
    background: 'none',
    width: '100%',
  },
  step: {
    '& .MuiStepIcon-active': {
      color: theme.colors.primary200,
    },
    '& .MuiStepLabel-label': {
      color: theme.colors.gray2,
      '&.MuiStepLabel-active': {
        color: theme.colors.white,
      },
    },
  },
}))

export const CreatePoolStepper: React.FC = () => {
  const cl = useStyles()
  const [step, setStep] = useState(0)
  return (
    <Stepper activeStep={step} className={cl.stepper}>
      <Step key={0} className={cl.step}>
        <StepLabel>
          <Typography variant="body1">
            step 0
          </Typography>
        </StepLabel>
      </Step>
      <Step key={1} className={cl.step}>
        <StepLabel>Step 1</StepLabel>
      </Step>
      <Step key={2} className={cl.step}>
        <StepLabel>Step 2</StepLabel>
      </Step>
      <Step key={2} className={cl.step}>
        <StepLabel>Step 3</StepLabel>
      </Step>
    </Stepper>
  )
}