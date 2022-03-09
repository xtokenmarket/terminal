import { BigNumber } from '@ethersproject/bignumber'
import { ConnectorNames, Network } from 'utils/enums'

import { ReactComponent as HomeIcon } from 'assets/svgs/home.svg'
import { ReactComponent as MarketIcon } from 'assets/svgs/market.svg'
import { ReactComponent as CafeIcon } from 'assets/svgs/cafe.svg'
import { ReactComponent as VoteIcon } from 'assets/svgs/vote.svg'
import { ReactComponent as TerminalIcon } from 'assets/svgs/terminal.svg'
import { ReactComponent as GithubIcon } from 'assets/svgs/github.svg'
import { ReactComponent as TwitterIcon } from 'assets/svgs/twitter.svg'
import { ReactComponent as DiscordIcon } from 'assets/svgs/discord.svg'
import { IToken } from 'types'

export const STORAGE_KEY_CONNECTOR = 'CONNECTOR'

export const LOGGER_ID = 'xToken-Terminal'

export const DEFAULT_NETWORK = Network.KOVAN
export const DEFAULT_NETWORK_ID = 42

export enum ChainId {
  Mainnet = 1,
  Arbitrum = 42161,
  Optimism = 10,
  Polygon = 137,
}

export enum TestChainId {
  EthereumKovan = 42,
  ArbitrumRinkeby = 421611,
  OptimismKovan = 69,
  PolygonMumbai = 80001,
}

export const CHAIN_NAMES: Record<ChainId, string> = {
  [ChainId.Mainnet]: 'Ethereum',
  [ChainId.Arbitrum]: 'Arbitrum',
  [ChainId.Optimism]: 'Optimism',
  [ChainId.Polygon]: 'Polygon',
}

export interface AddNetworkChainParameters {
  chainId: string // A 0x-prefixed hexadecimal string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string // 2-6 characters long
    decimals: 18
  }
  rpcUrls: string[]
  blockExplorerUrls?: string[]
  iconUrls?: string[] // Currently ignored.
}

export const CHAIN_PARAMS: Record<ChainId, AddNetworkChainParameters> = {
  [ChainId.Mainnet]: {
    chainId: `0x${ChainId.Mainnet.toString(16)}`,
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  [ChainId.Arbitrum]: {
    chainId: `0x${ChainId.Arbitrum.toString(16)}`,
    chainName: 'Arbitrum One',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io'],
  },
  [ChainId.Optimism]: {
    chainId: `0x${ChainId.Optimism.toString(16)}`,
    chainName: 'Optimism',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.optimism.io/'],
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
  },
  [ChainId.Polygon]: {
    chainId: `0x${ChainId.Polygon.toString(16)}`,
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com'],
  },
}

export const WALLET_ICONS: { [key in ConnectorNames]: string } = {
  [ConnectorNames.Injected]: '/assets/wallets/metamask-color.svg',
  [ConnectorNames.TrustWallet]: '/assets/wallets/trust-wallet.svg',
  [ConnectorNames.WalletConnect]: '/assets/wallets/wallet-connect.svg',
}

export const ETHER_DECIMAL = 18

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

export const FLEEK_STORAGE_API_KEY =
  process.env.REACT_APP_FLEEK_STORAGE_API_KEY || ''
export const FLEEK_STORAGE_API_SECRET =
  process.env.REACT_APP_FLEEK_STORAGE_API_SECRET || ''

export const PRESALE_ITEMS_PER_PAGE = 4
export const TOKENS_PER_PAGE = 10

export const PRICE_MULTIPLIER = BigNumber.from(1000000)
export const PRICE_DECIMALS = 6

export const MIN_START_TIME_DIFF = 10 * 60 // 10 mins
export const LIQUIDITY_LOCK_MIN_DURATION = 30 * 24 * 60 * 60 // 1 month

export const POLL_API_DATA = 60000 // 1 min

export const FLEEK_STORAGE_START_URL = 'https://storageapi.fleek.co/'
export const TERMINAL_API_URL = 'https://terminal-api-staging.link:3001/api'

export const SvgIcons = {
  home: HomeIcon,
  market: MarketIcon,
  cafe: CafeIcon,
  vote: VoteIcon,
  terminal: TerminalIcon,
  github: GithubIcon,
  twitter: TwitterIcon,
  discord: DiscordIcon,
}

export const LP_TOKEN_BASIC: IToken = {
  name: 'LP',
  symbol: '',
  decimals: ETHER_DECIMAL,
  image: '',
  address: '',
  price: '',
}

export const MINT_BURN_SLIPPAGE = BigNumber.from(100)

export const FEE_TIERS = [
  {
    value: BigNumber.from(500),
    label: 'Best for stable pairs',
  },
  {
    value: BigNumber.from(3000),
    label: 'Best for most pairs',
  },
  {
    value: BigNumber.from(10000),
    label: 'Best for exotic pairs',
  },
]
