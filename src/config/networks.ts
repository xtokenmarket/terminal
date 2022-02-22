import { BigNumber, providers } from 'ethers'
import { entries } from 'utils/type-utils'
import {
  IKnownTokenData,
  INetwork,
  IToken,
  KnownContracts,
  KnownToken,
  NetworkId,
} from 'types/types'
import { DEFAULT_NETWORK_ID } from './constants'
import { Network } from 'utils/enums'
import { getIdFromNetwork } from 'utils/network'

export const networkIds = {
  MAINNET: 1,
  KOVAN: 42,
} as const

const networks: { [K in NetworkId]: INetwork } = {
  [networkIds.MAINNET]: {
    label: 'Ethereum Mainnet',
    url: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    contracts: {
      LM: '',
      multicall: '',
      rewardEscrow: '',
      uniswapFactory: '',
      uniRouter: '',
      uniQuoter: '',
      uniPositionManager: '',
      xTokenManager: '',
    },
    terminal: {
      tradeFee: BigNumber.from(1000),
      rewardFee: BigNumber.from(100),
      deploymentFee: BigNumber.from(1),
    },
    etherscanUri: 'https://etherscan.io/',
    unigraph: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  },
  [networkIds.KOVAN]: {
    label: 'Kovan Test Network',
    url: 'https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    contracts: {
      LM: '0xA3566Ca5c0F892b8e651227E5ACd5ee186d239a9',
      multicall: '0x0284D6D74C31B23179CB642aa77164752C6859ed',
      rewardEscrow: '0x27841D2ABCe40791d3a816f264eD16D484DE570C',
      uniswapFactory: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
      uniRouter: '0xe592427a0aece92de3edee1f18e0157c05861564',
      uniQuoter: '0xb27308f9f90d607463bb33ea1bebb41c27ce5ab6',
      uniPositionManager: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
      xTokenManager: '0x9a03bbeb70447f50a80e5d5733526cca125966ee',
    },
    terminal: {
      tradeFee: BigNumber.from(1000),
      rewardFee: BigNumber.from(100),
      deploymentFee: BigNumber.from(1),
    },
    etherscanUri: 'https://kovan.etherscan.io/',
    unigraph: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  },
}

export const knownTokens: { [K in KnownToken]: IKnownTokenData } = {
  xtk: {
    name: 'xToken',
    symbol: 'XTK',
    addresses: {
      [networkIds.MAINNET]: '0x7f3edcdd180dbe4819bd98fee8929b5cedb3adeb',
      [networkIds.KOVAN]: '0x657ad2B770aFC7ACb0A219525C4c22BE6b807023',
    },
    decimals: 18,
    image: '/assets/tokens/xtk.png',
  },
  dai: {
    name: 'DAI',
    symbol: 'DAI',
    addresses: {
      [networkIds.MAINNET]: '0x6b175474e89094c44da98b954eedeac495271d0f',
      [networkIds.KOVAN]: '0xff795577d9ac8bd7d90ee22b6c1703490b6512fd',
    },
    decimals: 18,
    image: '/assets/tokens/dai.png',
  },
  weth: {
    name: 'Wrapped ETHER',
    symbol: 'wETH',
    addresses: {
      [networkIds.MAINNET]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      [networkIds.KOVAN]: '0x21344Ebc08B4dC8BadE8889D034A3f2Ec83ECbef',
    },
    decimals: 18,
    image: '/assets/tokens/weth.png',
  },
  aave: {
    name: 'AAVE',
    symbol: 'AAVE',
    addresses: {
      [networkIds.MAINNET]: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
      [networkIds.KOVAN]: '0x40911223ee38C35E2ffd6a2F2AA64Dd0d10e9406',
    },
    decimals: 18,
    image: '/assets/tokens/aave.png',
  },
  usdt: {
    name: 'Tether USD',
    symbol: 'USDT',
    addresses: {
      [networkIds.MAINNET]: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      [networkIds.KOVAN]: '0x016750ac630f711882812f24dba6c95b9d35856d',
    },
    decimals: 18,
    image: '/assets/tokens/usdt.png',
  },
  usdc: {
    name: 'USD Coin',
    symbol: 'USDC',
    addresses: {
      [networkIds.MAINNET]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      [networkIds.KOVAN]: '0x7b492527F49cB50518dAFc7668dE2E5eaBd8a009',
    },
    decimals: 18,
    image: '/assets/tokens/usdc.png',
  },
}

export const tokenSymbols = Object.keys(knownTokens)
export const commonBaseTokenSymbols = ['usdt', 'weth']

export const supportedNetworkIds = Object.keys(networks).map(
  Number
) as NetworkId[]

export const supportedNetworkURLs = entries(networks).reduce<{
  [networkId: number]: string
}>(
  (acc, [networkId, network]) => ({
    ...acc,
    [networkId]: network.url,
  }),
  {}
)

export const validNetworkId = (networkId: number): networkId is NetworkId => {
  return networks[networkId as NetworkId] !== undefined
}

export const getToken = (tokenId: KnownToken, networkId?: number): IToken => {
  const token = knownTokens[tokenId]

  if (!token) {
    throw new Error(`Unsupported token id: '${tokenId}'`)
  }
  const fNetworkId = networkId || DEFAULT_NETWORK_ID
  if (!validNetworkId(fNetworkId)) {
    throw new Error(`Unsupported network id: '${fNetworkId}'`)
  }
  return {
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    address: token.addresses[fNetworkId],
    image: token.image,
  }
}

export const getTokenFromAddress = (
  address: string,
  chainId?: number
): IToken => {
  const networkId = chainId || DEFAULT_NETWORK_ID

  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`)
  }

  for (const token of Object.values(knownTokens)) {
    const tokenAddress = token.addresses[networkId]

    // token might not be supported in the current network
    if (!tokenAddress) {
      continue
    }

    if (tokenAddress.toLowerCase() === address.toLowerCase()) {
      return {
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        address: tokenAddress,
        image: token.image,
      }
    }
  }

  throw new Error(
    `Couldn't find token with address '${address}' in network '${networkId}'`
  )
}

export const getEtherscanUri = (networkId?: number): string => {
  const fNetworkId = networkId || DEFAULT_NETWORK_ID
  if (!validNetworkId(fNetworkId)) {
    throw new Error(`Unsupported network id: '${fNetworkId}'`)
  }

  return networks[fNetworkId].etherscanUri
}

export const getUniGraph = (networkId?: number): string => {
  const fNetworkId = networkId || DEFAULT_NETWORK_ID
  if (!validNetworkId(fNetworkId)) {
    throw new Error(`Unsupported network id: '${fNetworkId}'`)
  }

  return networks[fNetworkId].unigraph
}

export const getTerminalConfig = (
  networkId?: number
): {
  tradeFee: BigNumber
  rewardFee: BigNumber
  deploymentFee: BigNumber
} => {
  const fNetworkId = networkId || DEFAULT_NETWORK_ID
  if (!validNetworkId(fNetworkId)) {
    throw new Error(`Unsupported network id: '${fNetworkId}'`)
  }

  return networks[fNetworkId].terminal
}

export const getContractAddress = (
  contract: KnownContracts,
  networkId?: number
): string => {
  const fNetworkId = networkId || DEFAULT_NETWORK_ID
  if (!validNetworkId(fNetworkId)) {
    throw new Error(`Unsupported network id: '${fNetworkId}'`)
  }
  return networks[fNetworkId].contracts[contract]
}

export const DefaultReadonlyProvider = new providers.JsonRpcProvider(
  networks[DEFAULT_NETWORK_ID].url,
  DEFAULT_NETWORK_ID
)

export const getNetworkProvider = (network?: Network) => {
  const networkId = getIdFromNetwork(network)
  return new providers.JsonRpcProvider(networks[networkId].url, networkId)
}

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
  const provider = window.ethereum
  if (provider) {
    const chainId = DEFAULT_NETWORK_ID
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: networks[DEFAULT_NETWORK_ID].label,
            nativeCurrency: {
              name: networks[DEFAULT_NETWORK_ID].label,
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: [networks[chainId].url],
            blockExplorerUrls: [networks[chainId].etherscanUri],
          },
        ],
      })
      return true
    } catch (error) {
      alert(JSON.stringify(error))
      console.error(error)
      return false
    }
  } else {
    alert('shit')
    console.error(
      "Can't setup the AVAX network on metamask because window.ethereum is undefined"
    )
    return false
  }
}
