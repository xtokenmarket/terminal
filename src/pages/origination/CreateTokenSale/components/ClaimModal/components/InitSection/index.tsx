import { useEffect, useState } from 'react'
import { Button, CircularProgress, makeStyles } from '@material-ui/core'
import { WarningInfo } from 'components/Common/WarningInfo'
import { useConnectedWeb3Context } from 'contexts'
import { IClaimData } from 'types'
import { getMetamaskError } from 'utils'
import { useServices } from 'helpers'

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
  data: IClaimData
  setTxId: (txId: string) => void
}

interface IState {
  isCompleted: boolean
  isClaiming: boolean
  claimTx: string
  error: string
  poolAddress: string
}

export const InitSection = (props: IProps) => {
  const classes = useStyles()

  const { account, library: provider } = useConnectedWeb3Context()

  const [state, setState] = useState<IState>({
    isCompleted: false,
    isClaiming: false,
    claimTx: '',
    error: '',
    poolAddress: '',
  })

  const { onNext, data, onClose, setTxId } = props
  const { originationService } = useServices()

  useEffect(() => {
    if (state.isCompleted) {
      onNext()
    }
  }, [state.isCompleted])

  const onClaim = async () => {
    if (!account || !provider) {
      return
    }
    console.log('onClaim 1')

    try {
      setState((prev) => ({
        ...prev,
        isClaiming: true,
      }))

      // const txId = await originationService.createFungibleListing()
      // const finalTxId = await originationService.waitUntilCreateFungibleListing(
      //   account,
      //   txId
      // )
      setTxId('finalTxId')
      console.log('onClaim 2')

      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          claimTx: 'txId',
          isClaiming: false,
          isCompleted: true,
        }))
      }, 3000)
    } catch (error) {
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
    onClaim()
  }

  return (
    <div className={classes.root}>
      <WarningInfo
        title="Important"
        // TODO: description need be updated to fit the claim action later
        description="This will transfer the tokens from your address to the Terminal contract. This action cannot be undone or reversed."
      />

      <Button
        className={classes.button}
        color="primary"
        fullWidth
        onClick={onClick}
        variant="contained"
      >
        {state.isClaiming ? (
          <>
            <CircularProgress className={classes.progress} size={30} />
          </>
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
