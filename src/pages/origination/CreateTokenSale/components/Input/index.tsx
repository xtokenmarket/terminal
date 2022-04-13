import { makeStyles, TextField, Typography } from '@material-ui/core'
import clsx from 'clsx'

import useCommonStyles from 'style/common'
import { QuestionTooltip } from '../QuestionTooltip'

const useStyles = makeStyles((theme) => ({
  input: {
    '& .Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.colors.primary100,
        borderWidth: 1,
      },
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.colors.primary200,
      },
      '&:hover fieldset': {
        borderColor: theme.colors.primary100,
      },
    },
  },
  notchedOutline: {
    borderColor: theme.colors.primary100,
  },
  inputBox: {
    paddingRight: 60,
    color: theme.colors.white,
    fontWeight: 700,
    '&::placeholder': {
      /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: theme.colors.primary100,
      /* Firefox */
      opacity: 1,
      fontWeight: 'normal',
    },
    '&:-ms-input-placeholder': {
      /* Internet Explorer 10-11 */
      color: theme.colors.primary100,
    },

    '&::-ms-input-placeholder': {
      /* Microsoft Edge */
      color: theme.colors.primary100,
    },
  },
  inputDisabledText: {
    color: theme.colors.primary200,
    '&::placeholder': {
      /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: theme.colors.primary200,
      /* Firefox */
      opacity: 1,
    },
    '&:-ms-input-placeholder': {
      /* Internet Explorer 10-11 */
      color: theme.colors.primary200,
    },

    '&::-ms-input-placeholder': {
      /* Microsoft Edge */
      color: theme.colors.primary200,
    },
  },
  label: {
    color: theme.colors.white,
    marginBottom: 18,
    fontFamily: 'Gilmer',
    fontWeight: 700,
    fontSize: 14,
    marginTop: 22,
  },
  labelWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  tooltipQuestion: {
    marginLeft: 10,
  },
}))

interface IProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  disabled?: boolean
  infoText?: string
}

export const Input: React.FC<IProps> = ({
  value,
  onChange,
  label,
  disabled,
  infoText,
}) => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()

  return (
    <>
      {label && (
        <div className={classes.labelWrapper}>
          <Typography className={classes.label}>
            {label}
            {infoText && (
              <QuestionTooltip
                title={infoText}
                className={classes.tooltipQuestion}
              />
            )}
          </Typography>
        </div>
      )}

      <TextField
        fullWidth
        className={classes.input}
        type="number"
        variant="outlined"
        value={value}
        placeholder="Amount"
        onChange={onChange}
        InputProps={{
          classes: {
            notchedOutline: classes.notchedOutline,
            input: clsx(
              commonClasses.hideInputArrow,
              classes.inputBox,
              disabled && classes.inputDisabledText
            ),
          },
        }}
        disabled={disabled}
      />
    </>
  )
}
