import { Button, makeStyles } from '@material-ui/core'
import { WarningInfo } from 'components'
import { IOfferingOverview } from 'types'
import { useEffect, useReducer } from 'react'
import { useConnectedWeb3Context } from 'contexts'
import { FungiblePoolService } from 'services'
import { BigNumber } from 'ethers'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.primary500,
    padding: 32,
    width: 600,
  },
  button: { height: 48, marginTop: 24 },
}))

interface IProps {
  isWhitelist: boolean
  onNext: () => void
  onClose: () => void
  offerAmount: BigNumber
  offerData: IOfferingOverview
  updateState: (e: any) => void
  maxContributionAmount: BigNumber
  purchaseAmount: BigNumber
}

interface IState {
  isPurchased: boolean
  isPurchasing: boolean
  txHash: string
}

export const InvestSection = (props: IProps) => {
  const classes = useStyles()
  const { account, library: provider } = useConnectedWeb3Context()

  const {
    isWhitelist,
    offerAmount,
    offerData,
    onClose,
    onNext,
    updateState,
    maxContributionAmount,
    purchaseAmount,
  } = props

  const [state, setState] = useReducer(
    (prevState: IState, newState: Partial<IState>) => ({
      ...prevState,
      ...newState,
    }),
    {
      isPurchased: false,
      isPurchasing: false,
      txHash: '',
    }
  )

  useEffect(() => {
    if (state.isPurchased) {
      setTimeout(() => {
        updateState({ isPurchased: true, txHash: state.txHash })
        onNext()
      }, 2000)
    }
  }, [state.isPurchased])

  const onInvest = async () => {
    if (!account || !provider) {
      return
    }

    const fungiblePool = new FungiblePoolService(
      provider,
      account,
      offerData.poolAddress
    )

    try {
      setState({ isPurchasing: true })

      let txId
      if (isWhitelist) {
        txId = await fungiblePool.whitelistPurchase(
          account,
          offerData.poolAddress,
          purchaseAmount,
          maxContributionAmount
        )
      } else {
        txId = await fungiblePool.purchase(purchaseAmount)
      }

      const finalTxId = await fungiblePool.waitUntilPurchase(txId)

      setState({
        isPurchasing: false,
        isPurchased: true,
        txHash: finalTxId,
      })
    } catch (error) {
      console.error('Error when trying invest', error)
      setState({ isPurchasing: false })
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
        onClick={onInvest}
        variant="contained"
      >
        INVEST TOKEN
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
