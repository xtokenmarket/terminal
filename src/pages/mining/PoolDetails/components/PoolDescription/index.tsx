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
import { TERMINAL_API_URL } from 'config/constants'
import axios from 'axios'
import { useConnectedWeb3Context } from 'contexts'
import { getNetworkFromId } from 'utils/network'
import { NetworkId } from 'types'
import clsx from 'clsx'
import { useSnackbar } from 'notistack'
import colors from 'theme/colors'

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
    margin: '5px 0',
  },
  button: {
    '&:hover': {
      opacity: 0.7,
      backgroundColor: theme.colors.secondary,
    },
    '&.dark': {
      opacity: 0.5,
      backgroundColor: theme.colors.secondary,
    },
    '&.Mui-disabled': {
      opacity: 0.5,
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
    color: theme.colors.primary100,
    cursor: 'pointer',
    display: 'inline-block',
    fontSize: 14,
    marginTop: 6,
  },
  editorWrapper: {
    margin: '20px 0',
  },
  description: {
    color: theme.colors.white,
    fontSize: 16,
    marginTop: 6,
  },
  loading: {
    color: theme.colors.white,
  },
  error: {
    color: theme.colors.warn,
    marginTop: 10,
    fontSize: 14,
  },
}))

interface IState {
  description: string
  name: string
  isDescriptionEditing: boolean
  isNameEditing: boolean
  pending: boolean
  errorMessage: string
}

interface IProps {
  poolName: string
  poolDescription: string
  loadInfo: () => void
  isOwnerOrManager?: boolean
  poolAddress: string
}

enum IKey {
  PoolName = 'name',
  Description = 'description',
}

export const PoolDescription = (props: IProps) => {
  const classes = useStyles()
  const [state, setState] = useState<IState>({
    description: '',
    name: '',
    isDescriptionEditing: false,
    isNameEditing: false,
    pending: false,
    errorMessage: '',
  })

  const {
    description,
    name,
    isDescriptionEditing,
    isNameEditing,
    pending,
    errorMessage,
  } = state
  const { poolName, poolDescription, loadInfo, isOwnerOrManager, poolAddress } =
    props
  const { library: provider, networkId } = useConnectedWeb3Context()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      name: poolName || '',
      description: poolDescription || '',
    }))
  }, [poolName, poolDescription])

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: IKey
  ) => {
    const textLengthLimit = key === IKey.PoolName ? 20 : 200
    if (event.target.value.length > textLengthLimit) {
      setState((prev) => ({
        ...prev,
        [key]: event.target.value,
        errorMessage: 'Text length exceeds limitation',
      }))
      return
    }
    setState((prev) => ({
      ...prev,
      [key]: event.target.value,
      errorMessage: '',
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

      await axios.put(`${TERMINAL_API_URL}/pool/${getAddress(poolAddress)}`, {
        network: getNetworkFromId(networkId as NetworkId),
        signedPoolAddress,
        poolName: isNameEditing ? name : undefined,
        description: isDescriptionEditing ? description : undefined,
      })

      setState((prev) => ({
        ...prev,
        [key === IKey.PoolName ? 'isNameEditing' : 'isDescriptionEditing']:
          false,
      }))

      loadInfo()
    } catch (error: any) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      })
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
      description: poolDescription || '',
      isNameEditing: false,
      isDescriptionEditing: !prev.isDescriptionEditing,
    }))
  }

  const toggleEditNameMode = () => {
    setState((prev) => ({
      ...prev,
      name: poolName || '',
      isNameEditing: !prev.isNameEditing,
      isDescriptionEditing: false,
    }))
  }

  const isEditingDisabled = pending || !!errorMessage
  const isEditingNameDisabled = isEditingDisabled || !name || name === poolName
  const isEditingDescriptionDisabled =
    isEditingDisabled || !description || description === poolDescription

  return (
    <div className={classes.root}>
      <div className={classes.title}>Pool Details</div>
      {isNameEditing ? (
        <div className={classes.editorWrapper}>
          <TextField
            multiline
            className={classes.input}
            value={state.name}
            onChange={(event) => onChange(event, IKey.PoolName)}
            variant="outlined"
            fullWidth
            label="Program Name"
            InputLabelProps={{
              className: classes.inputLabel,
              shrink: true,
            }}
            rows={1}
          />
          <div className={classes.textLimitation}>{name.length}/20</div>
          <div className={classes.buttonsWrapper}>
            <div className={classes.cancelButton} onClick={toggleEditNameMode}>
              CANCEL
            </div>
            <Button
              className={clsx(classes.button, [
                isEditingNameDisabled && 'dark',
              ])}
              onClick={() => onSave(IKey.PoolName)}
              disabled={isEditingNameDisabled}
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
          {errorMessage && <div className={classes.error}>{errorMessage}</div>}
        </div>
      ) : (
        <div className={classes.nameWrapper}>
          <div className={classes.name}>{poolName}</div>
          {!pending && isOwnerOrManager && (
            <div
              className={classes.editIconWrapper}
              onClick={toggleEditNameMode}
            >
              <EditIcon fill={colors[0].colors.primary100} />
            </div>
          )}
        </div>
      )}

      {isDescriptionEditing ? (
        <div className={classes.editorWrapper}>
          <TextField
            multiline
            className={classes.input}
            value={state.description}
            onChange={(event) => onChange(event, IKey.Description)}
            variant="outlined"
            fullWidth
            label="Offering Description"
            InputLabelProps={{
              className: classes.inputLabel,
              shrink: true,
            }}
            rows={3}
          />
          <div className={classes.textLimitation}>
            {description?.length || '0'}/200
          </div>
          <div className={classes.buttonsWrapper}>
            <div
              className={classes.cancelButton}
              onClick={toggleEditDescriptionMode}
            >
              CANCEL
            </div>
            <Button
              className={clsx(classes.button, [
                isEditingDescriptionDisabled && 'dark',
              ])}
              onClick={() => onSave(IKey.Description)}
              disabled={isEditingDescriptionDisabled}
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
          {errorMessage && <div className={classes.error}>{errorMessage}</div>}
        </div>
      ) : (
        <>
          <div className={classes.description}>{poolDescription} </div>
          {!pending && isOwnerOrManager && (
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
