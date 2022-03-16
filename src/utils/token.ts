import Abi from 'abis'
import { ChainId, COINGECKO_CHAIN_IDS } from 'config/constants'
import { Contract } from 'ethers'
import { isAddress } from 'ethers/lib/utils'
import { IToken } from 'types'
import { getTokenLogo } from './coingecko'
import { isContract } from './tools'

export const getSortedToken = (tokenA: string, tokenB: string) => {
  const tA = tokenA.toLowerCase()
  const tB = tokenB.toLowerCase()

  return tA < tB ? [tA, tB] : [tB, tA]
}

export async function fetchUnknownToken(
  provider: any,
  chainId: ChainId,
  address: string
): Promise<IToken | false> {
  if (!isAddress(address)) return false

  const isTokenContract = await isContract(provider, address)
  if (!isTokenContract) return false

  try {
    const contract = new Contract(address, Abi.ERC20, provider)
    // TODO: Add multicall
    const name = await contract.name()
    const symbol = await contract.symbol()
    const decimals = await contract.decimals()
    const logo = await getTokenLogo(address, COINGECKO_CHAIN_IDS[chainId])
    const image = logo ?? '/assets/tokens/unknown.png'
    const unknownToken: IToken = {
      name,
      symbol,
      address,
      decimals,
      image,
    }
    return unknownToken
  } catch {
    return false
  }
}
