import { BigNumber } from 'ethers'
import { IRewardState } from 'components'
import {
  Network,
  EPricingFormula,
  EPeriods,
  EVestingOption,
} from '../utils/enums'

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
    origination: string
    rewardEscrow: string
    uniswapFactory: string
    uniRouter: string
    uniQuoter: string
    uniPositionManager: string
    vestingEntryNFT: string
  }
  terminal: {
    tradeFee: BigNumber
    rewardFee: BigNumber
    deploymentFee: BigNumber
  }
  etherscanUri: string
  unigraph: string
}

export type NetworkId = 1 | 5 | 10 | 42 | 137 | 42161

export type KnownContracts = keyof INetwork['contracts']

export type KnownToken = 'dai' | 'weth' | 'usdt' | 'usdc' | 'eth'

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

type VestingOption = EVestingOption[keyof EVestingOption]

export type SaleData = {
  enabled: boolean | null
  offeringPeriod: string
  offeringPeriodUnit: PeriodUnit
  startingPrice: string
  endingPrice: string
  pricingFormula?: EPricingFormula
}

export interface ICreateTokenSaleData {
  offerTokenAmount: string
  reserveOfferTokenAmount: string
  offerToken?: IToken
  purchaseToken?: IToken
  vestingEnabled?: VestingOption
  vestingPeriod: string
  vestingPeriodUnit: PeriodUnit
  cliffPeriod: string
  cliffPeriodUnit: PeriodUnit
  whitelistSale: SaleData
  publicSale: SaleData
}

export interface ISaleParams {
  offerToken: string
  purchaseToken: string
  totalOfferingAmount: BigNumber
  reserveAmount: BigNumber
  vestingPeriod: BigNumber
  cliffPeriod: BigNumber
  publicStartingPrice: BigNumber
  publicEndingPrice: BigNumber
  whitelistStartingPrice: BigNumber
  whitelistEndingPrice: BigNumber
  publicSaleDuration: BigNumber
  whitelistSaleDuration: BigNumber
}

export interface ITokenOffer {
  network?: Network
  poolAddress?: string
  offeringOverview: IOfferingOverview
  originationRow: IOriginationRow
  whitelist: IWhitelistSale
  publicSale: IPublicSale
  myPosition: IMyPosition
  offeringSummary: IOfferingSummary
  sponsorTokensClaimed: boolean
}

interface Label {
  label: OriginationLabels
}

export interface IOfferingOverview extends Label {
  cliffPeriod: BigNumber
  offeringReserve: BigNumber
  offerToken: IToken
  offerTokenAmountSold: BigNumber
  poolAddress: string
  purchaseToken: IToken
  salesBegin: BigNumber
  salesEnd: BigNumber
  salesPeriod?: BigNumber
  totalOfferingAmount: BigNumber
  vestingPeriod: BigNumber
  isOwnerOrManager: boolean
}

export interface IOriginationRow extends IOfferingOverview {
  startingPrice: BigNumber
  saleDuration?: BigNumber
}

export interface IWhitelistSale extends Label {
  currentPrice: BigNumber
  pricingFormula: string
  startingPrice?: BigNumber
  endingPrice?: BigNumber
  whitelist?: boolean
  addressCap: BigNumber
  timeRemaining: BigNumber
  salesPeriod?: BigNumber
  offerToken: IToken
  purchaseToken: IToken
  whitelistMerkleRoot?: string[]
  isAddressWhitelisted: boolean
  endOfWhitelistPeriod: BigNumber
}

export interface IPublicSale extends Label {
  currentPrice: BigNumber
  pricingFormula: string
  salesPeriod?: BigNumber
  timeRemaining: BigNumber
  offerToken: IToken
  purchaseToken: IToken
  startingPrice: BigNumber
  endingPrice: BigNumber
  saleEndTimestamp: BigNumber
}

export interface IMyPosition extends Label {
  tokenPurchased: BigNumber
  amountInvested: BigNumber
  amountvested: BigNumber
  amountAvailableToVest: BigNumber
  offerToken: IToken
  purchaseToken: IToken
  vestableTokenAmount: BigNumber
  userToVestingId: string[]
}

export interface IOfferingSummary extends Label {
  offerToken: IToken
  purchaseToken: IToken
  tokensSold: BigNumber
  amountsRaised: BigNumber
  vestingPeriod: BigNumber
  cliffPeriod: BigNumber
  salesCompleted: BigNumber
  timeSinceCompleted: BigNumber
}

export type OriginationDetailItem =
  | IOfferingOverview
  | IWhitelistSale
  | IPublicSale
  | IMyPosition
  | IOfferingSummary

export interface IClaimData {
  token: IToken
  amount: BigNumber
}

export interface IOriginationPool {
  address: string
  offerToken: IToken
  purchaseToken: IToken
  owner: string
  manager: string
  network: Network
  reserveAmount: BigNumber
  totalOfferingAmount: BigNumber
  offerTokenAmountSold: BigNumber
  publicStartingPrice: BigNumber
  publicEndingPrice: BigNumber
  publicSaleDuration: BigNumber
  saleInitiatedTimestamp: BigNumber
  saleEndTimestamp: BigNumber
  vestingPeriod: BigNumber
  cliffPeriod: BigNumber
  whitelistStartingPrice: BigNumber
  whitelistEndingPrice: BigNumber
  whitelistSaleDuration: BigNumber
  getOfferTokenPrice: BigNumber
  vestableTokenAmount: BigNumber
  purchaseTokensAcquired: BigNumber
  sponsorTokensClaimed: boolean
}
