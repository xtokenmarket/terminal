import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { makeStyles, Modal } from '@material-ui/core'
import { EClaimModalStep } from 'utils/enums'
import { InitSection, SuccessSection } from './components'
import { IClaimData } from 'types'
import useCommonStyles from 'style/common'
import { useConnectedWeb3Context } from 'contexts'

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
  poolAddress: string
  className?: string
  isOpen: boolean
  onClose: () => void
  data?: IClaimData
  isOwnerOrManager?: boolean
  onClaimSuccess: () => void
  isClaimToken: boolean
}

export const ClaimModal = ({
  className,
  isOpen,
  onClose,
  data,
  poolAddress,
  isOwnerOrManager,
  onClaimSuccess,
  isClaimToken,
}: IProps) => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()
  const { account } = useConnectedWeb3Context()

  const [step, setStep] = useState<EClaimModalStep>(EClaimModalStep.Init)
  const [txId, setTxId] = useState('')

  useEffect(() => {
    if (!account) {
      onClose()
    }
  }, [account, onClose])

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

  const onSuccessSectionClose = () => {
    setStep(EClaimModalStep.Init)
    onClaimSuccess()
  }

  return (
    <Modal open={isOpen} onClose={onCreateTokenSaleSectionClose}>
      <div
        className={clsx(
          classes.root,
          commonClasses.scroll,
          className,
          step === EClaimModalStep.Success ? 'transparent' : ''
        )}
      >
        {step === EClaimModalStep.Init ? (
          <InitSection
            poolAddress={poolAddress}
            onNext={onNextStep}
            onClose={onClose}
            setTxId={setTxId}
            isOwnerOrManager={isOwnerOrManager}
            isClaimToken={isClaimToken}
          />
        ) : (
          <SuccessSection
            data={data}
            txId={txId}
            onClose={onSuccessSectionClose}
          />
        )}
      </div>
    </Modal>
  )
}
