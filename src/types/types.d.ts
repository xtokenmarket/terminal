import { BigNumber } from 'ethers'

declare global {
  interface Window {
    ethereum: ExternalProvider | JsonRpcFetchFunc
  }
}

export type Maybe<T> = T | null

export type MultiCallResponse<T> = T | null

export interface INetwork {
  label: string
  url: string
  contracts: {
    LM: string
    multicall: string
    rewardEscrow: string
    uniswapFactory: string
    uniRouter: string
    uniQuoter: string
    uniPositionManager: string
    xTokenManager: string
  }
  terminal: {
    tradeFee: BigNumber
    rewardFee: BigNumber
    deploymentFee: BigNumber
  }
  etherscanUri: string
  unigraph: string
}

export type NetworkId = 1 | 42

export type KnownContracts = keyof INetwork['contracts']

export type KnownToken = 'xtk' | 'dai' | 'weth' | 'usdt' | 'usdc' | 'aave'

export interface IKnownTokenData {
  name: string
  symbol: string
  addresses: { [key in NetworkId]: string }

  decimals: number
  image: string
}

export interface IToken {
  address: string
  decimals: number
  symbol: string
  name: string
  image: string
  percent?: string
  tvl?: string
}

export type ITerminalPoolTableSortFactor = 'tvl' | 'vesting' | 'ending' | 'apr'

export interface ITerminalPool {
  address: string
  token0: IToken
  token1: IToken
  stakedToken: IToken
  tokenId: BigNumber // token id representing this uniswap position
  token0DecimalMultiplier: BigNumber // 10 ** (18 - token0 decimals)
  token1DecimalMultiplier: BigNumber // 10 ** (18 - token1 decimals)
  tokenDiffDecimalMultiplier: BigNumber // 10 ** (token0 decimals - token1 decimals)
  tradeFee: BigNumber // xToken Trade Fee as a divisor (100 = 1%)
  poolFee: BigNumber
  uniswapPool: string
  rewardTokens: IToken[]
  rewardsPerToken: BigNumber[]
  rewardsDuration: BigNumber
  rewardsAreEscrowed: boolean
  owner: string
  periodFinish: BigNumber
  vestingPeriod: BigNumber
  ticks: { tick0: BigNumber; tick1: BigNumber }
  manager: string
  tvl: string
}

// uni

interface MintState {
  independentField: Field
  typedValue: string
  otherTypedValue: string // for the case when there's no liquidity
  startPriceTypedValue: string // for the case when there's no liquidity
  leftRangeTypedValue: string
  rightRangeTypedValue: string
}
