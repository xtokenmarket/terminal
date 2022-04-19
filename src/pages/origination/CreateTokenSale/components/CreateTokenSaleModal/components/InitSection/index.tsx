import { useEffect, useState } from 'react'
import { Button, CircularProgress, makeStyles } from '@material-ui/core'
import { WarningInfo } from 'components/Common/WarningInfo'
import { getContractAddress } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { OriginationService } from 'services/origination'
import { ICreateTokenSaleData } from 'types'
import { getDurationSec, getMetamaskError } from 'utils'
import { parseUnits } from 'ethers/lib/utils'

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

  const { account, library: provider } = useConnectedWeb3Context()

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

      const saleParams = {
        offerToken: data.offerToken?.address as string,
        purchaseToken: data.purchaseToken?.address as string,
        startingPrice: parseUnits(
          data.startingPrice,
          data.purchaseToken?.decimals
        ),
        endingPrice: parseUnits(data.endingPrice, data.purchaseToken?.decimals),
        saleDuration: getDurationSec(
          data.offeringPeriod,
          data.offeringPeriodUnit.toString()
        ),

        totalOfferingAmount: parseUnits(
          data.offerTokenAmount,
          data.offerToken?.decimals
        ),
        reserveAmount: parseUnits(
          data.reserveOfferTokenAmount,
          data.offerToken?.decimals
        ),
        vestingPeriod: getDurationSec(
          Number(data.vestingPeriod),
          data.vestingPeriodUnit.toString()
        ),
        cliffPeriod: getDurationSec(
          Number(data.cliffPeriod),
          data.cliffPeriodUnit.toString()
        ),
      }

      const originationAddress = getContractAddress(
        'origination',
        provider.network.chainId
      )

      const origination = new OriginationService(
        provider,
        account,
        originationAddress
      )

      const txId = await origination.createFungibleListing(saleParams)
      const finalTxId = await origination.waitUntilCreateFungibleListing(txId)
      setTxId(finalTxId)

      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          createTokenSaleTx: txId,
          isCreatingTokenSale: false,
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
