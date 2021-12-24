import {
  ChainId,
  Currency,
  CurrencyAmount,
  ETHER,
  Token,
  TokenAmount,
  WETH9,
} from "@uniswap/sdk-core";
import { supportedNetworkIds } from "config/networks";

export function wrappedCurrency(
  currency: Currency | undefined,
  chainId: ChainId | undefined
): Token | undefined {
  return chainId && currency === ETHER
    ? WETH9[chainId]
    : currency instanceof Token
    ? currency
    : undefined;
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: ChainId | undefined
): TokenAmount | undefined {
  const token =
    currencyAmount && chainId
      ? wrappedCurrency(currencyAmount.currency, chainId)
      : undefined;
  return token && currencyAmount
    ? new TokenAmount(token, currencyAmount.raw)
    : undefined;
}

export function unwrappedToken(token: Token): Currency {
  const formattedChainId = (supportedNetworkIds as any).includes(token.chainId)
    ? token.chainId
    : undefined;
  if (formattedChainId && token.equals((WETH9 as any)[formattedChainId]))
    return ETHER;
  return token;
}
