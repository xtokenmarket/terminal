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

export type NetworkId = 1 | 4 | 5 | 10 | 42 | 137 | 42161

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
  createdAt: string
  description: string
  earnedTokens: EarnedToken[]
  history: History[]
  isReward?: boolean
  manager: string
  network?: Network
  owner: string
  periodFinish: BigNumber
  poolFee: BigNumber
  poolName: string
  poolShare: string
  rewardFeePercent: number
  rewardsAreEscrowed: boolean
  rewardState: IRewardState
  stakedToken?: IToken
  ticks: { tick0: BigNumber; tick1: BigNumber }
  token1: IToken
  token0: IToken
  tokenId: BigNumber // token id representing this uniswap position
  totalSupply: BigNumber
  tradeFee: BigNumber // xToken Trade Fee as a divisor (100 = 1%)
  tvl: string
  uniswapPool: string
  user: {
    collectableFees1: BigNumber
    collectableFees0: BigNumber
    stakedTokenBalance: BigNumber
    token1Deposit: BigNumber
    token1Tvl: string
    token0Deposit: BigNumber
    token0Tvl: string
  }
  vestingTokens: VestingToken[]
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
  incentivized: boolean
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

export interface PoolService {
  version: string
  address: string
  calculateAmountsMintedSingleToken: (
    inputAsset: number,
    amount: BigNumber
  ) => Promise<any>
  getLiquidityForAmounts: (
    amount0: BigNumber,
    amount1: BigNumber
  ) => Promise<any>
  deposit: (
    amount0: BigNumber,
    amount1: BigNumber,
    networkId: number,
    isToken1Deposit?: boolean
  ) => Promise<any>
  waitUntilDeposit: (
    amount0: BigNumber,
    amount1: BigNumber,
    account: string,
    txId: string
  ) => Promise<string>
  parseProvideLiquidityTx: (txId: string) => Promise<any>
  withdrawAndClaimReward: (
    amount: BigNumber,
    amount0Estimation: BigNumber,
    amount1Estimation: BigNumber
  ) => Promise<any>
  withdraw: (
    amount: BigNumber,
    amount0Estimation: BigNumber,
    amount1Estimation: BigNumber
  ) => Promise<any>
  parseWithdrawTx: (txId: string) => Promise<any>
  parseClaimTx: (txId: string) => Promise<any>
  waitUntilWithdraw: (account: string, txId: string) => Promise<any>
  claimReward: () => Promise<any>
  waitUntilClaimReward: (account: string, txId: string) => Promise<any>
  earned: (account: Maybe<string>, tokenAddress: string) => Promise<any>
  reinvest: () => Promise<any>
  waitUntilReinvest: (txId: string) => Promise<any>
  calculateWithdrawAmounts: (amount: BigNumber) => Promise<any>
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
