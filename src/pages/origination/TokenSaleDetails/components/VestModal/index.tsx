import { makeStyles } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Modal } from 'components'
import { InitiateSection, SuccessSection } from './components'
import { useConnectedWeb3Context } from 'contexts'
import { IMyPosition, IOfferingOverview } from 'types'
import { VestStep } from 'utils/enums'
import { InfoSection } from './components/InfoSection'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

interface IProps {
  offerData: IOfferingOverview
  onClose: () => void
  onSuccess: () => Promise<void>
  open: boolean
  myPositionData: IMyPosition
}

export interface VestState {
  errorMessage: string
  isInitiated: boolean
  txHash: string
  step: VestStep
}

const DEFAULT_STATE = {
  errorMessage: '',
  isInitiated: false,
  txHash: '',
  step: VestStep.Info,
}

export const VestModal: React.FC<IProps> = ({
  offerData,
  onClose,
  onSuccess,
  open,
  myPositionData,
}) => {
  const classes = useStyles()
  const { account } = useConnectedWeb3Context()

  const [state, setState] = useState<VestState>(DEFAULT_STATE)

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
      case VestStep.Info:
        setState((prev) => ({ ...prev, step: VestStep.Vest }))
        break
      case VestStep.Vest:
        setState((prev) => ({ ...prev, step: VestStep.Success }))
        break
      default:
        onClose()
    }
  }

  const renderContent = () => {
    switch (state.step) {
      case VestStep.Info:
        return (
          <InfoSection
            onClose={_onClose}
            offerData={offerData}
            onNext={onNextStep}
            vestState={state}
            myPositionData={myPositionData}
          />
        )
      case VestStep.Vest:
        return (
          <InitiateSection
            onClose={_onClose}
            offerData={offerData}
            updateState={updateState}
            onNext={onNextStep}
            myPositionData={myPositionData}
          />
        )
      default:
        return (
          <SuccessSection
            offerData={offerData}
            onClose={_onSuccess}
            txHash={state.txHash}
            vestState={state}
            myPositionData={myPositionData}
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
