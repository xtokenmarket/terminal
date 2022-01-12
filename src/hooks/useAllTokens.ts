import { DEFAULT_NETWORK_ID } from 'config/constants'
import { knownTokens, validNetworkId } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { IToken } from 'types'

export const useAllTokens: () => IToken[] = () => {
  const { networkId } = useConnectedWeb3Context()
  const fNetworkId = networkId || DEFAULT_NETWORK_ID
  const tokens = Object.values(knownTokens).map((tokenData) => {
    if (!validNetworkId(fNetworkId)) {
      throw new Error(`Unsupported network id: '${networkId}'`)
    }
    return {
      name: tokenData.name,
      symbol: tokenData.symbol,
      decimals: tokenData.decimals,
      address: tokenData.addresses[fNetworkId],
      image: tokenData.image,
    }
  })
  return tokens
}