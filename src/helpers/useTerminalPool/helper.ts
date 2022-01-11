export const getCoinGeckoIDs = async (tokens: string[]) => {
  const url = 'https://api.coingecko.com/api/v3/coins/list'
  const response = await fetch(url)
  const coins = await response.json()
  if (coins.error) throw coins.error
  return tokens.map((token) => {
    const rateIds = []

    for (const coin of coins) {
      if (coin.symbol.toUpperCase() === token.toUpperCase())
        rateIds.push(coin.id)
    }
    return rateIds[0]
  })
}

export const getTokenExchangeRate = async (
  ids: string[],
  address?: string
): Promise<number[] | undefined> => {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids[0]}%2C${ids[1]}&vs_currencies=usd`
    const response = await fetch(url)
    const result = await response.json()

    const rate = [result[ids[0]].usd, result[ids[1]].usd]
    // note: In case there might be tokens have the same symbol
    // const coinAddress = result.contract_address;
    // if (
    // 	(coinAddress && coinAddress.toUpperCase() === address.toUpperCase())
    // ) {
    // 	return result.market_data.current_price.usd.toString(10);
    // }
    return rate
  } catch (error) {
    console.log(error)
  }
}
