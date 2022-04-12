import { Button, CircularProgress, makeStyles } from '@material-ui/core'
import { WarningInfo } from 'components/Common/WarningInfo'
import { useConnectedWeb3Context } from 'contexts'
import { useEffect, useState } from 'react'
import { ICreateTokenSaleData } from 'types'
import { getMetamaskError } from 'utils'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 32,
  },
  button: { height: 48, marginTop: 24 },
  progress: { color: theme.colors.white },
}))

interface IProps {
  onNext: () => void
  onClose: () => void
  data: ICreateTokenSaleData
  setTxId: (txId: string) => void
}

interface IState {
  isCompleted: boolean
  isCreatingTokenSale: boolean
  createTokenSaleTx: string
  error: string
  poolAddress: string
}

export const InitSection = (props: IProps) => {
  const classes = useStyles()

  const { account, library: provider, networkId } = useConnectedWeb3Context()

  const [state, setState] = useState<IState>({
    isCompleted: false,
    isCreatingTokenSale: false,
    createTokenSaleTx: '',
    error: '',
    poolAddress: '',
  })

  const { onNext, data, onClose, setTxId } = props

  useEffect(() => {
    if (state.isCompleted) {
      onNext()
    }
  }, [state.isCompleted])

  const onCreateTokenSale = async () => {
    if (!account || !provider) {
      return
    }
    try {
      setState((prev) => ({
        ...prev,
        isCreatingTokenSale: true,
      }))
      const txId =
        '0x8978e74a425212a30ef9328bef8ed9a6778233950c9f762a8e94f22f89e4e3af'
      const finalTxId =
        '0x8978e74a425212a30ef9328bef8ed9a6778233950c9f762a8e94f22f89e4e3af'

      setTxId(finalTxId)

      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          createTokenSaleTx: txId,
          isCreatingTokenSale: false,
          isCompleted: true,
        }))
      }, 3000)
    } catch (error: any) {
      console.error('Error when creating token sale', error)
      const metamaskError = getMetamaskError(error)
      setState((prev) => ({
        ...prev,
        error: metamaskError || '',
        isCreatingPool: false,
      }))
      if (metamaskError) {
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            error: '',
          }))
        }, 8000)
      }
    }
  }

  const onClick = () => {
    onCreateTokenSale()
  }

  return (
    <div className={classes.root}>
      <WarningInfo
        title="Important"
        description="This will transfer the tokens from your address to the Terminal contract. This action cannot be undone or reversed."
      />

      <Button
        className={classes.button}
        color="primary"
        fullWidth
        onClick={onClick}
        variant="contained"
      >
        {state.isCreatingTokenSale ? (
          <>
            <CircularProgress className={classes.progress} size={30} />
          </>
        ) : (
          'SELL TOKEN'
        )}
      </Button>
      <Button
        className={classes.button}
        color="secondary"
        fullWidth
        onClick={onClose}
        variant="contained"
      >
        CANCEL
      </Button>
    </div>
  )
}
