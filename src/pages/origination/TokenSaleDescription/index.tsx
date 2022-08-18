import { Button, makeStyles, TextField, Typography } from '@material-ui/core'
import { ChangeEvent, useState } from 'react'
import { ReactComponent as EditIcon } from 'assets/svgs/edit.svg'

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 700,
    fontSize: 22,
    color: theme.colors.white,
    margin: '24px 0 11px 0',
  },
  name: {
    fontWeight: 700,
    fontSize: 16,
    color: theme.colors.white,
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
  button: {
    marginTop: 14,
    '&:hover': {
      opacity: 0.7,
      backgroundColor: theme.colors.secondary,
    },
    padding: '8px 20px',
    backgroundColor: theme.colors.secondary,
    borderRadius: 4,
  },
  text: {
    color: theme.colors.primary700,
    fontSize: 14,
    fontWeight: 600,
  },
  icon: {
    widows: 14,
    height: 14,
    marginLeft: 10,
  },
  nameWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
}))

interface IState {
  description: string
}

interface IProps {
  defaultOfferingName: string
}

export const TokenSaleDescription = (props: IProps) => {
  const classes = useStyles()
  const [state, setState] = useState<IState>({
    description: '',
  })

  const { description } = state
  const { defaultOfferingName } = props

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 200) return
    setState((prev) => ({
      ...prev,
      description: event.target.value,
    }))
  }

  const onDescriptionSave = () => {
    console.log('onDescriptionSave click')
  }

  return (
    <div>
      <div className={classes.title}>Offering Overview</div>
      <div className={classes.nameWrapper}>
        <div className={classes.name}>{defaultOfferingName}</div>
        <EditIcon />
      </div>

      <div className={classes.description}>
        Offering Name and additonal information about your pool can be added
        here..
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
      <div>
        <div>CANCEL</div>
        <Button className={classes.button} onClick={onDescriptionSave}>
          <Typography className={classes.text}>SAVE</Typography>
        </Button>
      </div>
    </div>
  )
}
