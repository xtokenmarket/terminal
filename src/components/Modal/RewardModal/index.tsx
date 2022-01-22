import clsx from 'clsx'
import { makeStyles, Modal } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { ERewardStep } from 'utils/enums'
import {
  RewardSection,
  InputSection,
  SuccessSection,
  ConfirmSection,
} from './components'
import { ITerminalPool, IToken } from 'types'
import { BigNumber } from '@ethersproject/bignumber'
import { ZERO } from 'utils/number'
import useCommonStyles from 'style/common'
import { useConnectedWeb3Context } from 'contexts'
import { useTokenBalance } from 'helpers'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
    outline: 'none',
    userSelect: 'none',
    width: 700,
    maxWidth: '90vw',
    height: '80vh',
    overflowY: 'scroll',
    backgroundColor: theme.colors.primary500,
    display: 'flex',
    flexDirection: 'column',
    '&.transparent': {
      backgroundColor: theme.colors.transparent,
    },
  },
}))

interface IProps {
  open: boolean
  onClose: () => void
  onSuccess: () => Promise<void>
  poolAddress?: string
  className?: string
  onTokensChanged?: (
    amounts: BigNumber[],
    tokens: IToken[],
    errors: (string | null)[],
  ) => void
}

export interface IRewardState {
  step: ERewardStep
  period: string
  amounts: BigNumber[]
  tokens: IToken[]
  errors: (string | null)[]
}

export const RewardModal: React.FC<IProps> = ({
  open,
  className,
  onClose,
  onSuccess,
  poolAddress,
  onTokensChanged,

}) => {
  const cl = useStyles()
  const commonClasses = useCommonStyles()
  const { account } = useConnectedWeb3Context()

  const [state, setState] = useState<IRewardState>({
    step: ERewardStep.Input,
    period: '',
    amounts: [],
    tokens: [],
    errors: [],
  })

  const updateState = (e: Partial<IRewardState>) => {
    setState((prev) => ({ ...prev, ...e }))
  }

  useEffect(() => {
    if (onTokensChanged) {
      onTokensChanged(state.amounts, state.tokens, state.errors)
    }
  }, [state])

  const _onClose = () => {
    // updateState({
    //   period: '',
    //   amounts: [],
    //   tokens: [],
    //   errors: [],
    // })
    onClose()
  }

  useEffect(() => {
    if (!account) {
      _onClose()
    }
  }, [account])

  const onNextStep = () => {
    switch (state.step) {
      case ERewardStep.Input:
        setState((prev) => ({ ...prev, step: ERewardStep.Confirm }))
        break
      case ERewardStep.Confirm:
        setState((prev) => ({ ...prev, step: ERewardStep.Initiate }))
        break
      case ERewardStep.Initiate:
        setState((prev) => ({ ...prev, step: ERewardStep.Success }))
        break
      default:
        _onClose()
    }
  }

  // TODO: In case of create pool, don't initiate rewards
  const renderContent = () => {
    switch (state.step) {
      case ERewardStep.Input:
        return (
          <InputSection
            onNext={onNextStep} // TODO: Refactor to skip initiate rewards step
            updateState={updateState}
            rewardState={state}
            onClose={_onClose}
          />
        )
      case ERewardStep.Confirm:
        return (
          <ConfirmSection
            onNext={onNextStep}
            rewardState={state}
            updateState={updateState}
          />
        )
      case ERewardStep.Initiate:
        return (
          <RewardSection
            onNext={onNextStep}
            poolAddress={poolAddress as string}
            rewardState={state}
            updateState={updateState}
          />
        )
      default:
        return <SuccessSection onClose={onSuccess} rewardState={state} />
    }
  }

  return (
    <Modal open={open} className={cl.modal}>
      <div
        className={clsx(
          cl.content,
          commonClasses.scroll,
          className,
          state.step === ERewardStep.Success ? 'transparent' : ''
        )}
      >
        {renderContent()}
      </div>
    </Modal>
  )
}
