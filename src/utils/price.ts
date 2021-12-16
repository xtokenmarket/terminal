import {
  priceToClosestTick,
  nearestUsableTick,
  encodeSqrtRatioX96,
  FeeAmount,
  TICK_SPACINGS,
} from "@uniswap/v3-sdk/dist/";
import { tickToPrice } from "@uniswap/v3-sdk";
import {
  Currency,
  CurrencyAmount,
  Token,
  TokenAmount,
  Price,
  ChainId,
} from "@uniswap/sdk-core";
import { parseUnits } from "@ethersproject/units";
import { JSBI } from "@uniswap/v2-sdk";
import { IToken } from "types";

// try to parse a user entered amount for a given token
export function tryParseAmount(
  value?: string,
  currency?: Currency
): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined;
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString();
    if (typedValueParsed !== "0") {
      return currency instanceof Token
        ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
        : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed));
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error);
  }
  // necessary for all paths to return a value
  return undefined;
}

function tryParseTick(
  baseToken?: Token,
  quoteToken?: Token,
  feeAmount?: FeeAmount,
  value?: string
): number | undefined {
  if (!baseToken || !quoteToken || !feeAmount || !value) {
    return undefined;
  }

  const amount = tryParseAmount(value, quoteToken);

  const amountOne = tryParseAmount("1", baseToken);

  if (!amount || !amountOne) return undefined;

  // parse the typed value into a price
  const price = new Price(baseToken, quoteToken, amountOne.raw, amount.raw);

  // this function is agnostic to the base, will always return the correct tick
  const tick = priceToClosestTick(price);

  return nearestUsableTick(tick, TICK_SPACINGS[feeAmount]);
}

function getTicksAndPrices(
  leftValue: any,
  rightValue: any,
  t0: IToken,
  t1: IToken,
  chainId: number
) {
  console.log(
    "getting lower and upper ticks for price range:",
    leftValue,
    rightValue
  );

  let token0 = new Token(chainId, t0.address, t0.decimals, t0.symbol, t0.name);
  let token1 = new Token(chainId, t1.address, t1.decimals, t1.symbol, t1.name);
  let feeAmount = FeeAmount.MEDIUM;

  let tickLower = tryParseTick(token0, token1, feeAmount, leftValue);
  let tickUpper = tryParseTick(token0, token1, feeAmount, rightValue);
  if (!tickLower || !tickUpper) {
    return;
  }
  let midTick = tickUpper - (tickUpper - tickLower) / 2;

  let priceLower = tickToPrice(token0, token1, tickLower);
  let priceUpper = tickToPrice(token0, token1, tickUpper);
  let midPrice = tickToPrice(token0, token1, midTick);

  let lowPriceInX96 = encodeSqrtRatioX96(
    priceLower.raw.numerator,
    priceLower.raw.denominator
  );
  let midPriceInX96 = encodeSqrtRatioX96(
    midPrice.raw.numerator,
    midPrice.raw.denominator
  );
  let highPriceInX96 = encodeSqrtRatioX96(
    priceUpper.raw.numerator,
    priceUpper.raw.denominator
  );

  console.log("low tick:", tickLower);
  //console.log('mid tick:', midTick);
  console.log("high tick:", tickUpper);

  console.log("let tickLower =", tickLower);
  //console.log('mid tick:', midTick);
  console.log("let tickUpper =", tickUpper);

  console.log("low price:", priceLower.toFixed(8));
  //console.log('mid price:', midPrice.toFixed(4));
  console.log("high price:", priceUpper.toFixed(8));

  console.log("low price x96:", lowPriceInX96.toString());
  //console.log('mid price x96:', midPriceInX96.toString());
  console.log("high price x96:", highPriceInX96.toString());
}

function getPriceInX96(
  price: string,
  t0: IToken,
  t1: IToken,
  chainId: number,
  feeAmount: number
) {
  let token0 = new Token(chainId, t0.address, t0.decimals, t0.symbol, t0.name);
  let token1 = new Token(chainId, t1.address, t1.decimals, t1.symbol, t1.name);

  let tick = tryParseTick(token0, token1, feeAmount, price);
  if (tick === undefined) {
    return "0";
  }
  let _price = tickToPrice(token0, token1, tick);
  let priceInX96 = encodeSqrtRatioX96(
    _price.raw.numerator,
    _price.raw.denominator
  );
  return priceInX96;
}

export { getTicksAndPrices, getPriceInX96 };
