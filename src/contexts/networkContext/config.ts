import { ChainId } from 'config/constants'

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
  ],
}

export const getConfig = (partialConfig?: Partial<Config>) => ({
  ...DEFAULT_CONFIG,
  ...partialConfig,
})
