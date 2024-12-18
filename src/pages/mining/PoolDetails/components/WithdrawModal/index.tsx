import clsx from 'clsx'
import { makeStyles, Modal } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { EWithdrawStep } from 'utils/enums'
import { WithdrawSection, InputSection, SuccessSection } from './components'
import { ITerminalPool, PoolService } from 'types'
import { BigNumber } from '@ethersproject/bignumber'
import { ZERO } from 'utils/number'
import useCommonStyles from 'style/common'
import { useConnectedWeb3Context } from 'contexts'
import { CLRService } from 'services'

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
  clrService: PoolService
  poolData: ITerminalPool
  onSuccess: () => Promise<void>
}

export interface IWithdrawState {
  step: EWithdrawStep
  lpInput: BigNumber
  amount0Estimation: BigNumber
  amount1Estimation: BigNumber
  amount0Withdrawn: BigNumber
  amount1Withdrawn: BigNumber
  liquidityWithdrawn: BigNumber
  claimedEarn: BigNumber[]
  withdrawOnly: boolean
}

export const WithdrawModal = (props: IProps) => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()
  const { account } = useConnectedWeb3Context()

  const { className, clrService, poolData, onClose, onSuccess } = props
  const [state, setState] = useState<IWithdrawState>({
    step: EWithdrawStep.Input,
    lpInput: ZERO,
    amount0Estimation: ZERO,
    amount1Estimation: ZERO,
    amount0Withdrawn: ZERO,
    amount1Withdrawn: ZERO,
    liquidityWithdrawn: ZERO,
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
            withdrawState={state}
            onClose={onClose}
            clrService={clrService}
            poolData={poolData}
          />
        )
      case EWithdrawStep.Withdraw:
        return (
          <WithdrawSection
            onNext={onNextStep}
            withdrawState={state}
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
            withdrawState={state}
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
