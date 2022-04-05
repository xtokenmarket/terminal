import Abi from 'abis'
import { MulticallService } from 'services'
import { ChainId, COINGECKO_CHAIN_IDS } from 'config/constants'
import { isAddress } from 'ethers/lib/utils'
import { IToken } from 'types'
import { getTokenLogo } from './coingecko'
import { isContract } from './tools'
import { Web3Provider } from '@ethersproject/providers'

export const getSortedToken = (tokenA: string, tokenB: string) => {
  const tA = tokenA.toLowerCase()
  const tB = tokenB.toLowerCase()

  return tA < tB ? [tA, tB] : [tB, tA]
}

export async function fetchUnknownToken(
  provider: Web3Provider | undefined,
  chainId: ChainId,
  address: string,
  multicall: MulticallService
): Promise<IToken | false> {
  if (!isAddress(address)) return false

  const isTokenContract = await isContract(provider, address)
  if (!isTokenContract) return false

  try {
    const calls = ['name', 'symbol', 'decimals'].map((method) => ({
      name: method,
      address: address,
      params: [],
    }))
    const [[name], [symbol], [decimals]] = await multicall.multicallv2(
      Abi.ERC20,
      calls,
      {
        requireSuccess: false,
      }
    )
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
