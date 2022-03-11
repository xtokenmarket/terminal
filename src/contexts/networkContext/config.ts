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
    // Remove test nets if on production
    ...(IS_PROD ? [] : [ChainId.Kovan, ChainId.Rinkeby]),
  ],
}

export const getConfig = (partialConfig?: Partial<Config>) => ({
  ...DEFAULT_CONFIG,
  ...partialConfig,
})
