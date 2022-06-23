import { useEffect, useReducer } from 'react'
import { Button, CircularProgress, makeStyles } from '@material-ui/core'
import { WarningInfo } from 'components/Common/WarningInfo'
import { useConnectedWeb3Context } from 'contexts'
import { IClaimData } from 'types'
import { useSnackbar } from 'notistack'
import { FungiblePoolService } from 'services'
import { useOriginationPool } from 'helpers'
import { useParams } from 'react-router-dom'
import { Network } from 'utils/enums'

type RouteParams = {
  network: string
  poolAddress: string
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 32,
  },
  button: { height: 48, marginTop: 24 },
  progress: { color: theme.colors.white },
}))

interface IProps {
  poolAddress: string
  onNext: () => void
  onClose: () => void
  setTxId: (id: string) => void
  data?: IClaimData
  isOwnerOrManager?: boolean
}

interface IState {
  isCompleted: boolean
  isClaiming: boolean
  poolAddress: string
}

export const InitSection = ({
  poolAddress,
  onNext,
  onClose,
  setTxId,
  isOwnerOrManager,
}: IProps) => {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const { account, library: provider } = useConnectedWeb3Context()
  const { network } = useParams<RouteParams>()
  const { loadInfo } = useOriginationPool(poolAddress, network as Network)

  const [state, setState] = useReducer(
    (prevState: IState, newState: Partial<IState>) => ({
      ...prevState,
      ...newState,
    }),
    {
      isCompleted: false,
      isClaiming: false,
      poolAddress: '',
    }
  )

  const fungibleOriginationPool = new FungiblePoolService(
    provider,
    account,
    poolAddress
  )

  useEffect(() => {
    if (state.isCompleted) {
      onNext()
    }
  }, [state.isCompleted, onNext])

  const onClaim = async () => {
    try {
      setState({ isClaiming: true })

      const txId = await fungibleOriginationPool[
        isOwnerOrManager ? 'claimPurchaseToken' : 'claimTokens'
      ]()

      let finalTxId = ''
      if (isOwnerOrManager) {
        finalTxId = await fungibleOriginationPool.waitUntilClaim(
          txId,
          isOwnerOrManager
        )
      }

      setTxId(isOwnerOrManager ? finalTxId : txId)

      setState({
        isClaiming: false,
        isCompleted: true,
      })

      await loadInfo()
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Transaction execution failed', {
        variant: 'error',
        autoHideDuration: 10000,
      })
      setState({ isClaiming: false })
    }
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
        onClick={() => onClaim()}
        variant="contained"
      >
        {state.isClaiming ? (
          <CircularProgress className={classes.progress} size={30} />
        ) : (
          'CLAIM TOKENS'
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
