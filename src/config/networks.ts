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
import {
  CHAIN_NAMES,
  CHAIN_PARAMS,
  ChainId,
  DEFAULT_NETWORK_ID,
  IS_PROD,
} from './constants'
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
      multicall: '0x80C7DD17B01855a6D2347444a0FCC36136a314de', // 3rd party deployment: https://github.com/joshstevens19/ethereum-multicall/pull/20
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
      multicall: '0x2DC0E2aa608532Da689e89e237dF582B783E552C', // 3rd party deployment: https://github.com/makerdao/multicall/pull/35
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
      multicall: '0x275617327c958bD06b5D6b871E7f491D76113dd8', // 3rd party deployment: https://github.com/makerdao/multicall/pull/24
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
      LM: '0xe101f34b475C01Ac9975686ab6b69e6163938788',
      multicall: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
      rewardEscrow: '0x8DD9e1f5FD3c97Bf78Dd8998C2aC352747CF39a1',
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
      LM: '0x40860E7233f808d46f2D4f27f513444E611E1aa1',
      multicall: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
      rewardEscrow: '0x37F82851593cf54f2D30dfF76a5329615331BD07',
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
  [ChainId.Goerli]: {
    label: CHAIN_NAMES[ChainId.Goerli],
    url: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    contracts: {
      LM: '0x56eA5814Fa0fB464447FFDde7A30ef86A8D32E76',
      multicall: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
      rewardEscrow: '0x950f63d235D163314E68c80A9d5c06200FAC7978',
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
    etherscanUri: 'https://goerli.etherscan.io/',
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
      [ChainId.Goerli]: '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60',
    },
    decimals: 18,
    image: '/assets/tokens/dai.png',
  },
  weth: {
    name: 'Wrapped ETHER',
    symbol: 'WETH',
    addresses: {
      [ChainId.Mainnet]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      [ChainId.Arbitrum]: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      [ChainId.Optimism]: '0x4200000000000000000000000000000000000006',
      [ChainId.Polygon]: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      [ChainId.Kovan]: '0xdfcea9088c8a88a76ff74892c1457c17dfeef9c1',
      [ChainId.Rinkeby]: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
      [ChainId.Goerli]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
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
      [ChainId.Goerli]: '0x64Ef393b6846114Bad71E2cB2ccc3e10736b5716',
    },
    decimals: 6,
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
      [ChainId.Kovan]: '0xc2569dd7d0fd715B054fBf16E75B001E5c0C1115',
      [ChainId.Rinkeby]: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
      [ChainId.Goerli]: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
    },
    decimals: 6,
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

  ChainId.Kovan,
  ChainId.Goerli,
  // Remove Rinkeby test net if on production
  ...(IS_PROD ? [] : [ChainId.Rinkeby]),
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
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [CHAIN_PARAMS[DEFAULT_NETWORK_ID]],
      })
      return true
    } catch (error) {
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
