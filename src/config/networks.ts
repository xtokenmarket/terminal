import { providers } from "ethers";
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
    label: "",
    url: "",
    contracts: {},
    etherscanUri: "",
  },
  [networkIds.KOVAN]: {
    label: "Avalanche Fuji Testnet",
    url: "",
    contracts: {},
    etherscanUri: "",
  },
};

const knownTokens: { [K in KnownToken]: IKnownTokenData } = {
  xtk: {
    name: "",
    symbol: "",
    addresses: {
      [networkIds.MAINNET]: "",
      [networkIds.KOVAN]: "",
    },
    decimals: 18,
    image: "",
  },
};

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
              name: "AVAX",
              symbol: "avax",
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
