import Abi from 'abis'
import axios from 'axios'
import {
  ChainId,
  ETHER_DECIMAL,
  GRAPHQL_URLS,
  POLL_API_DATA,
  TERMINAL_API_URL,
} from 'config/constants'
import {
  getNetworkProvider,
  getTokenFromAddress,
  getContractAddress,
} from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import {
  formatEther,
  formatUnits,
  getAddress,
  parseEther,
} from 'ethers/lib/utils'
import { useServices } from 'helpers'
import { useEffect, useState } from 'react'
import { CLRService, ERC20Service } from 'services'
import { History, ITerminalPool, IToken } from 'types'
import { BigNumber } from '@ethersproject/bignumber'
import {
  formatBigNumber,
  getCurrentTimeStamp,
  getTimeRemainingUnits,
} from 'utils'
import { ERewardStep, Network } from 'utils/enums'
import { getIdFromNetwork, isTestnet } from 'utils/network'
import { formatDuration, ONE_ETHER, ZERO } from 'utils/number'
import _ from 'lodash'

import {
  EVENTS_HISTORY_QUERY,
  getCoinGeckoIDs,
  getPoolDataMulticall,
  getTokenExchangeRate,
  parseEventsHistory,
} from './helper'
import { ethers, Contract } from 'ethers'
import { fetchQuery } from 'utils/thegraph'

interface IState {
  pool?: ITerminalPool
  loading: boolean
}

export const useTerminalPool = (
  pool?: any,
  poolAddress?: string,
  network?: Network,
  isPoolDetails = false
) => {
  const [state, setState] = useState<IState>({ loading: true, pool: undefined })
  const { account, library: provider, networkId } = useConnectedWeb3Context()
  const { multicall, rewardEscrow } = useServices(network)

  let readonlyProvider = provider

  const isWrongNetwork = networkId !== getIdFromNetwork(network)
  if (isWrongNetwork) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    readonlyProvider = getNetworkProvider(network)
  }

  const clr = new CLRService(
    readonlyProvider,
    isWrongNetwork ? null : account,
    poolAddress as string
  )

  const getTokenDetails = async (addr: string) => {
    try {
      return getTokenFromAddress(addr, readonlyProvider?.network.chainId)
    } catch (error) {
      const erc20 = new ERC20Service(
        readonlyProvider,
        isWrongNetwork ? null : account,
        addr
      )
      return erc20.getDetails()
    }
  }

  const loadInfo = async (isReloadPool = false) => {
    if (!pool && !poolAddress) return

    setState((prev) => ({ ...prev, loading: true }))

    if ((!pool && poolAddress) || isReloadPool) {
      try {
        pool = (
          await axios.get(
            `${TERMINAL_API_URL}/pool/${getAddress(poolAddress as string)}`,
            {
              params: {
                network,
              },
            }
          )
        ).data

        // Get `owner` and `manager` address off of contract
        const [owner, manager] = await Promise.all([
          clr.contract.owner(),
          clr.contract.manager(),
        ])

        pool.owner = owner
        pool.manager = manager
      } catch (e) {
        console.error('Error fetching pool details', e)
        // Fallback in case API doesn't return pool details
        pool = await getPoolDataMulticall(poolAddress as string, multicall)
      }
    }

    try {
      // console.time(`loadInfo token details ${pool.poolAddress}`)
      let { token0, token1, stakedToken } = pool
      let tvl = '0'

      const balance = await clr.contract.getStakedTokenBalance()

      const token0Balance = balance.amount0
      const token1Balance = balance.amount1

      // Fetch token details and relevant data, if API fails
      if (!pool.token0.price || !pool.token1.price) {
        ;[token0, token1, stakedToken] = await Promise.all([
          getTokenDetails(pool.token0.address),
          getTokenDetails(pool.token1.address),
          getTokenDetails(pool.stakedToken.address),
        ])

        let rates = undefined
        if (!isTestnet(readonlyProvider?.network.chainId as ChainId)) {
          const ids = await getCoinGeckoIDs([token0.symbol, token1.symbol])
          rates = await getTokenExchangeRate(ids)
        }

        pool.token0.price = rates && rates[0] ? rates[0].toString() : '0'
        pool.token1.price = rates && rates[1] ? rates[1].toString() : '0'

        const token0tvl = token0Balance
          .mul(parseEther(pool.token0.price))
          .div(ONE_ETHER)
        const token1tvl = token1Balance
          .mul(parseEther(pool.token1.price))
          .div(ONE_ETHER)

        token0.tvl = formatBigNumber(token0tvl, ETHER_DECIMAL)
        token1.tvl = formatBigNumber(token1tvl, ETHER_DECIMAL)

        tvl = (Number(token0.tvl) + Number(token1.tvl)).toString()

        const token0Percent =
          Number(tvl) === 0 ? 0 : (Number(token0.tvl) / Number(tvl)) * 100
        const token1Percent =
          Number(tvl) === 0 ? 0 : (Number(token1.tvl) / Number(tvl)) * 100

        token0.percent = token0Percent.toString()
        token1.percent = token1Percent.toString()
      } else {
        const defaultTokenLogo = '/assets/tokens/unknown.png'

        // Parse API data
        pool.tokenId = BigNumber.from(pool.tokenId)

        token0.image = token0.image || defaultTokenLogo
        token1.image = token1.image || defaultTokenLogo
        stakedToken.image = stakedToken.image || defaultTokenLogo
        pool.rewardTokens = pool.rewardTokens.map((token: IToken) => ({
          ...token,
          image: token.image || defaultTokenLogo,
          symbol: token.symbol.toUpperCase(),
        }))

        token0.symbol = token0.symbol.toUpperCase()
        token1.symbol = token1.symbol.toUpperCase()

        token0.price = token0.price.toString()
        token1.price = token1.price.toString()

        token0.percent = token0.percent.toString()
        token1.percent = token1.percent.toString()

        token0.tvl = formatBigNumber(token0.tvl, ETHER_DECIMAL)
        token1.tvl = formatBigNumber(token1.tvl, ETHER_DECIMAL)
        tvl = formatBigNumber(pool.tvl, 18)
      }
      // console.timeEnd(`loadInfo token details ${poolAddress}`)

      // Set staked balances
      token0.balance = token0Balance
      token1.balance = token1Balance

      if (pool.vestingPeriod == null) {
        pool.vestingPeriod = (
          await rewardEscrow.clrPoolVestingPeriod(pool.poolAddress)
        ).toString()
      }
      // console.timeEnd(`loadInfo vesting period ${poolAddress}`)

      if (pool.rewardTokens.length !== 0 && !pool.rewardTokens[0].price) {
        pool.rewardTokens = (await Promise.all(
          pool.rewardTokens.map((token: { address: string }) =>
            getTokenDetails(token.address)
          )
        )) as IToken[]
      }

      if (pool.totalRewardAmounts == null) {
        const rewardCalls = pool.rewardTokens.map((token: IToken) => ({
          name: 'rewardInfo',
          address: pool.poolAddress,
          params: [token.address],
        }))
        const rewardsResponse = await multicall.multicallv2(
          Abi.xAssetCLR,
          rewardCalls,
          { requireSuccess: false }
        )
        pool.totalRewardAmounts = rewardsResponse.map((response: any) =>
          response.totalRewardAmount.toString()
        )
      }

      let history: History[] = []
      let earnedTokens = []
      let vestingTokens = []
      let poolShare = '0'
      let _totalSupply = ZERO

      const user = {
        collectableFees1: ZERO,
        collectableFees0: ZERO,
        stakedTokenBalance: ZERO,
        token1Deposit: ZERO,
        token1Tvl: '0',
        token0Deposit: ZERO,
        token0Tvl: '0',
      }

      // Fetch events history, reward tokens and deposit amounts of user
      if (isPoolDetails && account) {
        const isOwnerOrManager = [
          pool.owner.toLowerCase(),
          pool.manager.toLowerCase(),
        ].includes(account.toLowerCase())

        // Fetch pool events history from subgraph
        try {
          const graphqlUrl = GRAPHQL_URLS[network as Network]
          const eventVariables = {
            poolAddress: pool.poolAddress.toLowerCase(),
            userAddress: account.toLowerCase(),
          }

          const eventsHistory = await fetchQuery(
            EVENTS_HISTORY_QUERY,
            eventVariables,
            graphqlUrl
          )

          history = _.orderBy(
            parseEventsHistory(
              eventsHistory,
              pool.rewardTokens,
              isOwnerOrManager
            ),
            'timestamp',
            'desc'
          )
        } catch (e) {
          console.error('Error while trying to fetch pool history', e)
        }

        earnedTokens = await Promise.all(
          pool.rewardTokens.map(async (token: IToken) => {
            const clr = new CLRService(
              readonlyProvider,
              account,
              pool.poolAddress
            )
            const amount = await clr.earned(account, token.address)
            return {
              ...token,
              amount,
            }
          })
        )

        if (Number(pool.vestingPeriod) !== 0) {
          vestingTokens = await Promise.all(
            pool.rewardTokens.map(async (token: any) => {
              const { amounts, timestamps, vestedAmount } =
                await rewardEscrow.getVestedBalance(
                  poolAddress as string,
                  token.address,
                  account
                )
              return amounts.map((amount, index) => {
                const timestamp = timestamps[index]
                const now = getCurrentTimeStamp()
                const diff = (timestamp.toNumber() - now) * 1000
                const durationRemaining = getTimeRemainingUnits(diff)

                return {
                  amount,
                  durationRemaining,
                  vestedAmount,
                  ...token,
                }
              })
            })
          )

          // Flatten all the vesting entries for each reward token
          vestingTokens = vestingTokens.flat()
        }

        // User deposit amounts + TVL
        const stakedCLRToken = new ethers.Contract(
          pool.stakedToken.address,
          Abi.StakedCLRToken,
          readonlyProvider
        )

        const [stakedTokenBalance, totalSupply] = await Promise.all([
          stakedCLRToken.balanceOf(account),
          clr.contract.totalSupply(),
        ])

        _totalSupply = totalSupply

        user.stakedTokenBalance = stakedTokenBalance

        user.token0Deposit = token0Balance
          .mul(stakedTokenBalance)
          .div(totalSupply)
        user.token1Deposit = token1Balance
          .mul(stakedTokenBalance)
          .div(totalSupply)

        user.token0Tvl = formatUnits(
          user.token0Deposit.mul(parseEther(pool.token0.price)).div(ONE_ETHER),
          ETHER_DECIMAL
        )

        user.token1Tvl = formatUnits(
          user.token1Deposit.mul(parseEther(pool.token1.price)).div(ONE_ETHER),
          ETHER_DECIMAL
        )

        const totalBalance = token0Balance.add(token1Balance)

        poolShare = formatEther(
          user.token0Deposit
            .add(user.token1Deposit)
            .mul(ONE_ETHER)
            .div(totalBalance)
        )

        // Get collectable fees
        if (isOwnerOrManager) {
          const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1)
          const nonfungiblePositionManagerAddress = getContractAddress(
            'uniPositionManager',
            readonlyProvider?.network.chainId
          )
          const nonfungiblePositionManagerContract = new Contract(
            nonfungiblePositionManagerAddress,
            Abi.UniswapV3Position,
            provider
          )

          const feesInfo =
            await nonfungiblePositionManagerContract.callStatic.collect({
              tokenId: pool.tokenId,
              recipient: account, // some tokens might fail if transferred to address(0)
              amount0Max: MAX_UINT128,
              amount1Max: MAX_UINT128,
            })

          user.collectableFees0 = feesInfo.amount0
          user.collectableFees1 = feesInfo.amount1
        }
      }

      const apr =
        Number(pool.periodFinish) * 1000 > Number(Date.now())
          ? pool.apr || 'N/A'
          : '0'

      setState({
        loading: false,
        pool: {
          address: pool.poolAddress,
          apr: apr.toString(),
          manager: pool.manager.toLowerCase(),
          network: pool.network || network,
          owner: pool.owner.toLowerCase(),
          periodFinish: BigNumber.from(pool.periodFinish),
          poolFee: pool.poolFee,
          rewardsAreEscrowed: pool.rewardsAreEscrowed,
          rewardState: {
            amounts: pool.totalRewardAmounts.map((reward: string) =>
              BigNumber.from(reward)
            ),
            duration: pool.rewardProgramDuration,
            errors: [],
            step: ERewardStep.Input,
            tokens: pool.rewardTokens,
            vesting: formatDuration(pool.vestingPeriod),
          },
          stakedToken,
          ticks: pool.ticks,
          token0,
          token1,
          tokenId: pool.tokenId,
          tradeFee: pool.tradeFee,
          tvl,
          uniswapPool: pool.uniswapPool,
          vestingTokens,
          earnedTokens,
          history,
          poolShare,
          user,
          totalSupply: _totalSupply,
        },
      })
    } catch (error) {
      console.error(error)
      setState(() => ({ loading: false }))
    }
    // console.timeEnd(`loadInfo ${poolAddress}`)
  }

  useEffect(() => {
    loadInfo()
    const interval = setInterval(() => loadInfo(true), POLL_API_DATA)

    return () => {
      clearInterval(interval)
    }
  }, [networkId, pool, poolAddress, account])

  return { ...state, loadInfo }
}
