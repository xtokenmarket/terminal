import clsx from 'clsx'
import { makeStyles, Modal } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { EWithdrawStep } from 'utils/enums'
import { UnstakeSection, InputSection, SuccessSection } from './components'
import { ITerminalPool, PoolService } from 'types'
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

export interface IUnstakeState {
  step: EWithdrawStep
  lpInput: BigNumber
  amountWithdrawn: BigNumber
  claimedEarn: BigNumber[]
  withdrawOnly: boolean
}

export const UnstakeModal = (props: IProps) => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()
  const { account } = useConnectedWeb3Context()

  const { className, clrService, poolData, onClose, onSuccess } = props
  const [state, setState] = useState<IUnstakeState>({
    step: EWithdrawStep.Input,
    lpInput: ZERO,
    amountWithdrawn: ZERO,
    claimedEarn: [],
    withdrawOnly: false,
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
      case EWithdrawStep.Input:
        setState((prev) => ({ ...prev, step: EWithdrawStep.Withdraw }))
        break
      case EWithdrawStep.Withdraw:
        setState((prev) => ({ ...prev, step: EWithdrawStep.Success }))
        break
      default:
        onClose()
    }
  }

  const goBack = () =>
    setState((prev) => ({ ...prev, step: EWithdrawStep.Input }))

  const renderContent = () => {
    switch (state.step) {
      case EWithdrawStep.Input:
        return (
          <InputSection
            onNext={onNextStep}
            updateState={updateState}
            unstakeState={state}
            onClose={onClose}
            clrService={clrService}
            poolData={poolData}
          />
        )
      case EWithdrawStep.Withdraw:
        return (
          <UnstakeSection
            onNext={onNextStep}
            unstakeState={state}
            clrService={clrService}
            poolData={poolData}
            updateState={updateState}
            goBack={goBack}
            onClose={onClose}
          />
        )
      default:
        return (
          <SuccessSection
            onClose={onSuccess}
            unstakeState={state}
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
          className,
          state.step === EWithdrawStep.Success ? 'transparent' : ''
        )}
      >
        {renderContent()}
      </div>
    </Modal>
  )
}
