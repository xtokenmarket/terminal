import clsx from 'clsx'
import { makeStyles, Modal } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { EVestStep } from 'utils/enums'
import { InfoSection, SuccessSection, VestSection } from './components'
import { ITerminalPool } from 'types'
import { BigNumber } from '@ethersproject/bignumber'
import { ZERO } from 'utils/number'
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
  className?: string
  onClose: () => void
  poolData: ITerminalPool
  onSuccess: () => Promise<void>
}

export interface IVestState {
  step: EVestStep
  claimedEarn: BigNumber[]
  vestings: { amount: BigNumber; timestamp: BigNumber }[][]
  earned: BigNumber[]
}

export const VestModal = (props: IProps) => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()
  const { account } = useConnectedWeb3Context()

  const { onClose } = props
  const [state, setState] = useState<IVestState>({
    step: EVestStep.Input,
    earned: [],
    claimedEarn: [],
    vestings: [],
  })

  useEffect(() => {
    if (!account) {
      onClose()
    }
  }, [account])

  const updateState = (e: Partial<IVestState>) => {
    setState((prev) => ({ ...prev, ...e }))
  }

  const onNextStep = () => {
    switch (state.step) {
      case EVestStep.Input:
        setState((prev) => ({ ...prev, step: EVestStep.Vest }))
        break
      case EVestStep.Vest:
        setState((prev) => ({ ...prev, step: EVestStep.Success }))
        break
      default:
        onClose()
    }
  }

  const renderContent = () => {
    switch (state.step) {
      case EVestStep.Input:
        return (
          <InfoSection
            onNext={onNextStep}
            updateState={updateState}
            vestState={state}
            onClose={props.onClose}
            poolData={props.poolData}
          />
        )
      case EVestStep.Vest:
        return (
          <VestSection
            onNext={onNextStep}
            vestState={state}
            poolData={props.poolData}
            updateState={updateState}
          />
        )
      default:
        return (
          <SuccessSection
            onClose={props.onSuccess}
            vestState={state}
            poolData={props.poolData}
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
          state.step === EVestStep.Success ? 'transparent' : ''
        )}
      >
        {renderContent()}
      </div>
    </Modal>
  )
}
