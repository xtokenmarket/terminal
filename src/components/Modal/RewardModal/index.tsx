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
import useCommonStyles from 'style/common'
import { useConnectedWeb3Context } from 'contexts'
import { ZERO } from 'utils/number'

export const DEFAULT_REWARD_STATE = {
  amounts: [],
  duration: '',
  errors: [],
  step: ERewardStep.Input,
  tokens: [],
  vesting: '',
}

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
  className?: string
  isCreatePool: boolean
  isInitiateRewardsPending?: boolean
  isOpen: boolean
  onClose: () => void
  onCreateReward?: (state: IRewardState) => void
  onSuccess: () => Promise<void>
  poolData?: ITerminalPool
}

export interface IRewardState {
  amounts: BigNumber[]
  duration: string
  errors: (string | null)[]
  step: ERewardStep
  tokens: IToken[]
  vesting: string
}

export const RewardModal: React.FC<IProps> = ({
  isCreatePool,
  isInitiateRewardsPending = false,
  isOpen,
  className,
  onClose,
  onCreateReward,
  onSuccess,
  poolData,
}) => {
  const cl = useStyles()
  const commonClasses = useCommonStyles()
  const { account } = useConnectedWeb3Context()

  const [state, setState] = useState<IRewardState>({
    ...DEFAULT_REWARD_STATE,
    amounts: poolData?.rewardTokens.map(() => ZERO) || [],
    errors: poolData?.rewardTokens.map(() => 'Amount is 0') || [],
    tokens: poolData?.rewardTokens || [],
    vesting: poolData?.vestingPeriod.toString() || '',
  })

  const updateState = (e: Partial<IRewardState>) => {
    setState((prev) => ({ ...prev, ...e }))
  }

  const _onClose = () => {
    updateState(DEFAULT_REWARD_STATE)
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
        if (isCreatePool && onCreateReward) {
          onCreateReward(state)
          setState((prev) => ({ ...prev, step: ERewardStep.Input }))
        } else {
          setState((prev) => ({ ...prev, step: ERewardStep.Success }))
        }
        break
      default:
        _onClose()
    }
  }

  const goBack = () =>
    setState((prev) => ({ ...prev, step: ERewardStep.Input }))

  const renderContent = () => {
    switch (state.step) {
      case ERewardStep.Input:
        return (
          <InputSection
            isCreatePool={isCreatePool}
            isInitiateRewardsPending={isInitiateRewardsPending}
            onNext={onNextStep}
            updateState={updateState}
            rewardState={state}
            onClose={_onClose}
          />
        )
      case ERewardStep.Confirm:
        return (
          <ConfirmSection
            isCreatePool={isCreatePool}
            onNext={onNextStep}
            rewardState={state}
            updateState={updateState}
            goBack={goBack}
            onClose={_onClose}
          />
        )
      case ERewardStep.Initiate:
        return (
          <RewardSection
            isCreatePool={isCreatePool}
            onNext={onNextStep}
            poolAddress={poolData?.address as string}
            rewardState={state}
            updateState={updateState}
          />
        )
      default:
        return <SuccessSection onClose={onSuccess} rewardState={state} />
    }
  }

  return (
    <Modal open={isOpen} className={cl.modal}>
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
