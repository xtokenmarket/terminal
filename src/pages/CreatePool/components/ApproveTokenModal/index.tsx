import clsx from 'clsx'
import { makeStyles, Modal } from '@material-ui/core'
import React, { useEffect } from 'react'
import { ApproveTokenSection } from './components'
import { ICreatePoolData } from 'types'
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
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  poolData: ICreatePoolData
}

export const ApproveTokenModal = ({
  className,
  isOpen,
  onClose,
  onSuccess,
  poolData,
}: IProps) => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()
  const { account } = useConnectedWeb3Context()

  useEffect(() => {
    if (!account) {
      onClose()
    }
  }, [account])

  return (
    <Modal open={isOpen}>
      <div className={clsx(classes.root, commonClasses.scroll, className)}>
        <ApproveTokenSection onNext={onSuccess} poolData={poolData} />
      </div>
    </Modal>
  )
}
