import Abi from 'abis'
import { MulticallService } from 'services'
import { ChainId, COINGECKO_CHAIN_IDS } from 'config/constants'
import { isAddress } from 'ethers/lib/utils'
import { IToken } from 'types'
import { getTokenLogo } from './coingecko'
import { isContract } from './tools'
import { Web3Provider } from '@ethersproject/providers'
import { BigNumber } from 'ethers'

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
    const [[[name], [symbol], [decimals]], logo] = await Promise.all([
      multicall.multicallv2(Abi.ERC20, calls, {
        requireSuccess: false,
      }),
      getTokenLogo(address, COINGECKO_CHAIN_IDS[chainId]),
    ])
    const image = logo ?? '/assets/tokens/unknown.png'

    return {
      name,
      symbol,
      address,
      decimals,
      image,
    } as IToken
  } catch {
    return false
  }
}

export const parseTokenDetails = (token: any, balance?: string) => {
  return {
    address: token.id,
    decimals: token.decimals,
    name: token.name,
    symbol: token.symbol,
    balance: balance ? BigNumber.from(balance) : undefined,
  }
}
