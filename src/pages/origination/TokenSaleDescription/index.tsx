import { makeStyles, TextField } from '@material-ui/core'
import { ChangeEvent, useState } from 'react'

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 700,
    fontSize: 22,
    color: theme.colors.white,
    margin: '24px 0 11px 0',
  },
  subTitle: {
    fontWeight: 700,
    fontSize: 16,
    color: theme.colors.white,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: theme.colors.primary100,
    marginBottom: 15,
  },
  notchedOutline: {
    color: theme.colors.primary200,
  },
  input: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.colors.primary200,
      borderWidth: 1,
    },
    width: '70%',
    '& .Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.colors.primary100,
        borderWidth: 1,
      },
    },
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: theme.colors.primary100,
      },
    },
  },
  inputBox: {
    color: theme.colors.white,
    border: `1px solid ${theme.colors.primary200} `,
    padding: 0,
    height: 100,
  },
  textLimitation: {
    fontSize: 12,
    color: theme.colors.primary100,
    marginBottom: 15,
  },
}))

interface IState {
  description: string
}

export const TokenSaleDescription = () => {
  const classes = useStyles()
  const [state, setState] = useState<IState>({
    description: '',
  })

  const { description } = state

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 200) return
    setState((prev) => ({
      ...prev,
      description: event.target.value,
    }))
  }

  return (
    <div>
      <div className={classes.title}>Offering Overview</div>
      <div className={classes.subTitle}>Pool Description (Optional)</div>
      <div className={classes.description}>
        Additonal information about your pool can be added here.
      </div>
      <TextField
        multiline
        className={classes.input}
        value={state.description}
        onChange={onChange}
        variant="outlined"
        fullWidth
      />
      <div className={classes.textLimitation}>{description.length}/200</div>
    </div>
  )
}
