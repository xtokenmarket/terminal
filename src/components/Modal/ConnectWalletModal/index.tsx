import {
  makeStyles,
  CircularProgress,
  Modal,
  Typography,
} from '@material-ui/core'

import CloseIcon from '@material-ui/icons/Close'

import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { useWeb3React } from '@web3-react/core'
import { supportedNetworkIds } from 'config/networks'
import { ConnectWalletItem } from 'components/Button'
import {
  DEFAULT_NETWORK_ID,
  STORAGE_KEY_CONNECTOR,
  WALLET_ICONS,
} from 'config/constants'
import { useSnackbar } from 'notistack'
import React, { useEffect } from 'react'
import { ConnectorNames } from 'utils/enums'
import connectors from 'utils/connectors'
import { getLogger } from 'utils/logger'
import { transparentize } from 'polished'

const logger = getLogger('ConnectWalletModal::Index')

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    outline: 'none',
    backgroundColor: theme.colors.fifth,
    width: 400,
    borderRadius: theme.spacing(0.5),
    padding: `${theme.spacing(2)}px 0`,
    userSelect: `none`,
    position: 'relative',
    border: `1px solid ${transparentize(0.9, theme.colors.fifth)}`,
  },
  title: {
    color: theme.colors.white,
    padding: `0 ${theme.spacing(2)}px`,
    fontWeight: 'bold',
    fontSize: theme.spacing(2.5),
    marginBottom: theme.spacing(2),
  },
  bottom: {
    marginTop: theme.spacing(2),
    padding: `0 ${theme.spacing(2)}px`,
    textAlign: 'center',
    '& > * + *': { marginTop: theme.spacing(2) },
  },
  closeButton: {
    position: 'absolute',
    top: 21,
    right: 21,
    width: 24,
    height: 24,
    color: theme.colors.white,
    cursor: 'pointer',
    '& svg': { width: 24, height: 24 },
  },
  connectingText: {
    color: theme.colors.white,
  },
}))

interface IProps {
  visible: boolean
  onClose: () => void
}

export const ConnectWalletModal = (props: IProps) => {
  const context = useWeb3React()
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  const { onClose } = props

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>()

  useEffect(() => {
    if (activatingConnector && activatingConnector === context.connector) {
      setActivatingConnector(undefined)
      onClose()
    }
    // eslint-disable-next-line
  }, [activatingConnector, context.connector])

  if (context.error) {
    localStorage.removeItem(STORAGE_KEY_CONNECTOR)
    context.deactivate()
    onClose()
    logger.error('Error in web3 context', context.error)
  }

  const isMetamaskEnabled = 'ethereum' in window || 'web3' in window
  const isTrustWalletEnabled = isMetamaskEnabled && window.ethereum.isTrust

  const onClick = async (wallet: ConnectorNames) => {
    const currentConnector = connectors[wallet]
    if (currentConnector) {
      setActivatingConnector(currentConnector)
    }

    if (wallet) {
      if (
        currentConnector instanceof WalletConnectConnector &&
        currentConnector.walletConnectProvider?.wc?.uri
      ) {
        currentConnector.walletConnectProvider = undefined
      }

      try {
        if (window.ethereum) {
          const chainId = await window.ethereum.request({
            method: 'eth_chainId',
          })

          if (!supportedNetworkIds.includes(Number(chainId) as any)) {
            if (isTrustWalletEnabled) {
              enqueueSnackbar('Please switch to Binance Network', {
                variant: 'error',
              })
              onClose()
              return
            }

            try {
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${DEFAULT_NETWORK_ID.toString(16)}` }],
              })
            } catch (error: any) {
              console.error('Error while trying to switch to Mainnet')
              onClose()
              return
            }
          }
        }

        context.activate(currentConnector)
        localStorage.setItem(STORAGE_KEY_CONNECTOR, wallet)

        onClose()
      } catch (error) {
        onClose()
      }
    }
  }

  const isConnectingToWallet = !!activatingConnector
  let connectingText = `Connecting to wallet`
  const connectingToMetamask = activatingConnector === connectors.injected

  if (connectingToMetamask) {
    connectingText = 'Waiting for Approval on Metamask'
  }

  const disableMetamask: boolean = !isMetamaskEnabled || false

  const onClickCloseButton = () => {
    if (isConnectingToWallet) {
      return
    }
    onClose()
  }

  return (
    <>
      <Modal
        className={classes.modal}
        disableEnforceFocus
        onClose={onClickCloseButton}
        open={!context.account && props.visible}
      >
        <div className={classes.content}>
          {!isConnectingToWallet && (
            <span className={classes.closeButton} onClick={onClose}>
              <CloseIcon />
            </span>
          )}
          <Typography align="center" className={classes.title} component="h3">
            {connectingToMetamask ? 'Connecting...' : 'Connect'}
          </Typography>
          <div className={classes.bottom} id="wallets">
            {isConnectingToWallet ? (
              <>
                <CircularProgress color="primary" />
                <Typography className={classes.connectingText} color="primary">
                  {connectingText}
                </Typography>
              </>
            ) : (
              <>
                <ConnectWalletItem
                  disabled={disableMetamask}
                  icon={WALLET_ICONS[ConnectorNames.Injected]}
                  onClick={() => {
                    onClick(ConnectorNames.Injected)
                  }}
                  text="Metamask"
                />
                <ConnectWalletItem
                  icon={WALLET_ICONS[ConnectorNames.TrustWallet]}
                  onClick={() => {
                    onClick(ConnectorNames.TrustWallet)
                  }}
                  text="Trust Wallet"
                />
                <ConnectWalletItem
                  icon={WALLET_ICONS[ConnectorNames.WalletConnect]}
                  onClick={() => {
                    onClick(ConnectorNames.WalletConnect)
                  }}
                  text="Wallet Connect"
                />
                <ConnectWalletItem
                  icon={WALLET_ICONS[ConnectorNames.Coinbase]}
                  onClick={() => {
                    onClick(ConnectorNames.Coinbase)
                  }}
                  text="Coinbase"
                />
                <ConnectWalletItem
                  icon={WALLET_ICONS[ConnectorNames.UD]}
                  onClick={() => {
                    onClick(ConnectorNames.UD)
                  }}
                  text="Unstoppable Wallet"
                />
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  )
}
