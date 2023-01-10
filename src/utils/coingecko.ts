import axios from 'axios'
import { TERMINAL_API_URL } from 'config/constants'
import { Network } from './enums'

export const getTokenLogo = async (
  address: string,
  network: string
): Promise<string | undefined> => {
  // Use fallback logo in case of testnet
  if ([Network.KOVAN, Network.GOERLI].includes(network as Network)) {
    return undefined
  }

  const url = `${TERMINAL_API_URL}/token/${address}/logo?network=${network}`
  try {
    const {
      data: { logo },
    } = await axios.get(url)
    return logo
  } catch (err) {
    return undefined
  }
}
