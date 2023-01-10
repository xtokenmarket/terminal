import { makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { ECreateTokenSaleStep } from 'utils/enums'
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
      paddingTop: theme.spacing(2),
    },
  },
  headerDataContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',

    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
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

    [theme.breakpoints.down('sm')]: {
      marginLeft: 40,
      marginTop: 40,
      marginRight: 'auto',
    },
  },
  backWrapper: {
    margin: 20,
    display: 'flex',
    cursor: 'pointer',
    transition: 'all 0.4s',
    '&:hover': {
      opacity: 0.7,
    },
  },
  backText: {
    color: theme.colors.primary100,
    marginLeft: 16,
  },
}))

interface IProps {
  step: ECreateTokenSaleStep
  onCancel: () => void
}

export const CreateTokenSaleHeader = ({ step, onCancel }: IProps) => {
  const classes = useStyles()

  return (
    <div className={clsx(classes.headerTop)}>
      <Typography className={classes.title}>Token Program</Typography>
      <div className={classes.headerDataContainer}>
        <CreateTokenSaleStepper step={step} />
        <span className={classes.cancel} onClick={onCancel}>
          Cancel
        </span>
      </div>
    </div>
  )
}
