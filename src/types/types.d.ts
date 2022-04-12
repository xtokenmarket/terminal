import { BigNumber } from 'ethers'
import { IRewardState } from 'components'
import { Network, IpricingFormula, EPeriods } from '../utils/enums'

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
  }
  terminal: {
    tradeFee: BigNumber
    rewardFee: BigNumber
    deploymentFee: BigNumber
  }
  etherscanUri: string
  unigraph: string
}

export type NetworkId = 1 | 4 | 10 | 42 | 137 | 42161

export type KnownContracts = keyof INetwork['contracts']

export type KnownToken = 'dai' | 'weth' | 'usdt' | 'usdc'

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
  price?: string
  balance?: BigNumber
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

interface EarnedToken extends IToken {
  amount: BigNumber
  price: string
}

export interface ITerminalPool {
  address: string
  apr: string
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
  vestingTokens: VestingToken[]
  earnedTokens: EarnedToken[]
  history: History[]
  poolShare: string
  totalSupply: BigNumber
  user: {
    token0Deposit: BigNumber
    token1Deposit: BigNumber
    token0Tvl: string
    token1Tvl: string
    stakedTokenBalance: BigNumber
    collectableFees0: BigNumber
    collectableFees1: BigNumber
  }
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

export interface History {
  action: string
  // time: string
  tx?: string
  amount0: BigNumber
  amount1: BigNumber
  rewardAmount: BigNumber
  symbol: string
  decimals: number
  value: BigNumber
  timestamp: number
  totalRewardAmounts: BigNumber[]
  rewardTokens: IToken[]
}

export interface ICollectableFees {
  token0Fee: BigNumber
  token1Fee: BigNumber
}

export type PeriodUnit = EPeriods[keyof EPeriods]

export interface ICreateTokenSaleData {
  offerTokenAmount: string
  reserveOfferTokenAmount: string
  offeringPeriod: string
  offerToken?: IToken
  purchaseToken?: IToken
  pricingFormula?: IpricingFormula
  startingPrice: string
  endingPrice: string
  isAddVestingPeriod?: boolean
  vestingPeriod?: number
  vestingPeriodUnit: PeriodUnit
  cliffPeriod?: number
  cliffPeriodUnit: PeriodUnit
  offeringPeriodUnit: string
}
