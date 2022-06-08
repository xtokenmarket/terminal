import { makeStyles } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Modal } from 'components'
import { useConnectedWeb3Context } from 'contexts'
import { IOfferingOverview } from 'types'
import { EInvestModalStep } from 'utils/enums'
import { BigNumber } from 'ethers'
import { ZERO } from 'utils/number'

import { InputSection, InvestSection, SuccessSection } from './components'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

interface IProps {
  isWhitelist: boolean
  offerData: IOfferingOverview
  onClose: () => void
  onSuccess: () => Promise<void>
  open: boolean
  addressCap: BigNumber
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
  isWhitelist,
  offerData,
  onClose,
  onSuccess,
  open,
  addressCap,
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

  const onNextStep = () => {
    switch (state.step) {
      case EInvestModalStep.Input:
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
    switch (state.step) {
      case EInvestModalStep.Input:
        return (
          <InputSection
            onClose={_onClose}
            onNext={onNextStep}
            offerData={offerData}
            updateState={updateState}
          />
        )
      case EInvestModalStep.Invest:
        return (
          <InvestSection
            isWhitelist={isWhitelist}
            offerAmount={state.offerAmount}
            offerData={offerData}
            onNext={onNextStep}
            onClose={_onClose}
            updateState={updateState}
            maxContributionAmount={addressCap}
          />
        )
      default:
        return (
          <SuccessSection
            offerData={offerData}
            onClose={onSuccess}
            txHash={state.txHash}
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
