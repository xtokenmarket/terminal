import { IToken } from "types"
import { isAddress } from "./tools"
import { getAddress } from 'ethers/lib/utils'

function _createTokenFilterFunction(search: string): (token: IToken) => boolean {
  const isSearchingAddress = isAddress(search)

  console.log(
    'isSearchingAddress:', isSearchingAddress,
    'search query:', search,
  )

  if (isSearchingAddress) {
    const searchAddress = getAddress(search)
    return ({ address }) => (address.toLowerCase() === searchAddress.toLowerCase())
  }

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0)

  if (lowerSearchParts.length === 0) return () => true

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)

    return lowerSearchParts.every((p) => p.length === 0 || sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p)))
  }

  return ({ name, symbol }): boolean => Boolean((symbol && matchesSearch(symbol)) || (name && matchesSearch(name)))
}

export function filterTokens(tokens: IToken[], search: string): IToken[] {
  const filterFn = _createTokenFilterFunction(search)
  return tokens.filter(filterFn)
}