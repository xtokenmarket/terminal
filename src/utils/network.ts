import { Network } from './enums'
import { NetworkId } from 'types'
import { ChainId, DEFAULT_NETWORK, DEFAULT_NETWORK_ID } from 'config/constants'

export const getNetworkFromId = (networkId?: NetworkId) => {
  switch (networkId) {
    case ChainId.Mainnet:
      return Network.MAINNET
    case ChainId.Arbitrum:
      return Network.ARBITRUM
    case ChainId.Optimism:
      return Network.OPTIMISM
    case ChainId.Polygon:
      return Network.POLYGON
    // case ChainId.Rinkeby:
    //   return Network.RINKEBY
    case ChainId.Kovan:
      return Network.KOVAN
    default:
      return DEFAULT_NETWORK
  }
}

export const getIdFromNetwork = (network?: Network): ChainId => {
  switch (network) {
    case Network.MAINNET:
      return ChainId.Mainnet
    case Network.ARBITRUM:
      return ChainId.Arbitrum
    case Network.OPTIMISM:
      return ChainId.Optimism
    case Network.POLYGON:
      return ChainId.Polygon
    // case Network.RINKEBY:
    //   return ChainId.Rinkeby
    case Network.KOVAN:
      return ChainId.Kovan
    default:
      return DEFAULT_NETWORK_ID
  }
}

export const isTestnet = (chainId: ChainId): boolean => {
  return [ChainId.Kovan].includes(chainId)
}
