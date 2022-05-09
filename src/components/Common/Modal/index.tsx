import React from 'react'
import { Modal as MaterialModal } from '@material-ui/core'

type IProps = React.PropsWithChildren<{
  onClose: () => void
  children: React.ReactElement
  disableBackdropClick?: boolean
  disableEscapeKeyDown?: boolean
  open: boolean
}> &
  React.HTMLAttributes<HTMLDivElement>

export const Modal: React.FC<IProps> = (props) => {
  const { open, disableEscapeKeyDown, onClose, disableBackdropClick, ...rest } =
    props

  const handleClose = (event: Event, reason: string) => {
    if (disableBackdropClick && reason === 'backdropClick') {
      return false
    }

    if (disableEscapeKeyDown && reason === 'escapeKeyDown') {
      return false
    }

    if (typeof onClose === 'function') {
      onClose()
    }
  }

  return (
    <MaterialModal
      onClose={handleClose}
      open={open}
      disableEscapeKeyDown={disableEscapeKeyDown}
      {...rest}
    >
      {props.children}
    </MaterialModal>
  )
}
