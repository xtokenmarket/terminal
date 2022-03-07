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
  price: ''
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
