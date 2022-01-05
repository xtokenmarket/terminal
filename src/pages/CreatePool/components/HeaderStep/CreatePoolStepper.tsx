import React, { useState } from 'react'
import { Stepper, Step, StepLabel, makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  stepper: {
    background: 'none',
    width: '100%',
  },
  step: {
    '& .MuiStepLabel-label': {
      color: theme.colors.gray2,
      '&.MuiStepLabel-active': {
        color: theme.colors.white,
      },
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
  },
}))

export const CreatePoolStepper: React.FC = () => {
  const cl = useStyles()
  const [step, setStep] = useState(0)
  return (
    <>
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
      <button onClick={() => setStep(step + 1)}>btn</button>
    </>
  )
}