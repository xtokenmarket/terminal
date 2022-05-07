import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { ChainId } from 'config/constants'
import { supportedNetworkIds, supportedNetworkURLs } from 'config/networks'
import { UAuthConnector } from '@uauth/web3-react'
import UAuth from '@uauth/js'

const POLLING_INTERVAL = 12000

const injected = new InjectedConnector({
  supportedChainIds: supportedNetworkIds,
})

const walletconnect = new WalletConnectConnector({
  rpc: {
    [ChainId.Mainnet]: supportedNetworkURLs[ChainId.Mainnet],
    [ChainId.Arbitrum]: supportedNetworkURLs[ChainId.Arbitrum],
    [ChainId.Polygon]: supportedNetworkURLs[ChainId.Polygon],
    [ChainId.Optimism]: supportedNetworkURLs[ChainId.Optimism],
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  pollingInterval: POLLING_INTERVAL,
})

export const walletlink = new WalletLinkConnector({
  url: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  appName: 'xToken Terminal',
  supportedChainIds: supportedNetworkIds,
})

export const uauth = new UAuthConnector({
  uauth: new UAuth({
    clientID: process.env.REACT_APP_UD_CLIENT_ID as string,
    redirectUri: 'https://app.xtokenterminal.io',
    scope: 'openid wallet',
  }),

  // Injected and walletconnect connectors are required.
  connectors: { injected, walletconnect },
})

export default {
  injected,
  trustwallet: injected,
  walletconnect,
  coinbase: walletlink,
  uauth,
}
