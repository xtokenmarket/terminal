import { BigNumber } from '@ethersproject/bignumber'
import { ConnectorNames, Network } from 'utils/enums'
import { ReactComponent as AuctionIcon } from 'assets/svgs/auction.svg'
import { ReactComponent as DiscordIcon } from 'assets/svgs/discord.svg'
import { ReactComponent as GithubIcon } from 'assets/svgs/github.svg'
import { ReactComponent as HomeIcon } from 'assets/svgs/home.svg'
import { ReactComponent as MiningIcon } from 'assets/svgs/mining.svg'
import { ReactComponent as NativeIcon } from 'assets/svgs/native.svg'
import { ReactComponent as OriginationIcon } from 'assets/svgs/origination.svg'
import { ReactComponent as TwitterIcon } from 'assets/svgs/twitter.svg'
import { IToken } from 'types'

// Enable testnet chain support for Vercel deployment
export const IS_PROD =
  process.env.NODE_ENV === 'production' &&
  window.location.href.indexOf('xtokenterminal') !== -1

export const STORAGE_KEY_CONNECTOR = 'CONNECTOR'

export const LOGGER_ID = 'terminal'

export const TERMINAL_API_URL = 'https://terminal.xtokenapi.link/api'
export const POLL_API_DATA = 120000 // 2 min

export const ETHER_DECIMAL = 18
export const MINT_BURN_SLIPPAGE = BigNumber.from(100)
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

export const LOCKED_STARTING_TIME = 'LOCKED_STARTING_TIME'

export const FIVE_MINUTES_IN_MS = 5 * 60 * 1000

export const ONE_HOUR_IN_MS = 1000 * 60 * 60
export const ONE_MINUTE_IN_MS = 1000 * 60

export enum ChainId {
  Mainnet = 1,
  Arbitrum = 42161,
  Optimism = 10,
  Polygon = 137,
  Kovan = 42,
  Goerli = 5,
}

export const CHAIN_NAMES: Record<ChainId, string> = {
  [ChainId.Mainnet]: 'Ethereum',
  [ChainId.Arbitrum]: 'Arbitrum',
  [ChainId.Optimism]: 'Optimism',
  [ChainId.Polygon]: 'Polygon',
  [ChainId.Kovan]: 'Kovan',
  [ChainId.Goerli]: 'Goerli',
}

export const CHAIN_ICONS: Record<ChainId, string> = {
  [ChainId.Mainnet]: 'Ethereum',
  [ChainId.Arbitrum]: 'Arbitrum',
  [ChainId.Optimism]: 'Optimism',
  [ChainId.Polygon]: 'Polygon',
  [ChainId.Kovan]: 'Ethereum',
  [ChainId.Goerli]: 'Ethereum',
}

export const COINGECKO_CHAIN_IDS: Record<ChainId, string> = {
  [ChainId.Mainnet]: 'ethereum',
  [ChainId.Arbitrum]: 'arbitrum-one',
  [ChainId.Optimism]: 'optimistic-ethereum',
  [ChainId.Polygon]: 'polygon-pos',
  [ChainId.Kovan]: Network.KOVAN,
  [ChainId.Goerli]: Network.GOERLI,
}

export const DEFAULT_NETWORK = Network.MAINNET
export const DEFAULT_NETWORK_ID = ChainId.Mainnet

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
  // Test Networks
  [ChainId.Kovan]: {
    chainId: `0x${ChainId.Kovan.toString(16)}`,
    chainName: 'Kovan Test Network',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: ['https://kovan.etherscan.io'],
  },
  [ChainId.Goerli]: {
    chainId: `0x${ChainId.Goerli.toString(16)}`,
    chainName: 'Goerli Test Network',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: ['https://goerli.etherscan.io'],
  },
}

export const WALLET_ICONS: { [key in ConnectorNames]: string } = {
  [ConnectorNames.Injected]: '/assets/wallets/metamask-color.svg',
  [ConnectorNames.TrustWallet]: '/assets/wallets/trust-wallet.svg',
  [ConnectorNames.WalletConnect]: '/assets/wallets/wallet-connect.svg',
  [ConnectorNames.Coinbase]: '/assets/wallets/coinbase.svg',
  [ConnectorNames.UD]: '/assets/wallets/ud-default.png',
}

export const SvgIcons = {
  auction: AuctionIcon,
  discord: DiscordIcon,
  github: GithubIcon,
  home: HomeIcon,
  mining: MiningIcon,
  native: NativeIcon,
  origination: OriginationIcon,
  twitter: TwitterIcon,
}

export const LP_TOKEN_BASIC: IToken = {
  name: 'LP',
  symbol: '',
  decimals: ETHER_DECIMAL,
  image: '',
  address: '',
  price: '',
}

export const FEE_TIERS = [
  {
    value: BigNumber.from(500),
    label: 'Best for stable pairs',
  },
  {
    value: BigNumber.from(3000),
    label: 'Best for many pairs',
  },
  {
    value: BigNumber.from(10000),
    label: 'Best for exotic pairs',
  },
]

const ETH_TIP =
  'Pool Deployment fee is 0.2 ETH. Additional 1% fee on any rewards distributed for this pool.'
const POLYGON_TIP =
  'Pool Deployment fee is 350 MATIC. Additional 1% fee on any rewards distributed for this pool.'

export const FEE_TIPS: Record<ChainId, string> = {
  [ChainId.Mainnet]: ETH_TIP,
  [ChainId.Arbitrum]: ETH_TIP,
  [ChainId.Optimism]: ETH_TIP,
  [ChainId.Polygon]: POLYGON_TIP,
  [ChainId.Kovan]: ETH_TIP,
  [ChainId.Goerli]: ETH_TIP,
}

export const PROD_TESTNET_DISCOVER_PAGE_SIZE = 5

export const INSUFFICIENT_FUNDS_ERROR =
  'Insufficient funds to process the transaction'

export const GRAPHQL_URLS: Record<Network, string> = {
  [Network.MAINNET]:
    'https://api.thegraph.com/subgraphs/name/xtokenmarket/terminal-mainnet',
  [Network.ARBITRUM]:
    'https://api.thegraph.com/subgraphs/name/xtokenmarket/terminal-arbitrum',
  [Network.OPTIMISM]:
    'https://api.thegraph.com/subgraphs/name/xtokenmarket/terminal-optimism',
  [Network.POLYGON]:
    'https://api.thegraph.com/subgraphs/name/xtokenmarket/terminal-polygon',
  [Network.KOVAN]:
    'https://api.thegraph.com/subgraphs/name/xtokenmarket/terminal-kovan',
  [Network.GOERLI]:
    'https://api.thegraph.com/subgraphs/name/xtokenmarket/terminal-goerli',
}

export const MINING_EVENTS = {
  Collect: 'Reinvest',
  Deposit: 'Deposit',
  InitiatedRewardsProgram: 'Initiate Rewards',
  RewardClaimed: 'Claim',
  Vested: 'Vest',
  Withdraw: 'Withdraw',
}
