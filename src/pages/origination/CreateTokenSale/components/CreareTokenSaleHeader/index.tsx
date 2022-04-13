import { makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { ECreareTokenSaleStep } from 'utils/enums'
import { CreateTokenSaleStepper } from './CreateTokenSaleStepper'

const useStyles = makeStyles((theme) => ({
  headerTop: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: theme.colors.primary500,
    borderBottom: `1px solid ${theme.colors.primary200}`,
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      justifyContent: 'center',
    },
  },
  headerDataContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  firstStepHeader: {
    [theme.breakpoints.up('lg')]: {
      paddingRight: 110,
    },
  },
  title: {
    fontSize: 18,
    color: theme.colors.white,
    fontWeight: 700,
    lineHeight: '21.6px',
    flexShrink: 2,
  },
  cancel: {
    fontSize: 14,
    color: theme.colors.primary100,
    fontWeight: 600,
    cursor: 'pointer',
    marginLeft: 52,
  },
}))

interface IProps {
  step: ECreareTokenSaleStep
  onCancel: () => void
}

export const CreareTokenSaleHeader = ({ step, onCancel }: IProps) => {
  const classes = useStyles()
  const isFirstStep = step === ECreareTokenSaleStep.Offering

  return (
    <div
      className={clsx(
        classes.headerTop,
        isFirstStep && classes.firstStepHeader
      )}
    >
      <Typography className={classes.title}>Token Sale</Typography>
      <div className={classes.headerDataContainer}>
        <CreateTokenSaleStepper step={step} />
        {!isFirstStep && (
          <span className={classes.cancel} onClick={onCancel}>
            Cancel
          </span>
        )}
      </div>
    </div>
  )
}
