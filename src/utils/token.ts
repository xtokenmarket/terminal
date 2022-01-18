import Abi from "abis"
import { Contract } from "ethers"
import { isAddress } from "ethers/lib/utils"
import { IToken } from "types"
import { isContract } from "./tools"

export const getSortedToken = (tokenA: string, tokenB: string) => {
  const tA = tokenA.toLowerCase()
  const tB = tokenB.toLowerCase()

  return tA < tB ? [tA, tB] : [tB, tA]
}

export async function fetchUnknownToken(provider: any, address: string): Promise<IToken | false> {
  if (!isAddress(address) || !isContract(provider, address)) return false
  
  try {
    const contract = new Contract(address, Abi.ERC20, provider)
    // TODO: Add multicall
    const name = await contract.name()
    const symbol = await contract.symbol()
    const decimals = await contract.decimals()
    const image = '/assets/tokens/unknown.png'
    const unknownToken: IToken = {
      name,
      symbol,
      address,
      decimals,
      image
    }
    return unknownToken
  } catch {
    return false
  }
}
