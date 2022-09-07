export enum TxState {
  None,
  Confirming,
  InProgress,
  Complete,
}

export enum ConnectorNames {
  Injected = 'injected',
  TrustWallet = 'trustwallet',
  WalletConnect = 'walletconnect',
  Coinbase = 'coinbase',
  UD = 'uauth',
}

export enum ETHEME {
  White = 'white',
  Black = 'black',
}

export enum FetchStatus {
  NOT_FETCHED = 'not-fetched',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export enum IDOStatus {
  Upcoming = 'Upcoming',
  Ongoing = 'Ongoing',
  Ended = 'Ended',
  Claimable = 'Claimable',
}

export enum ENewPresaleStep {
  Token,
  PresaleRate,
  Cap,
  ContributionLimits,
  PangolinLiquidity,
  ListingPrice,
  AdditionalInfo,
  Timings,
  Finalize,
}

export enum EPresaleStatus {
  PendingStart,
  Live,
  Failed,
  Success,
}

export enum ESort {
  ASC = 'asc',
  DESC = 'desc',
}

export enum ENetwork {
  Ethereum = 'Ethereum',
  Arbitrum = 'Arbitrum',
  Optimism = 'Optimism',
  Polygon = 'Polygon',
}

export enum EDepositStep {
  Init = 'Init',
  Input = 'Input',
  Confirm = 'Confirm',
  Deposit = 'Deposit',
  Success = 'Success',
}

export enum EWithdrawStep {
  Input = 'Input',
  Withdraw = 'Withdraw',
  Success = 'Success',
}

export enum EVestStep {
  Input = 'Input',
  Vest = 'Vest',
  Success = 'Success',
}

export enum ERewardStep {
  Input = 'Input',
  Confirm = 'Confirm',
  Initiate = 'Initiate',
  Success = 'Success',
}

export enum ECreatePoolStep {
  TokenPair = 'Token Pair',
  PriceRange = 'Price Range',
  Rewards = 'Rewards',
  // Done = 'Done',
}

export enum ECreatePoolModalStep {
  Init = 'Init',
  Create = 'Create',
  Success = 'Success',
}

export enum Network {
  MAINNET = 'mainnet',
  ARBITRUM = 'arbitrum',
  OPTIMISM = 'optimism',
  POLYGON = 'polygon',
  KOVAN = 'kovan',
  GOERLI = 'goerli',
}

export enum EPeriods {
  // TODO: remove on production
  Minutes = 'Minutes',
  Hours = 'Hours',
  Days = 'Days',
  Weeks = 'Weeks',
  Month = 'Months',
}

export enum EOfferingPeriods {
  // TODO: remove on production
  Minutes = 'Minutes',
  Hours = 'Hours',
  Days = 'Days',
  Weeks = 'Weeks',
  Month = 'Months',
  Year = 'Years',
}

// uni v3
export enum PoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export enum Field {
  CURRENCY_A = 'CURRENCY_A',
  CURRENCY_B = 'CURRENCY_B',
}

export enum Bound {
  LOWER = 'LOWER',
  UPPER = 'UPPER',
}

export enum NetworkIcon {
  mainnet = 'Ethereum',
  arbitrum = 'Arbitrum',
  optimism = 'Optimism',
  polygon = 'Polygon',
  kovan = 'Ethereum',
  rinkeby = 'Ethereum',
  goerli = 'Ethereum',
}

export enum ECreateTokenSaleStep {
  Offering = 'Offering',
  Auction = 'Auction',
  Vesting = 'Vesting',
  Confirm = 'Confirm',
}

export enum EPricingFormula {
  Standard = 'Standard',
  Ascending = 'Ascending',
  Descending = 'Descending',
}

export enum ECreateTokenSaleModalStep {
  Init = 'Init',
  Success = 'Success',
}

export enum InfoText {
  OfferToken = 'The token being offered to contributors',
  PurchaseToken = 'The token used by contributors to acquire the offer token',
  OfferTokenAmount = 'Maximum amount of token offered to contributors',
  ReserveOfferTokenAmount = 'Minimum amount of purchase token raised for successful offering',
  OfferingPeriod = 'Duration of sale',
  Standard = 'All offer tokens sells for 1 USDC',
  Ascending = 'Price steadily goes up from offering standard price. ',
  Descending = 'Price steadily goes down from offering standard price. ',
}

export enum Description {
  PurchaseToken = 'choose what to sell your offer token for',
  OfferTokenAmount = 'Determine the amount of token you want to sell',
  ReserveOfferTokenAmount = 'Minimum amount of purchase token raised for successful sale',
  StartingPrice = 'Price at the beginning of the period',
  EndingPrice = 'Price at the end of the period',
}

export enum EVestingOption {
  Yes = 'Yes',
  No = 'No',
}

export enum OriginationLabels {
  OfferingOverview = 'offeringOverview',
  WhitelistSale = 'whitelistSale',
  PublicSale = 'publicSale',
  UserPosition = 'userPosition',
  OfferingSummary = 'offeringSummary',
}

export enum OfferingOverview {
  OfferToken = 'offerToken',
  PurchaseToken = 'purchaseToken',
  OfferingStatus = 'offeringStatus',
  ReserveAmount = 'reserveAmount',
  VestingPeriod = 'vestingPeriod',
  CliffPeriod = 'cliffPeriod',
  SalesBegin = 'salesBegin',
  SalesEnd = 'salesEnd',
  SalesPeriod = 'salesPeriod',
}

export enum WhitelistSale {
  CurrentPrice = 'currentPrice',
  PricingFormula = 'pricingFormula',
  StartingEndingPrice = 'startingEndingPrice',
  Whitelist = 'whitelist',
  AddressCap = 'addressCap',
  TimeRemaining = 'timeRemaining',
  SalesPeriod = 'salesPeriod',
}

export enum PublicSale {
  CurrentPrice = 'currentPrice',
  PricingFormula = 'pricingFormula',
  TimeRemaining = 'timeRemaining',
  SalesPeriod = 'salesPeriod',
  StartingEndingPrice = 'startingEndingPrice',
}

export enum UserPosition {
  TokenPurchased = 'tokenPurchased',
  AmountInvested = 'amountInvested',
  Amountvested = 'amountvested',
  AmountAvailableToVest = 'amountAvailableToVest',
  VestableAt = 'vestableAt',
}

export enum OfferingSummary {
  OfferToken = 'offerToken',
  PurchaseToken = 'purchaseToken',
  TokensSold = 'tokensSold',
  PurchaseTokenRaised = 'purchaseTokenRaised',
  VestingPeriod = 'vestingPeriod',
  CliffPeriod = 'cliffPeriod',
  SalesCompleted = 'salesCompleted',
  TimeSinceCompleted = 'timeSinceCompleted',
  OfferingStatus = 'offeringStatus',
  SalesEnded = 'salesEnded',
}

export enum EClaimModalStep {
  Init = 'Init',
  Success = 'Success',
}

export enum ETokenSalePhase {
  Whitelist = 'Whitelist',
  Public = 'Public',
}

export enum VestStep {
  Info = 'Info',
  Success = 'Success',
  Vest = 'Vest',
}

export enum EInvestModalStep {
  Input = 'Input',
  Invest = 'Invest',
  Success = 'Success',
  Approve = 'Approve',
}

export enum EOriginationEvent {
  Claim = 'Claim',
  InitiateSale = 'InitiateSale',
  Invest = 'Invest',
  SaleEnded = 'SaleEnded',
  Vestable = 'Vestable',
}
