import Abi from 'abis'
import { MulticallService } from 'services'
import { BigNumber } from 'ethers'

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

export const getPoolDataMulticall = async (
  poolAddress: string,
  multicall: MulticallService
) => {
  try {
    // console.time(`loadInfo multicall ${poolAddress}`)
    const calls = [
      'token0',
      'token1',
      'stakedToken',
      'tokenId',
      'tradeFee',
      'poolFee',
      'uniswapPool',
      'getRewardTokens',
      'rewardsDuration',
      'rewardsAreEscrowed',
      'owner',
      'periodFinish',
      'getTicks',
      'manager',
    ].map((method) => ({
      name: method,
      address: poolAddress,
      params: [],
    }))
    const [
      [token0Address],
      [token1Address],
      [stakedTokenAddress],
      [tokenId],
      [tradeFee],
      [poolFee],
      [uniswapPool],
      [rewardTokenAddresses],
      [rewardsDuration],
      [rewardsAreEscrowed],
      [owner],
      [periodFinish],
      ticks,
      [manager],
    ] = await multicall.multicallv2(Abi.xAssetCLR, calls, {
      requireSuccess: false,
    })
    return {
      manager,
      owner,
      periodFinish: periodFinish.toString(),
      poolAddress,
      poolFee,
      rewardsAreEscrowed,
      rewardProgramDuration: rewardsDuration.toString(),
      rewardTokens: rewardTokenAddresses.map((address: string) => ({
        address,
      })),
      stakedToken: {
        address: stakedTokenAddress,
      },
      ticks: { tick0: ticks.tick0, tick1: ticks.tick1 },
      token0: {
        address: token0Address,
      },
      token1: {
        address: token1Address,
      },
      tokenId,
      tradeFee,
      uniswapPool,
    }
  } catch (error) {
    console.error(error)
  }
}
