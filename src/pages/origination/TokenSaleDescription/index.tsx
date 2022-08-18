import { Button, makeStyles, TextField, Typography } from '@material-ui/core'
import { ChangeEvent, useEffect, useState } from 'react'
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
    marginRight: 10,
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
  inputLabel: { color: `${theme.colors.white} !important` },
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
  cancelButton: {
    color: theme.colors.white,
    fontSize: 12,
    cursor: 'pointer',
  },
  buttonsWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  root: {
    width: '70%',
  },
  editWrapper: {
    cursor: 'pointer',
  },
  editDescriptionText: {
    fontSize: 18,
    color: theme.colors.secondary,
    cursor: 'pointer',
  },
  nameEditorWrapper: {
    margin: '20px 0',
  },
}))

interface IState {
  description: string
  name: string
  isDescriptionEditing: boolean
  isNameEditing: boolean
}

interface IProps {
  defaultOfferingName: string
}

export const TokenSaleDescription = (props: IProps) => {
  const classes = useStyles()
  const [state, setState] = useState<IState>({
    description: '',
    name: '',
    isDescriptionEditing: false,
    isNameEditing: false,
  })

  const { description, name, isDescriptionEditing, isNameEditing } = state
  const { defaultOfferingName } = props

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      name: defaultOfferingName,
    }))
  }, [])

  const onDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 200) return
    setState((prev) => ({
      ...prev,
      description: event.target.value,
    }))
  }

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 20) return
    setState((prev) => ({
      ...prev,
      name: event.target.value,
    }))
  }

  const onDescriptionSave = () => {
    console.log('onDescriptionSave click')
  }

  const toggleEditDescriptionMode = () => {
    setState((prev) => ({
      ...prev,
      isDescriptionEditing: !isDescriptionEditing,
    }))
  }

  const toggleEditNameMode = () => {
    setState((prev) => ({
      ...prev,
      isNameEditing: !isNameEditing,
    }))
  }

  return (
    <div className={classes.root}>
      <div className={classes.title}>Offering Details</div>
      {isNameEditing ? (
        <div className={classes.nameEditorWrapper}>
          <TextField
            multiline
            className={classes.input}
            value={state.name}
            onChange={onNameChange}
            variant="outlined"
            fullWidth
            label="Offering Name"
            InputLabelProps={{
              className: classes.inputLabel,
            }}
          />
          <div className={classes.textLimitation}>{name.length}/20</div>
          <div className={classes.buttonsWrapper}>
            <div className={classes.cancelButton} onClick={toggleEditNameMode}>
              CANCEL
            </div>
            <Button className={classes.button} onClick={onDescriptionSave}>
              <Typography className={classes.text}>SAVE</Typography>
            </Button>
          </div>
        </div>
      ) : (
        <div className={classes.nameWrapper}>
          <div className={classes.name}>{defaultOfferingName}</div>
          <div className={classes.editWrapper} onClick={toggleEditNameMode}>
            <EditIcon />
          </div>
        </div>
      )}

      <div className={classes.description}>
        Offering Name and additonal information about your pool can be added
        here..
      </div>
      {isDescriptionEditing ? (
        <>
          <TextField
            multiline
            className={classes.input}
            value={state.description}
            onChange={onDescriptionChange}
            variant="outlined"
            fullWidth
          />
          <div className={classes.textLimitation}>{description.length}/200</div>
          <div className={classes.buttonsWrapper}>
            <div
              className={classes.cancelButton}
              onClick={toggleEditDescriptionMode}
            >
              CANCEL
            </div>
            <Button className={classes.button} onClick={onDescriptionSave}>
              <Typography className={classes.text}>SAVE</Typography>
            </Button>
          </div>
        </>
      ) : (
        <>
          <div>{description} </div>
          <div
            className={classes.editDescriptionText}
            onClick={toggleEditDescriptionMode}
          >
            Edit Description
          </div>{' '}
        </>
      )}
    </div>
  )
}
