import clsx from 'clsx'
import { BigNumber } from '@ethersproject/bignumber'
import { IToken } from 'types'
import { makeStyles, TextField, Typography } from '@material-ui/core'

import useCommonStyles from 'style/common'
import { QuestionTooltip } from '../QuestionTooltip'
import { useTokenBalance } from 'helpers'
import { formatBigNumber } from 'utils'

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
    fontFamily: 'Gilmer',
    fontWeight: 700,
    fontSize: 14,
  },
  labelWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 18,
  },
  tooltipQuestion: {
    marginLeft: 10,
  },
  bottomDetails: {
    color: theme.colors.primary100,
    fontSize: 12,
    lineHeight: '14.4px',
    width: 'fit-content',
    marginTop: theme.spacing(1),
    textDecoration: `underline ${theme.colors.primary200}`,
    textUnderlineOffset: '5px',
  },
}))

interface IProps {
  className?: string
  value: string
  token?: IToken
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  tokenDetailsPlaceholder?: string
  disabled?: boolean
  infoText?: string
}

export const TokenAmountInput: React.FC<IProps> = ({
  className,
  value,
  token,
  onChange,
  label,
  disabled,
  infoText,
  tokenDetailsPlaceholder,
}) => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()
  const { balance } = useTokenBalance(token?.address || '')

  const getFormattedTokenBalance = () => {
    if (!token) {
      return null
    }

    return `${formatBigNumber(balance, token.decimals, 4)} ${token.symbol}`
  }

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
              className,
              disabled && classes.inputDisabledText
            ),
          },
        }}
        disabled={disabled}
      />

      <Typography className={classes.bottomDetails}>
        {value === '' || !token
          ? tokenDetailsPlaceholder
          : `Available - ${getFormattedTokenBalance()}`}
      </Typography>
    </>
  )
}
