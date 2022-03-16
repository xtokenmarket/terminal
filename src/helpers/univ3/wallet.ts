import { Currency, CurrencyAmount, Token } from '@uniswap/sdk-core'
import Abi from 'abis'
import { useServices } from 'helpers'
import { useEffect, useMemo, useState } from 'react'
import { isAddress } from 'utils/tools'

const useETHBalances = (
  addresses?: (string | undefined)[]
): { [address: string]: CurrencyAmount<Currency> | undefined } => {
  const [state, setState] = useState<{
    [address: string]: CurrencyAmount<Currency> | undefined
  }>({})

  const { multicall } = useServices()

  useEffect(() => {
    const loadData = async () => {
      if (!addresses) {
        setState(() => ({}))
        return
      }

      const addrs = addresses.filter((addr) => isAddress(addr || ''))
      const calls = addrs.map((addr) => ({
        name: 'getEthBalance',
        address: multicall.address,
        params: [addr],
      }))

      try {
        const response = await multicall.multicallv2(Abi.Multicall, calls)
        const data: {
          [address: string]: CurrencyAmount<Currency> | undefined
        } = {}
        addrs.forEach((addr, index) => {
          data[addr || ''] = response[index][0]
        })
      } catch (error) {
        setState(() => ({}))
      }
    }
    loadData()
  }, [addresses])

  return state
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] {
  const [state, setState] = useState<{
    [address: string]: CurrencyAmount<Token> | undefined
  }>({})

  const { multicall } = useServices()

  const validatedTokens: Token[] = useMemo(
    () =>
      tokens?.filter((t?: Token): t is Token => isAddress(t?.address || '')) ??
      [],
    [tokens]
  )
  const validatedTokenAddresses = useMemo(
    () => validatedTokens.map((vt) => vt.address),
    [validatedTokens]
  )

  useEffect(() => {
    const loadData = async () => {
      if (!address || !tokens) {
        setState(() => ({}))
        return
      }

      const calls = validatedTokenAddresses.map((addr) => ({
        name: 'balanceOf',
        address: addr,
        params: [address],
      }))

      try {
        const response = await multicall.multicallv2(Abi.Multicall, calls)
        const data: {
          [address: string]: CurrencyAmount<Currency> | undefined
        } = {}
        validatedTokenAddresses.forEach((addr, index) => {
          data[addr] = response[index][0]
        })
      } catch (error) {
        setState(() => ({}))
      }
    }
    loadData()
  }, [address, tokens])

  return [state, false]
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount<Currency> | undefined)[] {
  const tokens = useMemo(
    () =>
      currencies?.filter(
        (currency): currency is Token => currency instanceof Token
      ) ?? [],
    [currencies]
  )

  const tokenBalances = useTokenBalances(account, tokens)
  const containsETH: boolean = useMemo(
    () => currencies?.some((currency) => currency?.isNative) ?? false,
    [currencies]
  )
  const ethBalance = useETHBalances(containsETH ? [account] : [])

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency) return undefined
        if (currency.isToken) return tokenBalances[currency.address]
        if (currency.isNative) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  )
}
