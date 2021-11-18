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
