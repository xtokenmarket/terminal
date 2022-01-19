import { InputAdornment, makeStyles, TextField } from '@material-ui/core'
import clsx from 'clsx'
import { transparentize } from 'polished'
import useCommonStyles from 'style/common'

const useStyles = makeStyles((theme) => ({
  root: {},
  input: {
    '& .Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.colors.white,
        borderWidth: 1,
      },
    },
  },
  inputBox: {
    paddingRight: 60,
    fontWeight: 700,
  },
  inputLabel: {
    color: `${theme.colors.white} !important`,
  },
  notchedOutline: {
    borderColor: theme.colors.primary200,
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    margin: '4px -4px',
  },
  button: {
    margin: 4,
    height: 32,
    width: 54,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary400,
    color: theme.colors.primary100,
    border: `1px solid ${theme.colors.eighth}`,
    transition: 'all 0.4s',
    borderRadius: 4,
    fontSize: 12,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: transparentize(0.8, theme.colors.secondary),
      borderColor: theme.colors.secondary,
      color: theme.colors.white,
    },
    '&.active': {
      backgroundColor: transparentize(0.8, theme.colors.secondary),
      borderColor: theme.colors.secondary,
      color: theme.colors.white,
    },
  },
}))

interface IProps {
  value: string
  onChange: (_: string) => void
  className?: string
}

export const RewardPeriodInput = (props: IProps) => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()

  return (
    <div className={classes.root}>
      <TextField
        type="number"
        value={props.value}
        variant="outlined"
        InputLabelProps={{
          shrink: true,
          className: classes.inputLabel,
        }}
        fullWidth
        onChange={(event) => {
          let newValue = event.target.value
          if (newValue !== '') {
            newValue = Math.floor(Number(event.target.value)).toString()
          }
          props.onChange(newValue)
        }}
        InputProps={{
          classes: {
            notchedOutline: classes.notchedOutline,
            input: clsx(commonClasses.hideInputArrow, classes.inputBox),
          },
          endAdornment: <InputAdornment position="end">Weeks</InputAdornment>,
        }}
        className={classes.input}
      />
      <div className={classes.buttons}>
        {[1, 3, 5, 8].map((week) => (
          <span
            key={`${week}`}
            className={clsx(
              classes.button,
              week === Number(props.value || '0') && 'active'
            )}
            onClick={() => props.onChange(week.toString())}
          >
            {week}&nbsp;W
          </span>
        ))}
      </div>
    </div>
  )
}
