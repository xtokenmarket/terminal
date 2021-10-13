import { BigNumber } from "@ethersproject/bignumber";
import { ConnectorNames } from "utils/enums";

export const STORAGE_KEY_CONNECTOR = "CONNECTOR";

export const LOGGER_ID = "xToken-Terminal";

export const DEFAULT_NETWORK_ID = 42;

export const WALLET_ICONS: { [key in ConnectorNames]: string } = {
  [ConnectorNames.Injected]: "/assets/wallets/metamask-color.svg",
  [ConnectorNames.TrustWallet]: "/assets/wallets/trust-wallet.svg",
  [ConnectorNames.WalletConnect]: "/assets/wallets/wallet-connect.svg",
};

export const ETHER_DECIMAL = 18;

export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export const FLEEK_STORAGE_API_KEY =
  process.env.REACT_APP_FLEEK_STORAGE_API_KEY || "";
export const FLEEK_STORAGE_API_SECRET =
  process.env.REACT_APP_FLEEK_STORAGE_API_SECRET || "";

export const PRESALE_ITEMS_PER_PAGE = 4;
export const TOKENS_PER_PAGE = 10;

export const PRICE_MULTIPLIER = BigNumber.from(1000000);
export const PRICE_DECIMALS = 6;

export const MIN_START_TIME_DIFF = 10 * 60; // 10 mins
export const LIQUIDITY_LOCK_MIN_DURATION = 30 * 24 * 60 * 60; // 1 month

export const FLEEK_STORAGE_START_URL = "https://storageapi.fleek.co/";
