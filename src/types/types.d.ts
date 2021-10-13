import { BigNumber } from "ethers";

declare global {
  interface Window {
    ethereum: ExternalProvider | JsonRpcFetchFunc;
  }
}

export type Maybe<T> = T | null;

export interface INetwork {
  label: string;
  url: string;
  contracts: {};
  etherscanUri: string;
}

export type NetworkId = 1 | 42;

export type KnownContracts = keyof INetwork["contracts"];

export type KnownToken = "xtk";

export interface IKnownTokenData {
  name: string;
  symbol: string;
  addresses: { [key in NetworkId]: string };

  decimals: number;
  image: string;
}

export interface IToken {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  image: string;
  totalSupply?: BigNumber;
}

export interface IFunder {
  totalFunded: BigNumber;
  totalSaleToken: BigNumber;
  release: BigNumber;
}

export interface IMetadata {
  logo: string;
  website: string;
  github: string;
  twitter: string;
  reddit: string;
  telegram: string;
  description: string;
  update: string;
}

export interface IPresale {
  id: string;
  poolId: BigNumber;
  address: string;
  token: string;
  price: BigNumber;
  softCap: BigNumber;
  hardCap: BigNumber;
  minContribution: BigNumber;
  maxContribution: BigNumber;
  liquidityPercent: BigNumber;
  listingPrice: BigNumber;
  startTime: number;
  endTime: number;
  liquidityLockupTime: number;
  fundRaised: BigNumber;
  totalSold: BigNumber;
  totalReleased: BigNumber;
  meta: string;
  isWhitelistEnabled: boolean;
  isTokenDeposited: boolean;
  isFinalized: boolean;
  lpToken: string;
  cliffTime: number;
  distributePercentAtClaim: number;
  vestingDuration: number;
  vestingPeriodicity: number;
  creator: string;
}

export interface IPresaleDetails extends IPresale {
  meta?: IMetadata;
  tokenDetails?: IToken;
}

export interface IFeeInfo {
  token: string;
  feeRecipient: string;
  createFeeAvax: BigNumber;
  createFeeBaseToken: BigNumber;
  feePercent: BigNumber;
}

export interface INewPresale extends IMetadata {
  token: string;
  price: BigNumber;
  softCap: BigNumber;
  hardCap: BigNumber;
  minContribution: BigNumber;
  maxContribution: BigNumber;
  liquidityPercent: BigNumber;
  listingPrice: BigNumber;
  startTime: number;
  endTime: number;
  liquidityLockupTime: number;

  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: string;

  logoFile?: File;
  logoObjectUrl?: string;
}

export interface ICreatedToken {
  name: string;
  symbol: string;
  totalSupply: BigNumber;
  creator: string;
  address: string;
  hash: string;
  timestamp: number;
  decimals: number;
}
