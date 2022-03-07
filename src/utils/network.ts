import { Network } from './enums'
import { NetworkId } from 'types'
import { DEFAULT_NETWORK, DEFAULT_NETWORK_ID } from 'config/constants'

export const getNetworkFromId = (networkId?: NetworkId) => {
  switch (networkId) {
    case 1:
      return Network.MAINNET
    case 4:
      return Network.RINKEBY
    case 42:
      return Network.KOVAN
    default:
      return DEFAULT_NETWORK
  }
}

export const getIdFromNetwork = (network?: Network) => {
  switch (network) {
    case Network.MAINNET:
      return 1
    case Network.RINKEBY:
      return 4
    case Network.KOVAN:
      return 42
    default:
      return DEFAULT_NETWORK_ID
  }
}
