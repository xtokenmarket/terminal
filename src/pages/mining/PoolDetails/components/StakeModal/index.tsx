import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { makeStyles, Modal } from '@material-ui/core'
import { EDepositStep } from 'utils/enums'
import {
  StakeSection,
  InitSection,
  InputSection,
  SuccessSection,
} from './components'
import { ITerminalPool } from 'types'
import { BigNumber } from '@ethersproject/bignumber'
import { ZERO } from 'utils/number'
import useCommonStyles from 'style/common'
import { useConnectedWeb3Context } from 'contexts'
import { SingleAssetPoolService } from 'services/singleAssetPoolService'

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
  onClose: () => void
  clrService: SingleAssetPoolService
  poolData: ITerminalPool
  onSuccess: () => Promise<void>
}

export interface IStakeState {
  step: EDepositStep
  amount: BigNumber
  // used
  errorMessage: (string | null)[]
  depositTx: string
}

export const StakeModal = (props: IProps) => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()
  const { account } = useConnectedWeb3Context()

  const { clrService, onClose, onSuccess, poolData } = props
  const [state, setState] = useState<IStakeState>({
    step: EDepositStep.Init,
    amount: ZERO,
    errorMessage: [],
    depositTx: '',
  })

  useEffect(() => {
    if (!account) {
      onClose()
    }
  }, [account])

  const updateState = (e: any) => {
    setState((prev) => ({ ...prev, ...e }))
  }

  const onNextStep = () => {
    switch (state.step) {
      case EDepositStep.Init:
        setState((prev) => ({ ...prev, step: EDepositStep.Input }))
        break
      case EDepositStep.Input:
        setState((prev) => ({ ...prev, step: EDepositStep.Deposit }))
        break
      case EDepositStep.Deposit:
        setState((prev) => ({ ...prev, step: EDepositStep.Success }))
        break
      default:
        onClose()
    }
  }

  const goBack = () =>
    setState((prev) => ({ ...prev, step: EDepositStep.Input }))

  const renderContent = () => {
    switch (state.step) {
      case EDepositStep.Init:
        return <InitSection onNext={onNextStep} onClose={props.onClose} />
      case EDepositStep.Input:
        return (
          <InputSection
            onNext={onNextStep}
            updateState={updateState}
            depositState={state}
            onClose={onClose}
            clrService={clrService}
            poolData={poolData}
          />
        )
      case EDepositStep.Deposit:
        return (
          <StakeSection
            onNext={onNextStep}
            depositState={state}
            clrService={clrService}
            poolData={poolData}
            updateState={updateState}
            onClose={onClose}
            goBack={goBack}
          />
        )
      default:
        return (
          <SuccessSection
            onClose={onSuccess}
            depositState={state}
            poolData={poolData}
          />
        )
    }
  }

  return (
    <Modal open>
      <div
        className={clsx(
          classes.root,
          commonClasses.scroll,
          props.className,
          state.step === EDepositStep.Success ? 'transparent' : ''
        )}
      >
        {renderContent()}
      </div>
    </Modal>
  )
}
