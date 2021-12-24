export enum ConnectorNames {
  Injected = "injected",
  TrustWallet = "trustwallet",
  WalletConnect = "walletconnect",
}

export enum ETHEME {
  White = "white",
  Black = "black",
}

export enum FetchStatus {
  NOT_FETCHED = "not-fetched",
  SUCCESS = "success",
  FAILED = "failed",
}

export enum IDOStatus {
  Upcoming = "Upcoming",
  Ongoing = "Ongoing",
  Ended = "Ended",
  Claimable = "Claimable",
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
  ASC = "asc",
  DESC = "desc",
}

export enum ENetwork {
  Ethereum = "Ethereum",
  Arbitrum = "Arbitrum",
  Optimism = "Optimism",
}

export enum EDepositStep {
  Init = "Init",
  Input = "Input",
  Confirm = "Confirm",
  Deposit = "Deposit",
  Success = "Success",
}

export enum EWithdrawStep {
  Input = "Input",
  Withdraw = "Withdraw",
  Success = "Success",
}

export enum EVestStep {
  Input = "Input",
  Vest = "Vest",
  Success = "Success",
}

export enum ERewardStep {
  Input = "Input",
  Confirm = "Confirm",
  Initiate = "Initiate",
  Success = "Success",
}

export enum ECreatePoolStep {
  TokenPair = "Token Pair",
  PriceRange = "Price Range",
  Rewards = "Rewards (Optional)",
  Done = "Done",
}

// uni v3
export enum PoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export enum Field {
  CURRENCY_A = "CURRENCY_A",
  CURRENCY_B = "CURRENCY_B",
}

export enum Bound {
  LOWER = "LOWER",
  UPPER = "UPPER",
}
