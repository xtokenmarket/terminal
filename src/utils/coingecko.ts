import axios from 'axios'
import { COINGECKO_API_KEY, COINGECKO_URL } from 'config/constants'

export const getTokenLogo = async (
  address: string,
  network: string
): Promise<string | undefined> => {
  const url = `${COINGECKO_URL}/${network}/contract/${address}?x_cg_pro_api_key=${COINGECKO_API_KEY}`
  try {
    const { data: token } = await axios.get(url)
    return token.image.small
  } catch (err) {
    return undefined
  }
}
