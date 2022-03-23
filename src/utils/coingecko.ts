import axios from 'axios'
import { TERMINAL_API_URL } from 'config/constants'

export const getTokenLogo = async (
  address: string,
  network: string
): Promise<string | undefined> => {
  const url = `${TERMINAL_API_URL}/token/${address}/logo?network=${network}`
  try {
    const { data: logo } = await axios.get(url)
    return logo
  } catch (err) {
    return undefined
  }
}
