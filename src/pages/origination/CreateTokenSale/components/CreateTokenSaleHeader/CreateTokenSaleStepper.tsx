import React from 'react'
import clsx from 'clsx'
import {
  Stepper,
  Step,
  StepLabel,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core'
import { ECreateTokenSaleStep } from 'utils/enums'

const useStyles = makeStyles((theme) => ({
  stepper: {
    maxWidth: 748,
    maraginLeft: 'auto',
    background: 'transparent',
    padding: 0,
    [theme.breakpoints.up('md')]: {
      width: '100%',
    },
    '& .MuiStepConnector-vertical': {
      padding: '10px 4px',
    },
    '& .MuiStepConnector-root': {
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    '& .MuiStep-root': {
      // padding: '0px 20px',
    },
  },
  stepIcon: {
    width: 32,
    height: 32,
    border: `2px solid ${theme.colors.primary200}`,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 15,
    fontWeight: 700,
  },
  stepIconActive: {
    color: theme.colors.white,
    background: theme.colors.primary300,
  },
  stepIconInactive: {
    color: theme.colors.primary100,
  },
  stepLabel: {
    '& .MuiStepLabel-label': {
      color: theme.colors.primary100,
      fontSize: 14,
      fontWeight: 600,
      [theme.breakpoints.up('lg')]: {
        whiteSpace: 'nowrap',
      },

      '&.MuiStepLabel-active': {
        color: theme.colors.white,
      },
    },
  },
}))

interface IStepCircleIcon {
  active: boolean
}

const StepCircleIcon = ({
  active,
  children,
}: React.PropsWithChildren<IStepCircleIcon>) => {
  const classes = useStyles()

  return (
    <div
      className={clsx(
        classes.stepIcon,
        active ? classes.stepIconActive : classes.stepIconInactive
      )}
    >
      {children}
    </div>
  )
}

interface IProps {
  step: ECreateTokenSaleStep
}

const STEPS_DATA: Record<
  ECreateTokenSaleStep,
  { index: number; label: string }
> = {
  [ECreateTokenSaleStep.Offering]: {
    index: 0,
    label: 'Program Parameters',
  },
  [ECreateTokenSaleStep.Auction]: {
    index: 1,
    label: 'Auction Parameters',
  },
  [ECreateTokenSaleStep.Vesting]: {
    index: 2,
    label: 'Vesting Parameters',
  },
  [ECreateTokenSaleStep.Confirm]: {
    index: 3,
    label: 'Confirm',
  },
}

export const CreateTokenSaleStepper = ({ step }: IProps) => {
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
        <Step key={index}>
          <StepLabel
            className={cl.stepLabel}
            StepIconComponent={({ active, icon }) => (
              <StepCircleIcon active={active}>{icon}</StepCircleIcon>
            )}
          >
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}
