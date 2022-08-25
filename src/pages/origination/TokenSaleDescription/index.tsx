import {
  Button,
  CircularProgress,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core'
import { ChangeEvent, useEffect, useState } from 'react'
import { ReactComponent as EditIcon } from 'assets/svgs/edit.svg'
import { getAddress } from 'ethers/lib/utils'
import { ORIGINATION_API_URL } from 'config/constants'
import axios from 'axios'
import { useConnectedWeb3Context } from 'contexts'
import { getNetworkFromId } from 'utils/network'
import { NetworkId } from 'types'
import { useParams } from 'react-router-dom'
import { RouteParams } from '../TokenSaleDetails'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 700,
    fontSize: 22,
    color: theme.colors.white,
    margin: '24px 0 11px 0',
  },
  name: {
    fontWeight: 700,
    fontSize: 18,
    color: theme.colors.white,
    marginRight: 10,
  },
  hint: {
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
    '&.dark': {
      opacity: 0.7,
      backgroundColor: theme.colors.secondary,
    },
    padding: '8px 20px',
    backgroundColor: theme.colors.secondary,
    borderRadius: 4,
    height: 33,
    width: 80,
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
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  editIconWrapper: {
    cursor: 'pointer',
  },
  editDescriptionText: {
    fontSize: 14,
    color: theme.colors.secondary,
    cursor: 'pointer',
  },
  editorWrapper: {
    margin: '20px 0',
  },
  description: {
    color: theme.colors.white,
    fontSize: 18,
  },
  loading: {
    color: theme.colors.white,
  },
}))

interface IState {
  description: string
  name: string
  isDescriptionEditing: boolean
  isNameEditing: boolean
  pending: boolean
}

interface IProps {
  offeringName: string
  offeringDescription: string
  loadInfo: () => void
}

enum IKey {
  PoolName = 'isNameEditing',
  Description = 'isDescriptionEditing',
}

export const TokenSaleDescription = (props: IProps) => {
  const classes = useStyles()
  const [state, setState] = useState<IState>({
    description: '',
    name: '',
    isDescriptionEditing: false,
    isNameEditing: false,
    pending: false,
  })

  const { description, name, isDescriptionEditing, isNameEditing, pending } =
    state
  const { offeringName, offeringDescription, loadInfo } = props
  const { library: provider, networkId } = useConnectedWeb3Context()
  const { poolAddress } = useParams<RouteParams>()

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      name: offeringName,
      description: offeringDescription,
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

  const onSave = async (key: IKey) => {
    if (!provider || !networkId) return
    setState((prev) => ({
      ...prev,
      pending: true,
    }))

    try {
      const signedPoolAddress = await provider
        .getSigner()
        .signMessage(poolAddress)
      await axios.put(
        `${ORIGINATION_API_URL}/pool/${getAddress(poolAddress)}`,
        {
          network: getNetworkFromId(networkId as NetworkId),
          signedPoolAddress,
          poolName: name,
          description,
        }
      )
      setState((prev) => ({
        ...prev,
        [key]: false,
      }))
      loadInfo()
    } catch (error) {
      console.log('onDescriptionSave error', error)
    } finally {
      setState((prev) => ({
        ...prev,
        pending: false,
      }))
    }
  }

  const toggleEditDescriptionMode = () => {
    setState((prev) => ({
      ...prev,
      isNameEditing: false,
      isDescriptionEditing: !isDescriptionEditing,
    }))
  }

  const toggleEditNameMode = () => {
    setState((prev) => ({
      ...prev,
      isNameEditing: !isNameEditing,
      isDescriptionEditing: false,
    }))
  }

  return (
    <div className={classes.root}>
      <div className={classes.title}>Offering Details</div>
      {isNameEditing ? (
        <div className={classes.editorWrapper}>
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
              shrink: true,
            }}
          />
          <div className={classes.textLimitation}>{name.length}/20</div>
          <div className={classes.buttonsWrapper}>
            <div className={classes.cancelButton} onClick={toggleEditNameMode}>
              CANCEL
            </div>
            <Button
              className={clsx(classes.button, [(pending || !name) && 'dark'])}
              onClick={() => onSave(IKey.PoolName)}
              disabled={!name}
            >
              <Typography className={classes.text}>
                {pending ? (
                  <CircularProgress
                    className={classes.loading}
                    color="primary"
                    size={15}
                    thickness={4}
                  />
                ) : (
                  'SAVE'
                )}
              </Typography>
            </Button>
          </div>
        </div>
      ) : (
        <div className={classes.nameWrapper}>
          <div className={classes.name}>{offeringName}</div>
          {!pending && (
            <div
              className={classes.editIconWrapper}
              onClick={toggleEditNameMode}
            >
              <EditIcon />
            </div>
          )}
        </div>
      )}

      <div className={classes.hint}>
        Offering Name and additonal information about your pool can be added
        here..
      </div>
      {isDescriptionEditing ? (
        <div className={classes.editorWrapper}>
          <TextField
            multiline
            className={classes.input}
            value={state.description}
            onChange={onDescriptionChange}
            variant="outlined"
            fullWidth
            label="Offering Description"
            InputLabelProps={{
              className: classes.inputLabel,
              shrink: true,
            }}
          />
          <div className={classes.textLimitation}>{description.length}/200</div>
          <div className={classes.buttonsWrapper}>
            <div
              className={classes.cancelButton}
              onClick={toggleEditDescriptionMode}
            >
              CANCEL
            </div>
            <Button
              className={clsx(classes.button, [
                (pending || !description) && 'dark',
              ])}
              onClick={() => onSave(IKey.Description)}
              disabled={!description}
            >
              <Typography className={classes.text}>
                {pending ? (
                  <CircularProgress
                    className={classes.loading}
                    color="primary"
                    size={15}
                    thickness={4}
                  />
                ) : (
                  'SAVE'
                )}
              </Typography>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className={classes.description}>{offeringDescription} </div>
          {!pending && (
            <div
              className={classes.editDescriptionText}
              onClick={toggleEditDescriptionMode}
            >
              Edit Description
            </div>
          )}
        </>
      )}
    </div>
  )
}
