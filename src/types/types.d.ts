import { BigNumber } from 'ethers'
import { IRewardState } from 'components'
import { Network } from '../utils/enums'

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

export interface IPositionTicks {
  lowerTick: number
  upperTick: number
}

export type ITerminalPoolTableSortFactor = 'tvl' | 'vesting' | 'ending' | 'apr'

interface VestingToken extends IToken {
  amount: BigNumber
  vestedAmount: BigNumber
  durationRemaining: string[]
  price: string
}

export type VestingTokens = VestingToken[]

interface EarnedToken extends IToken {
  amount: BigNumber
  price: string
}

export type EarnedTokens = EarnedToken[]

export interface ITerminalPool {
  address: string
  manager: string
  network?: Network
  owner: string
  periodFinish: BigNumber
  poolFee: BigNumber
  rewardsAreEscrowed: boolean
  rewardState: IRewardState
  stakedToken: IToken
  ticks: { tick0: BigNumber; tick1: BigNumber }
  token1: IToken
  token0: IToken
  tokenId: BigNumber // token id representing this uniswap position
  tradeFee: BigNumber // xToken Trade Fee as a divisor (100 = 1%)
  tvl: string
  uniswapPool: string
  vestingTokens?: VestingTokens
  earnedTokens: EarnedTokens
  history: History[]
}

export interface ICreatePoolData {
  amount0: BigNumber
  amount1: BigNumber
  maxPrice: string | IFullRange
  minPrice: string | IFullRange
  rewardState: IRewardState
  ticks: IPositionTicks
  tier: BigNumber
  token0: IToken
  token1: IToken
  uniPool: string
}

export type IFullRange = true

// UniswapV3
interface MintState {
  independentField: Field
  typedValue: string
  otherTypedValue: string // for the case when there's no liquidity
  startPriceTypedValue: string // for the case when there's no liquidity
  leftRangeTypedValue: string | IFullRange
  rightRangeTypedValue: string | IFullRange
}

interface History {
  action?: string,
  amount: array,
  time: string,
  tx?: string, 
  amount0: BigNumber,
  amount1: BigNumber,
}

