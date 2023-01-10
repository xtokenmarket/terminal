import { IconButton, makeStyles, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Modal } from 'components'
import { useConnectedWeb3Context } from 'contexts'
import { IUserPosition, IOfferingOverview, IWhitelistSale } from 'types'
import { EInvestModalStep } from 'utils/enums'
import { BigNumber } from 'ethers'
import { ZERO } from 'utils/number'

import {
  ApproveSection,
  InputSection,
  InvestSection,
  SuccessSection,
} from './components'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingTop: 2,
    backgroundColor: theme.colors.primary400,
    width: 600,
    maxWidth: '90vw',
    minHeight: '20vh',
    maxHeight: '50vh',
    textAlign: 'center',
    fontSize: '23px',
    fontWeight: 600,
    marginTop: '20p',
    color: theme.colors.white,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
}))

interface IProps {
  isBonding: boolean
  isWhitelist: boolean
  offerData: IOfferingOverview
  onClose: () => void
  onSuccess: () => Promise<void>
  open: boolean
  addressCap: BigNumber
  isSaleCompleted?: boolean
  whitelistData: IWhitelistSale
  userPositionData: IUserPosition
}

export interface IState {
  errorMessage: string
  isPurchased: boolean
  offerAmount: BigNumber
  purchaseAmount: BigNumber
  step: EInvestModalStep
  txHash: string
}

const DEFAULT_STATE = {
  errorMessage: '',
  isPurchased: false,
  offerAmount: ZERO,
  purchaseAmount: ZERO,
  step: EInvestModalStep.Input,
  txHash: '',
}

export const InvestModal: React.FC<IProps> = ({
  isBonding,
  isWhitelist,
  offerData,
  onClose,
  onSuccess,
  open,
  addressCap,
  isSaleCompleted,
  whitelistData,
  userPositionData,
}) => {
  const classes = useStyles()
  const { account } = useConnectedWeb3Context()

  const [state, setState] = useState<IState>(DEFAULT_STATE)

  useEffect(() => {
    if (!account) {
      onClose()
    }
  }, [account])

  const updateState = (e: any) => {
    setState((prev) => ({ ...prev, ...e }))
  }

  const _clearTxState = () => {
    setState(DEFAULT_STATE)
  }

  const _onClose = () => {
    _clearTxState()
    onClose()
  }

  const _onSuccess = () => {
    _clearTxState()
    onSuccess()
  }

  const onNextStep = () => {
    switch (state.step) {
      case EInvestModalStep.Input:
        setState((prev) => ({
          ...prev,
          step:
            offerData.purchaseToken.symbol === 'ETH'
              ? EInvestModalStep.Invest
              : EInvestModalStep.Approve,
        }))
        break
      case EInvestModalStep.Approve:
        setState((prev) => ({ ...prev, step: EInvestModalStep.Invest }))
        break
      case EInvestModalStep.Invest:
        setState((prev) => ({ ...prev, step: EInvestModalStep.Success }))
        break
      default:
        onClose()
    }
  }

  const renderContent = () => {
    if (isSaleCompleted) {
      return (
        <div>
          <div className={classes.header}>
            <Typography className={classes.title}>Invest</Typography>
            <IconButton className={classes.closeButton} onClick={onClose}>
              <CloseOutlinedIcon />
            </IconButton>
          </div>
          <div className={classes.content}>The sale has been ended. 😭</div>
        </div>
      )
    }
    switch (state.step) {
      case EInvestModalStep.Input:
        return (
          <InputSection
            onClose={_onClose}
            onNext={onNextStep}
            offerData={offerData}
            updateState={updateState}
            whitelistData={whitelistData}
            userPositionData={userPositionData}
            isBonding={isBonding}
            isWhitelist={isWhitelist}
          />
        )
      case EInvestModalStep.Approve:
        return (
          <ApproveSection
            onClose={_onClose}
            onNext={onNextStep}
            offerData={offerData}
            updateState={updateState}
            purchaseAmount={state.purchaseAmount}
            isBonding={isBonding}
          />
        )
      case EInvestModalStep.Invest:
        return (
          <InvestSection
            isWhitelist={isWhitelist}
            offerData={offerData}
            onNext={onNextStep}
            onClose={_onClose}
            updateState={updateState}
            maxContributionAmount={addressCap}
            purchaseAmount={state.purchaseAmount}
            isBonding={isBonding}
          />
        )
      default:
        return (
          <SuccessSection
            offerData={offerData}
            onClose={_onSuccess}
            txHash={state.txHash}
            purchaseAmount={state.purchaseAmount}
            offerAmount={state.offerAmount}
          />
        )
    }
  }

  return (
    <Modal
      open={open}
      onClose={_onClose}
      className={classes.modal}
      disableBackdropClick
      disableEscapeKeyDown
    >
      {renderContent()}
    </Modal>
  )
}
