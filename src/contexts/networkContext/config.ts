import { ChainId, TestChainId } from 'config/constants'

export interface Config {
  supportedChains: ChainId[]
  supportedTestChains: TestChainId[]
}

const DEFAULT_CONFIG: Config = {
  supportedChains: [
    ChainId.Mainnet,
    ChainId.Arbitrum,
    ChainId.Optimism,
    ChainId.Polygon,
  ],
  supportedTestChains: [
    TestChainId.EthereumKovan,
    TestChainId.ArbitrumRinkeby,
    TestChainId.OptimismKovan,
    TestChainId.PolygonMumbai,
  ],
}

export const getConfig = (partialConfig?: Partial<Config>) => ({
  ...DEFAULT_CONFIG,
  ...partialConfig,
})
