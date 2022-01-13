import clsx from 'clsx'
import { makeStyles, Modal } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { ERewardStep } from 'utils/enums'
import { SuccessSection } from './components'
import { ITerminalPool, IToken } from 'types'
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
  token0: IToken
  token1: IToken
  visible: boolean
}

export const PairCreateModal: React.FC<IProps> = ({
  className,
  onClose,
  token0,
  token1,
  visible,
}) => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()
  const { account } = useConnectedWeb3Context()

  useEffect(() => {
    if (!account) {
      onClose()
    }
  }, [account])

  return (
    <Modal open={visible}>
      <div
        className={clsx(
          classes.root,
          commonClasses.scroll,
          className,
          'transparent'
        )}
      >
        <SuccessSection onClose={onClose} token0={token0} token1={token1} />
      </div>
    </Modal>
  )
}
