import { makeStyles, Typography, IconButton, Button } from '@material-ui/core'
import { useConnectedWeb3Context } from 'contexts'
import { useState } from 'react'
import { FungiblePoolService } from 'services'
import { IOfferingOverview } from 'types'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'
import { TokenBalanceInput } from 'components'
import { ZERO } from 'utils/number'
import { BigNumber } from 'ethers'

const useStyles = makeStyles((theme) => ({
  root: {},
  header: {
    padding: 32,
    position: 'relative',
    paddingBottom: 16,
    display: 'flex',
    backgroundColor: theme.colors.primary500,
  },
  title: {
    color: theme.colors.white,
    fontWeight: 600,
    fontSize: 22,
    marginBottom: 8,
  },
  content: {
    padding: 32,
    paddingTop: 2,
    backgroundColor: theme.colors.primary400,
    width: 600,
    maxWidth: '90vw',
    minHeight: '20vh',
    maxHeight: '50vh',
  },
  warning: {
    padding: '16px !important',
    '& div': {
      '&:first-child': {
        marginTop: 0,
        marginRight: 16,
      },
      '& p': {
        fontSize: 14,
        marginTop: 3,
        '&:first-child': { fontSize: 16, marginTop: 0 },
      },
    },
  },
  actions: {
    marginTop: 32,
  },
  tokenIcon: {
    width: 24,
    height: 24,
    borderRadius: '50%',
  },
  closeButton: {
    padding: 0,
    color: theme.colors.white1,
    position: 'absolute',
    right: 24,
    top: 36,
    [theme.breakpoints.down('xs')]: {
      top: 12,
      right: 12,
    },
  },
  initiateBtn: {
    marginTop: 32,
  },
  progress: { color: theme.colors.white },
}))

interface IProps {
  onClose: () => void
  onNext: () => void
  offerData: IOfferingOverview
  updateState: (e: any) => void
}

interface IState {
  isEstimating: boolean
  offerAmount: BigNumber
  purchaseAmount: BigNumber
}

export const InputSection = (props: IProps) => {
  const classes = useStyles()
  const { account, library: provider } = useConnectedWeb3Context()
  const { offerData, onClose, onNext, updateState } = props

  const [state, setState] = useState<IState>({
    isEstimating: false,
    offerAmount: ZERO,
    purchaseAmount: ZERO,
  })

  const estimatePurchaseAmount = async (offerAmount: BigNumber) => {
    if (!account || !provider) {
      return
    }

    const fungiblePool = new FungiblePoolService(
      provider,
      account,
      offerData.poolAddress
    )

    const purchaseAmount = await fungiblePool.getPurchaseAmountFromOfferAmount(
      offerAmount
    )
    setState((prevState) => ({
      ...prevState,
      isEstimating: false,
      offerAmount,
      purchaseAmount,
    }))
  }

  const _onInvest = () => {
    updateState({
      offerAmount: state.offerAmount,
      purchaseAmount: state.purchaseAmount,
    })
    onNext()
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>Invest</Typography>
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
      </div>
      <div className={classes.content}>
        <div>
          <TokenBalanceInput
            label={'Amount to Invest'}
            onChange={estimatePurchaseAmount}
            setLoadingStart={() =>
              setState((prev) => ({ ...prev, isEstimating: true }))
            }
            showSwapCTA={false}
            token={offerData.offerToken}
            value={state.offerAmount}
          />
          <TokenBalanceInput
            isDisabled
            label={'Estimated Amount to Receive'}
            loading={state.isEstimating}
            onChange={() => undefined}
            showAvailableBalance={false}
            showSwapCTA={false}
            token={offerData.purchaseToken}
            value={state.purchaseAmount}
          />
        </div>
        <div className={classes.actions}>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            className={classes.initiateBtn}
            onClick={_onInvest}
            disabled={
              state.offerAmount.isZero() || state.purchaseAmount.isZero()
            }
          >
            INVEST
          </Button>
        </div>
      </div>
    </div>
  )
}
