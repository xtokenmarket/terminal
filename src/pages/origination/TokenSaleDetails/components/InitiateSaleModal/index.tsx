import { makeStyles } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Modal } from 'components'
import { InitiateSection, SuccessSection } from './components'
import useCommonStyles from 'style/common'
import { useConnectedWeb3Context } from 'contexts'
import { IOfferingOverview } from 'types'

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
}

export interface IState {
  errorMessage: string
  isInitiated: boolean
  txHash: string
}

const DEFAULT_STATE = {
  errorMessage: '',
  isInitiated: false,
  txHash: '',
}

export const InitiateSaleModal: React.FC<IProps> = ({
  offerData,
  onClose,
  onSuccess,
  open,
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

  return (
    <Modal
      open={open}
      onClose={_onClose}
      className={classes.modal}
      disableBackdropClick
      disableEscapeKeyDown
    >
      {!state.isInitiated ? (
        <InitiateSection
          onClose={_onClose}
          offerData={offerData}
          updateState={updateState}
        />
      ) : (
        <SuccessSection
          offerData={offerData}
          onClose={onSuccess}
          txHash={state.txHash}
        />
      )}
    </Modal>
  )
}
