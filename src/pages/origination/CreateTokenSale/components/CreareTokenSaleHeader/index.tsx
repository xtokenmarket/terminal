import { makeStyles, Typography } from '@material-ui/core'
import { ECreareTokenSaleStep } from 'utils/enums'
import { CreateTokenSaleStepper } from './CreateTokenSaleStepper'

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
  step: ECreareTokenSaleStep
  onCancel: () => void
}

export const CreareTokenSaleHeader = ({ step, onCancel }: IProps) => {
  const classes = useStyles()

  return (
    <div className={classes.headerTop}>
      <Typography className={classes.title}>Token Sale</Typography>
      <CreateTokenSaleStepper step={step} />
      <span className={classes.cancel} onClick={onCancel}>
        Cancel
      </span>
    </div>
  )
}
