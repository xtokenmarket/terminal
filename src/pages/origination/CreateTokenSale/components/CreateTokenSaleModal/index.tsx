import clsx from 'clsx'
import { makeStyles, Modal } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { ECreateTokenSaleModalStep } from 'utils/enums'
import { InitSection, SuccessSection } from './components'
import { ICreateTokenSaleData, NetworkId } from 'types'
import useCommonStyles from 'style/common'
import { useConnectedWeb3Context } from 'contexts'
import { useHistory } from 'react-router'
import { getNetworkFromId } from 'utils/network'
import { DEFAULT_NETWORK_ID } from 'config/constants'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    width: '90vw',
    maxWidth: 600,
    backgroundColor: theme.colors.primary500,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    maxHeight: '80vh',
    userSelect: 'none',
    overflowY: 'auto',
    '&.transparent': {
      backgroundColor: theme.colors.transparent,
    },
  },
}))

interface IProps {
  className?: string
  isOpen: boolean
  onClose: () => void
  data: ICreateTokenSaleData
}

export const CreateTokenSaleModal = (props: IProps) => {
  const history = useHistory()
  const classes = useStyles()
  const commonClasses = useCommonStyles()
  const { account, networkId } = useConnectedWeb3Context()

  const { onClose, data } = props
  const [step, setStep] = useState<ECreateTokenSaleModalStep>(
    ECreateTokenSaleModalStep.Init
  )
  const [txId, setTxId] = useState('')
  const [poolAddress, setPoolAddress] = useState('')

  useEffect(() => {
    if (!account) {
      onClose()
    }
  }, [account])

  const onNextStep = () => {
    switch (step) {
      case ECreateTokenSaleModalStep.Init:
        setStep(ECreateTokenSaleModalStep.Success)
        break
      default:
        onClose()
    }
  }

  const onCreateTokenSaleSectionClose = () => {
    setStep(ECreateTokenSaleModalStep.Init)
    onClose()
  }

  const onSuccessClose = () => {
    history.push(
      `/origination/offerings/${getNetworkFromId(
        (networkId || DEFAULT_NETWORK_ID) as NetworkId
      )}/${poolAddress}`
    )
  }

  const renderContent = () => {
    switch (step) {
      case ECreateTokenSaleModalStep.Init:
        return (
          <InitSection
            onNext={onNextStep}
            onClose={onClose}
            data={data}
            setTxId={setTxId}
            setPoolAddress={setPoolAddress}
          />
        )
      default:
        return (
          <SuccessSection
            onClose={onSuccessClose}
            data={props.data}
            txId={txId}
          />
        )
    }
  }

  return (
    <Modal open={props.isOpen} onClose={onCreateTokenSaleSectionClose}>
      <div
        className={clsx(
          classes.root,
          commonClasses.scroll,
          props.className,
          step === ECreateTokenSaleModalStep.Success ? 'transparent' : ''
        )}
      >
        {renderContent()}
      </div>
    </Modal>
  )
}
