import { BigNumber, providers } from "ethers";
import { entries } from "utils/type-utils";
import {
  IKnownTokenData,
  INetwork,
  IToken,
  KnownContracts,
  KnownToken,
  NetworkId,
} from "types/types";
import { DEFAULT_NETWORK_ID } from "./constants";

export const networkIds = {
  MAINNET: 1,
  KOVAN: 42,
} as const;

const networks: { [K in NetworkId]: INetwork } = {
  [networkIds.MAINNET]: {
    label: "Ethereum Mainnet",
    url: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    contracts: {
      LM: "",
      multicall: "",
      rewardEscrow: "",
      uniswapFactory: "",
      uniRouter: "",
      uniQuoter: "",
      uniPositionManager: "",
      xTokenManager: "",
    },
    terminal: {
      tradeFee: BigNumber.from(1000),
      rewardFee: BigNumber.from(100),
      deploymentFee: BigNumber.from(1),
    },
    etherscanUri: "https://etherscan.io/",
  },
  [networkIds.KOVAN]: {
    label: "Kovan Test Network",
    url: "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    contracts: {
      LM: "0x499be5f13216BC2E4e01D1E763DB6e710ADd67D3",
      multicall: "0x0284D6D74C31B23179CB642aa77164752C6859ed",
      rewardEscrow: "0x02bdd65a0f22f2232388c302542e8e8ea035c6a9",
      uniswapFactory: "0x1f98431c8ad98523631ae4a59f267346ea31f984",
      uniRouter: "0xe592427a0aece92de3edee1f18e0157c05861564",
      uniQuoter: "0xb27308f9f90d607463bb33ea1bebb41c27ce5ab6",
      uniPositionManager: "0xc36442b4a4522e871399cd717abdd847ab11fe88",
      xTokenManager: "0x5b5061c2be2924ea6f5751d0d932873694d82232",
    },
    terminal: {
      tradeFee: BigNumber.from(1000),
      rewardFee: BigNumber.from(100),
      deploymentFee: BigNumber.from(1),
    },
    etherscanUri: "https://kovan.etherscan.io/",
  },
};

const knownTokens: { [K in KnownToken]: IKnownTokenData } = {
  xtk: {
    name: "xToken",
    symbol: "XTK",
    addresses: {
      [networkIds.MAINNET]: "0x7f3edcdd180dbe4819bd98fee8929b5cedb3adeb",
      [networkIds.KOVAN]: "0x657ad2B770aFC7ACb0A219525C4c22BE6b807023",
    },
    decimals: 18,
    image: "/assets/tokens/xtk.png",
  },
  dai: {
    name: "DAI",
    symbol: "DAI",
    addresses: {
      [networkIds.MAINNET]: "0x6b175474e89094c44da98b954eedeac495271d0f",
      [networkIds.KOVAN]: "0x5DFf3c4eed89C6BBC8f4CfCd85157020199e2b99",
    },
    decimals: 18,
    image: "/assets/tokens/dai.png",
  },
  weth: {
    name: "Wrapped ETHER",
    symbol: "wETH",
    addresses: {
      [networkIds.MAINNET]: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      [networkIds.KOVAN]: "0xF20cD8C7BF13002076C437711cbaEb8E500af193",
    },
    decimals: 18,
    image: "/assets/tokens/weth.png",
  },
  aave: {
    name: "AAVE",
    symbol: "AAVE",
    addresses: {
      [networkIds.MAINNET]: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
      [networkIds.KOVAN]: "0xC0e65b207a2713C5C9CA05D29E86C3B0A2E30e3e",
    },
    decimals: 18,
    image: "/assets/tokens/aave.png",
  },
  usdt: {
    name: "Tether USD",
    symbol: "USDT",
    addresses: {
      [networkIds.MAINNET]: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      [networkIds.KOVAN]: "0xC0e65b207a2713C5C9CA05D29E86C3B0A2E30e3e",
    },
    decimals: 18,
    image: "/assets/tokens/usdt.png",
  },
  usdc: {
    name: "USD Coin",
    symbol: "USDC",
    addresses: {
      [networkIds.MAINNET]: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      [networkIds.KOVAN]: "0xC0e65b207a2713C5C9CA05D29E86C3B0A2E30e3e",
    },
    decimals: 18,
    image: "/assets/tokens/usdc.png",
  },
};

export const tokenSymbols = Object.keys(knownTokens);
export const commonBaseTokenSymbols = ["usdt", "weth"];

export const supportedNetworkIds = Object.keys(networks).map(
  Number
) as NetworkId[];

export const supportedNetworkURLs = entries(networks).reduce<{
  [networkId: number]: string;
}>(
  (acc, [networkId, network]) => ({
    ...acc,
    [networkId]: network.url,
  }),
  {}
);

const validNetworkId = (networkId: number): networkId is NetworkId => {
  return networks[networkId as NetworkId] !== undefined;
};

export const getToken = (tokenId: KnownToken, networkId?: number): IToken => {
  const token = knownTokens[tokenId];

  if (!token) {
    throw new Error(`Unsupported token id: '${tokenId}'`);
  }
  const fNetworkId = networkId || DEFAULT_NETWORK_ID;
  if (!validNetworkId(fNetworkId)) {
    throw new Error(`Unsupported network id: '${fNetworkId}'`);
  }
  return {
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    address: token.addresses[fNetworkId],
    image: token.image,
  };
};

export const getTokenFromAddress = (
  address: string,
  chianId?: number
): IToken => {
  const networkId = chianId || DEFAULT_NETWORK_ID;

  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }

  for (const token of Object.values(knownTokens)) {
    const tokenAddress = token.addresses[networkId];

    // token might not be supported in the current network
    if (!tokenAddress) {
      continue;
    }

    if (tokenAddress.toLowerCase() === address.toLowerCase()) {
      return {
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        address: tokenAddress,
        image: token.image,
      };
    }
  }

  throw new Error(
    `Couldn't find token with address '${address}' in network '${networkId}'`
  );
};

export const getEtherscanUri = (networkId?: number): string => {
  const fNetworkId = networkId || DEFAULT_NETWORK_ID;
  if (!validNetworkId(fNetworkId)) {
    throw new Error(`Unsupported network id: '${fNetworkId}'`);
  }

  return networks[fNetworkId].etherscanUri;
};

export const getTerminalConfig = (
  networkId?: number
): {
  tradeFee: BigNumber;
  rewardFee: BigNumber;
  deploymentFee: BigNumber;
} => {
  const fNetworkId = networkId || DEFAULT_NETWORK_ID;
  if (!validNetworkId(fNetworkId)) {
    throw new Error(`Unsupported network id: '${fNetworkId}'`);
  }

  return networks[fNetworkId].terminal;
};

export const getContractAddress = (
  contract: KnownContracts,
  networkId?: number
): string => {
  const fNetworkId = networkId || DEFAULT_NETWORK_ID;
  if (!validNetworkId(fNetworkId)) {
    throw new Error(`Unsupported network id: '${fNetworkId}'`);
  }
  return networks[fNetworkId].contracts[contract];
};

export const DefaultReadonlyProvider = new providers.JsonRpcProvider(
  networks[DEFAULT_NETWORK_ID].url,
  DEFAULT_NETWORK_ID
);

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
  const provider = window.ethereum;
  if (provider) {
    const chainId = DEFAULT_NETWORK_ID;
    try {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: networks[DEFAULT_NETWORK_ID].label,
            nativeCurrency: {
              name: networks[DEFAULT_NETWORK_ID].label,
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: [networks[chainId].url],
            blockExplorerUrls: [networks[chainId].etherscanUri],
          },
        ],
      });
      return true;
    } catch (error) {
      alert(JSON.stringify(error));
      console.error(error);
      return false;
    }
  } else {
    alert("shit");
    console.error(
      "Can't setup the AVAX network on metamask because window.ethereum is undefined"
    );
    return false;
  }
};
