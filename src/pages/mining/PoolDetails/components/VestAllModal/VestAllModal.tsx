import React, { useState } from 'react'
import {
  Modal,
  makeStyles,
  Typography,
  IconButton,
  Button,
  CircularProgress,
} from '@material-ui/core'
import CloseOutlined from '@material-ui/icons/CloseOutlined'
import { VestingToken } from 'types'
import { formatUnits } from 'ethers/lib/utils'
import { ViewTransaction } from 'components'
import { WarningInfo } from 'components/Common/WarningInfo'
import { useConnectedWeb3Context } from 'contexts'
import { useServices } from 'helpers'
import { TxState } from 'utils/enums'
import { toUsd, ZERO } from 'utils/number'

const ICON_SIZE = 150

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
    backgroundColor: theme.colors.primary500,
    outline: 'none',
    userSelect: 'none',
    overflowY: 'visible',
    padding: theme.spacing(3, 0),
    maxHeight: '80vh',
    width: '70vw',
    maxWidth: 600,
    [theme.breakpoints.down('xs')]: {
      width: '90vw',
    },
  },
  title: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(0, 3),
    color: theme.colors.white,
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
      marginBottom: theme.spacing(2),
      padding: theme.spacing(0, 2),
    },
  },
  subheader: {
    color: theme.colors.primary100,
    fontWeight: 700,
    fontSize: '12px',
    marginBottom: theme.spacing(1),
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 0,
    color: theme.colors.white1,
  },
  tokens: {
    backgroundColor: theme.colors.primary400,
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  token: {
    display: 'flex',
    alignItems: 'center',
    '& + &': {
      marginTop: 10,
    },
  },
  logo: {
    marginRight: theme.spacing(2),
  },
  amount: {
    color: theme.colors.white,
  },
  dollarAmount: {
    color: theme.colors.primary100,
    marginLeft: theme.spacing(2),
  },
  warning: {
    margin: theme.spacing(2),
    padding: '16px !important',
    '& div': {
      '&:first-child': {
        marginTop: 0,
        marginRight: 16,
      },
      '& p': {
        fontSize: 14,
        marginTop: 3,
        '&:first-child': { fontSize: 16, marginTop: 0 },
      },
    },
  },
  actions: {
    padding: theme.spacing(2),
  },
  bottomContent: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
  img: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    position: 'absolute',
    top: -ICON_SIZE / 2,
    left: `calc(50% - ${ICON_SIZE / 2}px)`,
  },
  successHeader: {
    paddingTop: theme.spacing(6),
    color: theme.colors.white,
    marginBottom: theme.spacing(2),
  },
}))

interface IProps {
  open: boolean
  onClose: () => void
  poolAddress: string
  reloadTerminalPool: (isReloadPool: boolean) => Promise<void>
  vestingTokens: VestingToken[]
}

export const VestAllModal: React.FC<IProps> = ({
  open,
  onClose,
  vestingTokens,
  poolAddress,
  reloadTerminalPool,
}) => {
  const cl = useStyles()
  const { account, library: provider } = useConnectedWeb3Context()
  const { rewardEscrow } = useServices()

  const [txState, setTxState] = useState<TxState>(TxState.None)
  const [vestTx, setVestTx] = useState('')
  const [vestedTokens, setVestedTokens] = useState<VestingToken[]>([])

  const readyToVest: { [key: string]: VestingToken } = {}
  vestingTokens.map((token) => {
    if (readyToVest[token.symbol.toLowerCase()]) {
      readyToVest[token.symbol.toLowerCase()].amount = readyToVest[
        token.symbol.toLowerCase()
      ].amount.add(token.amount)
    } else {
      readyToVest[token.symbol.toLowerCase()] = { ...token }
    }
  })

  const tokensToRender =
    txState === TxState.Complete ? vestedTokens : Object.values(readyToVest)

  const _clearTxState = () => {
    setVestTx('')
    setVestedTokens([])
    setTxState(TxState.None)
  }

  const _onClose = () => {
    if (txState === TxState.Complete) {
      _clearTxState()
    }
    onClose()
  }

  const onClickDone = async () => {
    _onClose()
    await reloadTerminalPool(true)
  }

  const onClickVest = async () => {
    if (!provider || !account) return

    try {
      setTxState(TxState.Confirming)

      const addresses = Object.values(readyToVest).map((token) => token.address)
      const txId = await rewardEscrow.vestAll(poolAddress, addresses)

      setTxState(TxState.InProgress)

      const finalTxId = await rewardEscrow.waitUntilVestAll(account, txId)
      const parsedLogs = await rewardEscrow.parseVestAllTx(finalTxId)
      const vestedTokens = Object.values(readyToVest).map((token) => ({
        ...token,
        amount: parsedLogs[token.address.toLowerCase()] || ZERO,
      }))

      setTxState(TxState.Complete)
      setVestTx(finalTxId)
      setVestedTokens(vestedTokens)
    } catch (error) {
      _clearTxState()
    }
  }

  const renderTopContent = () => {
    if (txState === TxState.Complete) {
      return (
        <>
          <img
            alt="check"
            src="/assets/icons/confirmed.png"
            className={cl.img}
          />
          <Typography variant="h2" className={cl.successHeader} align="center">
            Vested successfully!
          </Typography>
        </>
      )
    }

    return (
      <Typography className={cl.title} variant="h4">
        Vest rewards
      </Typography>
    )
  }

  const renderBottomContent = () => {
    if (txState === TxState.Complete) {
      return (
        <div className={cl.actions}>
          <div className={cl.bottomContent}>
            <ViewTransaction txId={vestTx} />
          </div>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={onClickDone}
          >
            DONE
          </Button>
        </div>
      )
    }
    const buttonContent = {
      [TxState.None]: 'Vest',
      [TxState.Confirming]: (
        <CircularProgress style={{ color: 'white' }} size={30} />
      ),
      [TxState.InProgress]: (
        <CircularProgress style={{ color: 'white' }} size={30} />
      ),
    }[txState]

    return (
      <div className={cl.bottomContent}>
        <Button
          fullWidth
          color="primary"
          variant="contained"
          disabled={txState !== TxState.None}
          onClick={onClickVest}
        >
          {buttonContent}
        </Button>
      </div>
    )
  }
  return (
    <Modal open={open} onClose={_onClose} className={cl.modal}>
      <div className={cl.content}>
        {txState === TxState.None && (
          <IconButton className={cl.closeButton} onClick={_onClose}>
            <CloseOutlined />
          </IconButton>
        )}

        {renderTopContent()}
        <div className={cl.tokens}>
          <Typography variant="subtitle2" className={cl.subheader}>
            {txState === TxState.Complete ? 'YOU VESTED' : 'AVAILABLE TO VEST'}
          </Typography>
          {tokensToRender.map((token, i) => {
            const amount = Number(formatUnits(token.amount, token.decimals))
            const price = toUsd(amount * Number(token.price))
            return (
              <div className={cl.token} key={i}>
                <img src={token.image} className={cl.logo} />
                <Typography variant="h2" className={cl.amount}>
                  {amount.toFixed(4)} {token.symbol}
                </Typography>
                <Typography variant="h5" className={cl.dollarAmount}>
                  ~ {price}
                </Typography>
              </div>
            )
          })}
        </div>
        {(txState === TxState.InProgress || txState === TxState.Confirming) && (
          <WarningInfo
            className={cl.warning}
            title="Warning"
            description="Please don't close this window until the process is complete"
          />
        )}
        {renderBottomContent()}
      </div>
    </Modal>
  )
}
