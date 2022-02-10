import { Network } from './enums'
import { NetworkId } from 'types'

export const getNetworkFromId = (networkId: NetworkId) => {
  switch (networkId) {
    case 1:
      return Network.MAINNET
    case 42:
      return Network.KOVAN
  }
}
