import { makeStyles, TextField } from '@material-ui/core'
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
}))

interface IProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input: React.FC<IProps> = ({ value, onChange }) => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()

  return (
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
  )
}
