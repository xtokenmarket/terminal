import { InputAdornment, makeStyles, TextField } from '@material-ui/core'
import clsx from 'clsx'
import { transparentize } from 'polished'
import React from 'react'
import useCommonStyles from 'style/common'

const useStyles = makeStyles((theme) => ({
  root: {
    '& + &': {
      marginTop: 32,
    },
  },
  input: {
    '& .Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.colors.white,
        borderWidth: 1,
      },
    },
  },
  inputBox: {
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      paddingRight: theme.spacing(1),
    },
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
    margin: theme.spacing(1, 0, 2, 0),
  },
  button: {
    marginRight: theme.spacing(1),
    height: 32,
    width: 54,
    fontSize: 12,
    [theme.breakpoints.down('xs')]: {
      fontSize: 10,
      height: 28,
      width: 40,
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary400,
    color: theme.colors.primary100,
    border: `1px solid ${theme.colors.eighth}`,
    transition: 'all 0.4s',
    borderRadius: 4,
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
  label: string
  value: string
  onChange: (_: string) => void
  className?: string
}

export const RewardPeriodInput: React.FC<IProps> = ({
  label,
  value,
  onChange,
  className,
}) => {
  const cl = useStyles()
  const commonClasses = useCommonStyles()
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value
    if (newValue !== '') {
      newValue = Math.floor(Number(e.target.value)).toString()
    }
    onChange(newValue)
  }

  return (
    <div className={cl.root}>
      <TextField
        type="number"
        variant="outlined"
        fullWidth
        value={value}
        onChange={onChangeInput}
        className={cl.input}
        InputLabelProps={{
          shrink: true,
          className: cl.inputLabel,
        }}
        InputProps={{
          classes: {
            notchedOutline: cl.notchedOutline,
            input: clsx(commonClasses.hideInputArrow, cl.inputBox),
          },
          endAdornment: <InputAdornment position="end">Weeks</InputAdornment>,
        }}
        label={label}
      />
      <div className={cl.buttons}>
        {[1, 3, 5, 8].map((week) => (
          <span
            key={`${week}`}
            className={clsx(
              cl.button,
              week === Number(value || '0') && 'active'
            )}
            onClick={() => onChange(week.toString())}
          >
            {week}&nbsp;W
          </span>
        ))}
      </div>
    </div>
  )
}
