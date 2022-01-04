import clsx from 'clsx'
import {
  makeStyles,
  CircularProgress,
  Modal,
  Typography,
} from '@material-ui/core'

import { DEFAULT_NETWORK_ID } from 'config/constants'
import { getEtherscanUri } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { transparentize } from 'polished'
import React from 'react'

const useStyles = makeStyles((theme: any) => ({
  root: {
    position: 'absolute',
    width: 350,
    backgroundColor: theme.colors.white1,
    padding: theme.spacing(4),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    maxHeight: '80vh',
    userSelect: 'none',
    overflowY: 'auto',
    borderRadius: 12,
    textAlign: 'center',
    border: `1px solid ${transparentize(0.9, theme.colors.white)}`,
  },
  title: {
    fontSize: 20,
    color: theme.colors.default,
    marginBottom: 16,
  },
  instruction: {
    marginTop: 16,
    fontSize: 14,
    color: theme.colors.default,
  },
  txLink: {
    marginTop: 16,
    display: 'inline-block',
    fontSize: 16,
    color: theme.colors.default,
  },
  indicator: {
    color: transparentize(0.4, theme.colors.black1),
  },
}))

interface IProps {
  className?: string
  visible: boolean
  onClose: () => void
  title: string
  description: string
  txId: string
}

export const TransactionModal = (props: IProps) => {
  const classes = useStyles()
  const { description, title, txId, visible } = props
  const { networkId } = useConnectedWeb3Context()

  const etherscanUri = getEtherscanUri(networkId || DEFAULT_NETWORK_ID)
  return (
    <Modal open={visible}>
      <div className={clsx(classes.root, props.className)}>
        <Typography className={classes.title}>{title}</Typography>
        <CircularProgress
          className={classes.indicator}
          color="primary"
          size={40}
        />
        {description && (
          <Typography className={classes.instruction}>{description}</Typography>
        )}
        <br />
        {txId && (
          <a
            className={classes.txLink}
            href={`${etherscanUri}tx/${txId}`}
            rel="noreferrer"
            target="_blank"
          >
            View TX
          </a>
        )}
      </div>
    </Modal>
  )
}
