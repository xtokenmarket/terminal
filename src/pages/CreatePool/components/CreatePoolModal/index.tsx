import clsx from 'clsx'
import { makeStyles, Modal } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { ECreatePoolModalStep } from 'utils/enums'
import { CreatePoolSection, InitSection, SuccessSection } from './components'
import { ICreatePoolData } from 'types'
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
  poolData: ICreatePoolData
}

export const CreatePoolModal = (props: IProps) => {
  const history = useHistory()
  const classes = useStyles()
  const commonClasses = useCommonStyles()
  const { account } = useConnectedWeb3Context()

  const { onClose } = props
  const [step, setStep] = useState<ECreatePoolModalStep>(
    ECreatePoolModalStep.Init
  )
  const [poolAddress, setPoolAddress] = useState('')

  useEffect(() => {
    if (!account) {
      onClose()
    }
  }, [account])

  const onNextStep = () => {
    switch (step) {
      case ECreatePoolModalStep.Init:
        setStep(ECreatePoolModalStep.Create)
        break
      case ECreatePoolModalStep.Create:
        setStep(ECreatePoolModalStep.Success)
        break
      default:
        onClose()
    }
  }

  const onCreatePoolSectionClose = () => {
    setStep(ECreatePoolModalStep.Init)
    onClose()
  }

  const onSuccessClose = () => {
    history.push(`/terminal/pools/${poolAddress}`)
  }

  const renderContent = () => {
    switch (step) {
      case ECreatePoolModalStep.Init:
        return <InitSection onNext={onNextStep} onClose={onClose} />
      case ECreatePoolModalStep.Create:
        return (
          <CreatePoolSection
            onNext={onNextStep}
            poolData={props.poolData}
            setPoolAddress={setPoolAddress}
            onClose={onCreatePoolSectionClose}
          />
        )
      default:
        return (
          <SuccessSection onClose={onSuccessClose} poolData={props.poolData} />
        )
    }
  }

  return (
    <Modal open={props.isOpen}>
      <div
        className={clsx(
          classes.root,
          commonClasses.scroll,
          props.className,
          step === ECreatePoolModalStep.Success ? 'transparent' : ''
        )}
      >
        {renderContent()}
      </div>
    </Modal>
  )
}
