import { Network } from 'utils/enums'
import { AddressZero } from '@ethersproject/constants'
import { getAddress } from 'ethers/lib/utils'

export const POOLS_QUERY = `
query {
  pools(first: 1000, orderBy: createdAt, orderDirection: desc) {
      id
      token0 {
        id
        symbol
        name
        decimals
      }
      token1 {
        id
        symbol
        name
        decimals
      }
      ticks
      owner {
        id
      }
      manager {
        id
      }
      rewardTokens {
        id
        symbol
        name
        decimals
      }
      rewardAmounts
      rewardAmountsPerWeek
      rewardsAreEscrowed
      rewardDuration
      tokenId
      poolFee
      tradeFee
      uniswapPool
      periodFinish
      stakedToken {
        id
        symbol
        name
        decimals
      }
      vestingPeriod
      bufferTokenBalance
      stakedTokenBalance
    }
}
`

export const parsePools = (data: any, network: Network) => {
  return data.errors
    ? []
    : data.pools.map((pool: any) => ({
        poolAddress: getAddress(pool.id),
        network,
        manager: pool.manager ? getAddress(pool.manager.id) : AddressZero,
        owner: pool.owner ? getAddress(pool.owner.id) : AddressZero,
        periodFinish: pool.periodFinish || '0',
        poolFee: pool.poolFee.toString(),
        rewardProgramDuration: pool.rewardDuration,
        rewardTokens: pool.rewardTokens.map((token: any) =>
          _parseTokenDetails(token)
        ),
        rewardsAreEscrowed: pool.rewardsAreEscrowed,
        stakedToken: _parseTokenDetails(pool.stakedToken),
        token0: _parseTokenDetails(pool.token0),
        token1: _parseTokenDetails(pool.token1),
        tokenId: pool.tokenId,
        ticks: {
          tick0: pool.ticks[0],
          tick1: pool.ticks[1],
        },
        totalRewardAmounts: pool.rewardAmounts || [],
        tradeFee: pool.tradeFee,
        uniswapPool: pool.uniswapPool
          ? getAddress(pool.uniswapPool.id)
          : AddressZero,
        vestingPeriod: pool.vestingPeriod || '0',
      }))
}

const _parseTokenDetails = (token: any) => {
  return {
    address: token.id,
    decimals: token.decimals,
    name: token.name,
    symbol: token.symbol,
  }
}
