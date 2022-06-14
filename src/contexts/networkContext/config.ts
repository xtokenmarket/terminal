import { ChainId, IS_PROD } from 'config/constants'

export interface Config {
  supportedChains: ChainId[]
}

const DEFAULT_CONFIG: Config = {
  supportedChains: [
    ChainId.Mainnet,
    ChainId.Arbitrum,
    ChainId.Optimism,
    ChainId.Polygon,

    ChainId.Kovan,
    ChainId.Goerli,
    // Remove Rinkeby test net if on production
    ...(IS_PROD ? [] : [ChainId.Rinkeby]),
  ],
}

export const getConfig = (partialConfig?: Partial<Config>) => ({
  ...DEFAULT_CONFIG,
  ...partialConfig,
})
