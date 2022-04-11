import { makeStyles, TextField, Typography } from '@material-ui/core'
import clsx from 'clsx'

import useCommonStyles from 'style/common'

const useStyles = makeStyles((theme) => ({
  input: {
    '& .Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.colors.white,
        borderWidth: 1,
      },
    },
  },
  notchedOutline: {
    borderColor: theme.colors.primary100,
  },
  inputBox: {
    paddingRight: 60,
  },
  label: {
    color: theme.colors.white,
    marginBottom: 18,
    fontFamily: 'Gilmer',
    fontWeight: 700,
    fontSize: 14,
    marginTop: 22,
  },
}))

interface IProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
}

export const Input: React.FC<IProps> = ({ value, onChange, label }) => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()

  return (
    <>
      {label && <Typography className={classes.label}>{label}</Typography>}
      <TextField
        className={classes.input}
        type="number"
        variant="outlined"
        fullWidth
        value={value}
        placeholder="Amount"
        onChange={onChange}
        InputProps={{
          classes: {
            notchedOutline: classes.notchedOutline,
            input: clsx(commonClasses.hideInputArrow, classes.inputBox),
          },
        }}
      />
    </>
  )
}
