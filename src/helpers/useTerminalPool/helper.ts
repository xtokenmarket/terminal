import Abi from 'abis'
import { MulticallService } from 'services'
import { BigNumber } from '@ethersproject/bignumber'
import { ZERO } from 'utils/number'
import { IToken } from 'types'
import { MINING_EVENTS } from 'config/constants'

export const getCoinGeckoIDs = async (tokens: string[]) => {
  const url = 'https://api.coingecko.com/api/v3/coins/list'
  const response = await fetch(url)
  const coins = await response.json()
  if (coins.error) throw coins.error

  return tokens.map((token) => {
    const rateIds = []
    for (const coin of coins) {
      if (coin.symbol.toLowerCase() === token.toLowerCase())
        rateIds.push(coin.id)
    }
    return rateIds[0]
  })
}

export const getTokenUsdPrice = async (tokenSymbol: string) => {
  const tokenId = tokenSymbol.toLowerCase()
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`
  const response = await fetch(url)
  const result = await response.json()

  return Number(result[tokenId].usd)
}

export const getTokenExchangeRate = async (
  ids: string[]
): Promise<number[] | undefined> => {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids[0]}%2C${ids[1]}&vs_currencies=usd`
    const response = await fetch(url)
    const result = await response.json()

    return [
      ids[0] ? result[ids[0]].usd : undefined,
      ids[1] ? result[ids[1]].usd : undefined,
    ]
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
    ] = (
      await multicall.multicallv2(Abi.CLRV0, calls, {
        requireSuccess: false,
      })
    ).map((resItem: Array<any> | null) => resItem || [])

    return {
      address: poolAddress,
      manager,
      owner,
      periodFinish: periodFinish ? periodFinish.toString() : '0',
      poolFee,
      rewardsAreEscrowed: !!rewardsAreEscrowed,
      rewardProgramDuration: rewardsDuration?.toString(),
      rewardTokens:
        rewardTokenAddresses?.map((address: string) => ({
          address,
        })) || [],
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

export const EVENTS_HISTORY_QUERY = `
query ($poolAddress: String!, $userAddress: String!) {
  deposits(where: { pool: $poolAddress, user: $userAddress }) {
    id
    amount0
    amount1
    timestamp
  }
  withdrawals(where: { pool: $poolAddress, user: $userAddress }) {
    id
    amount0
    amount1
    timestamp
  }
  stakeDeposits(where: {pool: $poolAddress, user: $userAddress}) {
    id
    amount
    timestamp
  }
  stakeWithdrawals(where: {pool: $poolAddress, user: $userAddress}) {
    id
    amount
    timestamp
  }
  rewardClaims(where: { pool: $poolAddress, user: $userAddress }) {
    id
    amount
    timestamp
    token {
      id
    }
    txHash
  }
  rewardInitiations(where: { pool: $poolAddress, user: $userAddress }) {
    id
    duration
    rewards {
      token {
        id
      }
      amount
    }
    timestamp
  }
  vests(where: { pool: $poolAddress, beneficiary: $userAddress }) {
    id
    period
    timestamp
    token {
      id
    }
    txHash
    value
  }
  collects(where: { pool: $poolAddress }) {
    id
    timestamp
    token0Fee
    token1Fee
  }
}
`

export const parseEventsHistory = (
  data: any,
  rewardTokens: any,
  isOwnerOrManager: boolean
) => {
  return [
    ...data.deposits.map((deposit: any) =>
      _parseEventHistory(deposit, MINING_EVENTS.Deposit, rewardTokens)
    ),
    ...data.withdrawals.map((withdrawal: any) =>
      _parseEventHistory(withdrawal, MINING_EVENTS.Withdraw, rewardTokens)
    ),
    ...data.stakeDeposits.map((stakeDeposit: any) =>
      _parseEventHistory(stakeDeposit, MINING_EVENTS.StakeDeposit, rewardTokens)
    ),
    ...data.stakeWithdrawals.map((stakeWithdraw: any) =>
      _parseEventHistory(
        stakeWithdraw,
        MINING_EVENTS.StakeWithdraw,
        rewardTokens
      )
    ),
    ...data.rewardClaims.map((claim: any) =>
      _parseEventHistory(claim, MINING_EVENTS.RewardClaimed, rewardTokens)
    ),
    ...data.rewardInitiations.map((reward: any) =>
      _parseEventHistory(
        reward,
        MINING_EVENTS.InitiatedRewardsProgram,
        rewardTokens
      )
    ),
    ...data.vests.map((reward: any) =>
      _parseEventHistory(reward, MINING_EVENTS.Vested, rewardTokens)
    ),
    ...(isOwnerOrManager
      ? data.collects.map((reward: any) =>
          _parseEventHistory(reward, MINING_EVENTS.Collect, rewardTokens)
        )
      : []),
  ]
}

const extractAmount0 = (data: any) => {
  if (data.amount) {
    return BigNumber.from(data.amount)
  }

  if (data.token0Fee) {
    return BigNumber.from(data.token0Fee)
  }

  return data.amount0 ? BigNumber.from(data.amount0) : ZERO
}

const extractAmount1 = (data: any) => {
  if (data.token1Fee) {
    return BigNumber.from(data.token0Fee)
  }

  return data.amount1 ? BigNumber.from(data.amount1) : ZERO
}

const _parseEventHistory = (data: any, action: string, rewardTokens: any) => {
  const token = rewardTokens.find(
    (token: IToken) =>
      token.address.toLowerCase() === data?.token?.id?.toLowerCase()
  )

  // Sort `rewards` in the order of `rewardTokens` for `InitiatedRewards` event
  if (action === MINING_EVENTS.InitiatedRewardsProgram) {
    const rewardTokensOrder = rewardTokens.map((t: IToken) =>
      t.address.toLowerCase()
    )
    data.rewards = data.rewards.sort(
      (a: any, b: any) =>
        rewardTokensOrder.indexOf(a.token.id.toLowerCase()) -
        rewardTokensOrder.indexOf(b.token.id.toLowerCase())
    )
  }

  return {
    action,
    amount0: extractAmount0(data),
    amount1: extractAmount1(data),
    tx: _getTxHash(data, action),
    rewardAmount:
      action === MINING_EVENTS.RewardClaimed
        ? BigNumber.from(data.amount)
        : ZERO,
    symbol: token ? token.symbol : '',
    decimals: token ? Number(token.decimals) : 0,
    value: data.value,
    timestamp: data.timestamp,
    totalRewardAmounts:
      action === MINING_EVENTS.InitiatedRewardsProgram
        ? data.rewards.map(({ amount }: any) => BigNumber.from(amount))
        : [],
    rewardTokens,
  }
}

const _getTxHash = (data: any, action: string) => {
  return action === MINING_EVENTS.RewardClaimed ||
    action === MINING_EVENTS.Vested
    ? data.txHash
    : data.id
}
