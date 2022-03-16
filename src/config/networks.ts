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
import { CHAIN_NAMES, ChainId, DEFAULT_NETWORK_ID, IS_PROD } from './constants'
import { Network } from 'utils/enums'
import { getIdFromNetwork } from 'utils/network'

const networks: { [K in ChainId]: INetwork } = {
  [ChainId.Mainnet]: {
    label: CHAIN_NAMES[ChainId.Mainnet],
    url: 'https://eth-mainnet.alchemyapi.io/v2/NNM6Jp5aqBppePm-R-D4IkNPd0fcTMkZ',
    contracts: {
      LM: '0x090559D58aAB8828C27eE7a7EAb18efD5bB90374',
      multicall: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
      rewardEscrow: '0x40E8cb3440C0B05EB20522D1F63397e5B36efcf2',
      uniswapFactory: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
      uniRouter: '0xe592427a0aece92de3edee1f18e0157c05861564',
      uniQuoter: '0xb27308f9f90d607463bb33ea1bebb41c27ce5ab6',
      uniPositionManager: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
    },
    terminal: {
      tradeFee: BigNumber.from(1000),
      rewardFee: BigNumber.from(100),
      deploymentFee: BigNumber.from(1),
    },
    etherscanUri: 'https://etherscan.io/',
    unigraph: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  },
  [ChainId.Arbitrum]: {
    label: CHAIN_NAMES[ChainId.Arbitrum],
    url: 'https://arb-mainnet.g.alchemy.com/v2/NNM6Jp5aqBppePm-R-D4IkNPd0fcTMkZ',
    contracts: {
      LM: '0x090559D58aAB8828C27eE7a7EAb18efD5bB90374',
      multicall: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
      rewardEscrow: '0x40E8cb3440C0B05EB20522D1F63397e5B36efcf2',
      uniswapFactory: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
      uniRouter: '0xe592427a0aece92de3edee1f18e0157c05861564',
      uniQuoter: '0xb27308f9f90d607463bb33ea1bebb41c27ce5ab6',
      uniPositionManager: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
    },
    terminal: {
      tradeFee: BigNumber.from(1000),
      rewardFee: BigNumber.from(100),
      deploymentFee: BigNumber.from(1),
    },
    etherscanUri: 'https://arbiscan.io/',
    unigraph: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  },
  [ChainId.Optimism]: {
    label: CHAIN_NAMES[ChainId.Optimism],
    url: 'https://opt-mainnet.g.alchemy.com/v2/NNM6Jp5aqBppePm-R-D4IkNPd0fcTMkZ',
    contracts: {
      LM: '0x090559D58aAB8828C27eE7a7EAb18efD5bB90374',
      multicall: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
      rewardEscrow: '0x40E8cb3440C0B05EB20522D1F63397e5B36efcf2',
      uniswapFactory: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
      uniRouter: '0xe592427a0aece92de3edee1f18e0157c05861564',
      uniQuoter: '0xb27308f9f90d607463bb33ea1bebb41c27ce5ab6',
      uniPositionManager: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
    },
    terminal: {
      tradeFee: BigNumber.from(1000),
      rewardFee: BigNumber.from(100),
      deploymentFee: BigNumber.from(1),
    },
    etherscanUri: 'https://optimistic.etherscan.io/',
    unigraph: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  },
  [ChainId.Polygon]: {
    label: CHAIN_NAMES[ChainId.Polygon],
    url: 'https://polygon-mainnet.g.alchemy.com/v2/NNM6Jp5aqBppePm-R-D4IkNPd0fcTMkZ',
    contracts: {
      LM: '0x090559D58aAB8828C27eE7a7EAb18efD5bB90374',
      multicall: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
      rewardEscrow: '0x40E8cb3440C0B05EB20522D1F63397e5B36efcf2',
      uniswapFactory: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
      uniRouter: '0xe592427a0aece92de3edee1f18e0157c05861564',
      uniQuoter: '0xb27308f9f90d607463bb33ea1bebb41c27ce5ab6',
      uniPositionManager: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
    },
    terminal: {
      tradeFee: BigNumber.from(1000),
      rewardFee: BigNumber.from(100),
      deploymentFee: BigNumber.from(1),
    },
    etherscanUri: 'https://polygonscan.com/',
    unigraph: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  },
  [ChainId.Kovan]: {
    label: CHAIN_NAMES[ChainId.Kovan],
    url: 'https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    contracts: {
      LM: '0x9448b6881550B1f311D0e1F459b29662bA2addAf',
      multicall: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
      rewardEscrow: '0x9897e91B2D5460F61c174D6eb32D3FA2DA956A65',
      uniswapFactory: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
      uniRouter: '0xe592427a0aece92de3edee1f18e0157c05861564',
      uniQuoter: '0xb27308f9f90d607463bb33ea1bebb41c27ce5ab6',
      uniPositionManager: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
    },
    terminal: {
      tradeFee: BigNumber.from(1000),
      rewardFee: BigNumber.from(100),
      deploymentFee: BigNumber.from(1),
    },
    etherscanUri: 'https://kovan.etherscan.io/',
    unigraph: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  },
  [ChainId.Rinkeby]: {
    label: CHAIN_NAMES[ChainId.Rinkeby],
    url: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    contracts: {
      LM: '0x9e20D2512A060D88245b0F3d3e2Cdf2b3CE23988',
      multicall: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
      rewardEscrow: '0xc9D4B4cD84d27Ac1C0cFeE430515d89440766Cb9',
      uniswapFactory: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
      uniRouter: '0xe592427a0aece92de3edee1f18e0157c05861564',
      uniQuoter: '0xb27308f9f90d607463bb33ea1bebb41c27ce5ab6',
      uniPositionManager: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
    },
    terminal: {
      tradeFee: BigNumber.from(1000),
      rewardFee: BigNumber.from(100),
      deploymentFee: BigNumber.from(1),
    },
    etherscanUri: 'https://rinkeby.etherscan.io/',
    unigraph: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  },
}

export const knownTokens: { [K in KnownToken]: IKnownTokenData } = {
  dai: {
    name: 'DAI',
    symbol: 'DAI',
    addresses: {
      [ChainId.Mainnet]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      [ChainId.Arbitrum]: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      [ChainId.Optimism]: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      [ChainId.Polygon]: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      [ChainId.Kovan]: '0x90410304D88E333710703aF6Ed6A14d5ef74575F',
      [ChainId.Rinkeby]: '0x67571cecddF314645f0148A7De404ebbd109A9B3',
    },
    decimals: 18,
    image: '/assets/tokens/dai.png',
  },
  weth: {
    name: 'Wrapped ETHER',
    symbol: 'wETH',
    addresses: {
      [ChainId.Mainnet]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      [ChainId.Arbitrum]: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      [ChainId.Optimism]: '0x4200000000000000000000000000000000000006',
      [ChainId.Polygon]: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      [ChainId.Kovan]: '0x21344Ebc08B4dC8BadE8889D034A3f2Ec83ECbef',
      [ChainId.Rinkeby]: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    },
    decimals: 18,
    image: '/assets/tokens/weth.png',
  },
  usdt: {
    name: 'Tether USD',
    symbol: 'USDT',
    addresses: {
      [ChainId.Mainnet]: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      [ChainId.Arbitrum]: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      [ChainId.Optimism]: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      [ChainId.Polygon]: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      [ChainId.Kovan]: '0x016750ac630f711882812f24dba6c95b9d35856d',
      [ChainId.Rinkeby]: '0x3B00Ef435fA4FcFF5C209a37d1f3dcff37c705aD',
    },
    decimals: 18,
    image: '/assets/tokens/usdt.png',
  },
  usdc: {
    name: 'USD Coin',
    symbol: 'USDC',
    addresses: {
      [ChainId.Mainnet]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      [ChainId.Arbitrum]: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      [ChainId.Optimism]: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
      [ChainId.Polygon]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      [ChainId.Kovan]: '0x7b492527F49cB50518dAFc7668dE2E5eaBd8a009',
      [ChainId.Rinkeby]: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
    },
    decimals: 18,
    image: '/assets/tokens/usdc.png',
  },
}

export const tokenSymbols = Object.keys(knownTokens)
export const commonBaseTokenSymbols = ['usdt', 'weth']

export const supportedNetworkIds = [
  ChainId.Mainnet,
  ChainId.Arbitrum,
  ChainId.Optimism,
  ChainId.Polygon,
  // Remove test nets if on production
  ...(IS_PROD ? [] : [ChainId.Kovan, ChainId.Rinkeby]),
]

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
    console.error(
      "Can't setup the AVAX network on metamask because window.ethereum is undefined"
    )
    return false
  }
}
