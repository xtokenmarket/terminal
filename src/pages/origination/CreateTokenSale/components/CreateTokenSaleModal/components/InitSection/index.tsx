import { useEffect, useState } from 'react'
import { Button, CircularProgress, makeStyles } from '@material-ui/core'
import { WarningInfo } from 'components/Common/WarningInfo'
import { useConnectedWeb3Context } from 'contexts'
import { ICreateTokenSaleData } from 'types'
import { getDurationSec, getMetamaskError } from 'utils'
import { parseUnits } from 'ethers/lib/utils'
import { useServices } from 'helpers'
import { ZERO } from 'utils/number'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 32,
  },
  button: { height: 48, marginTop: 24 },
  progress: { color: theme.colors.white },
  warning: {
    color: theme.colors.warn,
    marginTop: 10,
    fontSize: 14,
  },
}))

interface IProps {
  onNext: () => void
  onClose: () => void
  data: ICreateTokenSaleData
  setTxId: (txId: string) => void
  setPoolAddress: (address: string) => void
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

  const { onNext, data, onClose, setTxId, setPoolAddress } = props
  const { originationService } = useServices()
  const { whitelistSale, publicSale, purchaseToken, offerToken } = data

  useEffect(() => {
    if (state.isCompleted) {
      onNext()
    }
  }, [onNext, state.isCompleted])

  const onCreateTokenSale = async () => {
    if (!account || !provider || !offerToken || !purchaseToken) {
      return
    }

    const publicSaleParams = publicSale.enabled
      ? {
          publicStartingPrice: parseUnits(
            publicSale.startingPrice,
            purchaseToken.decimals
          ),
          publicEndingPrice: parseUnits(
            publicSale.endingPrice,
            purchaseToken.decimals
          ),
          publicSaleDuration: getDurationSec(
            Number(publicSale.offeringPeriod),
            publicSale.offeringPeriodUnit.toString()
          ),
        }
      : {
          publicStartingPrice: ZERO,
          publicEndingPrice: ZERO,
          publicSaleDuration: ZERO,
        }

    const whitelistSaleParams = whitelistSale.enabled
      ? {
          whitelistStartingPrice: parseUnits(
            whitelistSale.startingPrice,
            purchaseToken.decimals
          ),
          whitelistEndingPrice: parseUnits(
            whitelistSale.endingPrice,
            purchaseToken.decimals
          ),
          whitelistSaleDuration: getDurationSec(
            Number(whitelistSale.offeringPeriod),
            whitelistSale.offeringPeriodUnit.toString()
          ),
        }
      : {
          whitelistStartingPrice: ZERO,
          whitelistEndingPrice: ZERO,
          whitelistSaleDuration: ZERO,
        }

    try {
      setState((prev) => ({
        ...prev,
        isCreatingTokenSale: true,
      }))

      const isCustomFeeEnabled = await originationService.isCustomFeeEnabled(
        account as string
      )

      let listingFee
      if (isCustomFeeEnabled) {
        listingFee = await originationService.getCustomFee(account as string)
      }

      const saleParams = {
        ...publicSaleParams,
        ...whitelistSaleParams,
        offerToken: offerToken.address,
        purchaseToken: purchaseToken.address,
        totalOfferingAmount: parseUnits(
          data.offerTokenAmount,
          offerToken.decimals
        ),
        reserveAmount: parseUnits(
          data.reserveOfferTokenAmount,
          purchaseToken.decimals
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

      const txId = await originationService.createFungibleListing(
        saleParams,
        listingFee
      )
      const finalTxId = await originationService.waitUntilCreateFungibleListing(
        account,
        txId
      )
      const poolAddress =
        await originationService.parseFungibleListingCreatedTx(finalTxId)
      setPoolAddress(poolAddress)
      setTxId(finalTxId)

      setState((prev) => ({
        ...prev,
        createTokenSaleTx: txId,
        isCreatingTokenSale: false,
        isCompleted: true,
      }))
    } catch (error) {
      console.error('Error when creating token offering', error)
      const metamaskError = getMetamaskError(error)
      setState((prev) => ({
        ...prev,
        error: metamaskError || '',
        isCreatingTokenSale: false,
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
        description="This will deploy your token offering contract. This action cannot be undone or reversed."
      />

      <Button
        id="createTokenSale"
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
          'DEPLOY PROGRAM'
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
      {state.error && <div className={classes.warning}>{state.error}</div>}
    </div>
  )
}
