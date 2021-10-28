import { BigNumber } from "ethers";

declare global {
  interface Window {
    ethereum: ExternalProvider | JsonRpcFetchFunc;
  }
}

export type Maybe<T> = T | null;

export type MultiCallResponse<T> = T | null;

export interface INetwork {
  label: string;
  url: string;
  contracts: {
    LM: string;
    multicall: string;
  };
  etherscanUri: string;
}

export type NetworkId = 1 | 42;

export type KnownContracts = keyof INetwork["contracts"];

export type KnownToken = "xtk" | "dai" | "weth" | "usdt" | "usdc" | "aave";

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
  image?: string;
}

export type ITerminalPoolTableSortFactor = "tvl" | "vesting" | "ending" | "apr";

export interface ITerminalPool {
  address: string;
  tvl: BigNumber;
  vesting: number;
  program: BigNumber;
  ending: number;
  apr: number;
  token0: IToken;
  token1: IToken;
}
