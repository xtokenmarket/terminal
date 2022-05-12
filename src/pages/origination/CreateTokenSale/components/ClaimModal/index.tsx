import clsx from 'clsx'
import { makeStyles, Modal } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { EClaimModalStep } from 'utils/enums'
import { InitSection, SuccessSection } from './components'
import { IClaimData } from 'types'
import useCommonStyles from 'style/common'
import { useConnectedWeb3Context } from 'contexts'
import { useHistory } from 'react-router'

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
  data: IClaimData
}

export const ClaimModal = (props: IProps) => {
  const history = useHistory()
  const classes = useStyles()
  const commonClasses = useCommonStyles()
  const { account, networkId } = useConnectedWeb3Context()

  const { onClose, data } = props
  const [step, setStep] = useState<EClaimModalStep>(EClaimModalStep.Init)
  const [txId, setTxId] = useState('')

  useEffect(() => {
    if (!account) {
      onClose()
    }
  }, [account])

  const onNextStep = () => {
    switch (step) {
      case EClaimModalStep.Init:
        setStep(EClaimModalStep.Success)
        break
      default:
        onClose()
    }
  }

  const onCreateTokenSaleSectionClose = () => {
    setStep(EClaimModalStep.Init)
    onClose()
  }

  const onSuccessClose = () => {
    history.push('/origination')
  }

  const renderContent = () => {
    switch (step) {
      case EClaimModalStep.Init:
        return (
          <InitSection
            onNext={onNextStep}
            onClose={onClose}
            data={data}
            setTxId={setTxId}
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
          step === EClaimModalStep.Success ? 'transparent' : ''
        )}
      >
        {renderContent()}
      </div>
    </Modal>
  )
}
