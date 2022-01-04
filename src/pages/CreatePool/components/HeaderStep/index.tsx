import { makeStyles } from '@material-ui/core'
import { ECreatePoolStep } from 'utils/enums'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
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

export const HeaderStep = (props: IProps) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {Object.values(ECreatePoolStep).map((step, index) => {
        return (
          <div
            className={clsx(classes.item, step === props.step && 'active')}
            key={step}
          >
            <span>{index + 1}</span>
            <span>{step}</span>
          </div>
        )
      })}
      <span className={classes.cancel} onClick={props.onCancel}>
        Cancel
      </span>
    </div>
  )
}
