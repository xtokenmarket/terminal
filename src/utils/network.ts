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
    case ChainId.Kovan:
      return Network.KOVAN
    case ChainId.Goerli:
      return Network.GOERLI
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
    case Network.KOVAN:
      return ChainId.Kovan
    case Network.GOERLI:
      return ChainId.Goerli
    default:
      return DEFAULT_NETWORK_ID
  }
}

export const isTestNetwork = (network?: Network): boolean =>
  !!network && [Network.KOVAN, Network.GOERLI].includes(network)

export const isTestnet = (chainId: ChainId): boolean => {
  return [ChainId.Kovan, ChainId.Goerli].includes(chainId)
}
