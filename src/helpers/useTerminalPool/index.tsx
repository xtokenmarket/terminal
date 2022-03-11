import Abi from 'abis'
import axios from 'axios'
import { POLL_API_DATA, TERMINAL_API_URL } from 'config/constants'
import { getNetworkProvider, getTokenFromAddress } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { formatEther, formatUnits, parseEther } from 'ethers/lib/utils'
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
import { getIdFromNetwork } from 'utils/network'
import { formatDuration, ONE_ETHER } from 'utils/number'
import _ from 'lodash'
import moment from 'moment'

import {
  getCoinGeckoIDs,
  getPoolDataMulticall,
  getTokenExchangeRate,
} from './helper'
import { ethers } from 'ethers'

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
  const { multicall, rewardEscrow, lmService } = useServices(network)

  let readonlyProvider = provider

  const isWrongNetwork = networkId !== getIdFromNetwork(network)
  if (isWrongNetwork) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    readonlyProvider = getNetworkProvider(network)
  }

  const getFormatNumber = (_balance: BigNumber, _tokenDecimals: number) => {
    return Number(formatBigNumber(_balance, _tokenDecimals)) * 10000
  }

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

  const getTokenPercent = (
    balance: BigNumber,
    token0Balance: BigNumber,
    token1Balance: BigNumber,
    token0Decimals: number,
    token1Decimals: number,
    tokenDecimals: number
  ) => {
    const divisor = token0Balance.add(token1Balance)
    if (divisor.isZero()) return ''

    const balanceNumber = getFormatNumber(balance, tokenDecimals)
    const token0Number = getFormatNumber(token0Balance, token0Decimals)
    const token1Number = getFormatNumber(token1Balance, token1Decimals)

    const percent = (balanceNumber / (token0Number + token1Number)) * 100
    return percent.toString()
  }

  const loadInfo = async (isReloadPool = false) => {
    if (!pool && !poolAddress) return

    setState((prev) => ({ ...prev, loading: true }))

    if ((!pool && poolAddress) || isReloadPool) {
      try {
        pool = (
          await axios.get(`${TERMINAL_API_URL}/pool/${poolAddress}`, {
            params: {
              network,
            },
          })
        ).data
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

      const clr = new CLRService(
        readonlyProvider,
        isWrongNetwork ? null : account,
        pool.poolAddress
      )
      const balance = await clr.contract.getStakedTokenBalance()

      const token0Balance = balance.amount0
      const token1Balance = balance.amount1

      pool.token0.balance = token0Balance
      pool.token1.balance = token1Balance

      // Fetch token details and relevant data, if API fails
      if (!pool.token0.price || !pool.token1.price) {
        ;[token0, token1, stakedToken] = await Promise.all([
          getTokenDetails(pool.token0.address),
          getTokenDetails(pool.token1.address),
          getTokenDetails(pool.stakedToken.address),
        ])

        const ids = await getCoinGeckoIDs([token0.symbol, token1.symbol])
        const rates = await getTokenExchangeRate(ids)
        pool.token0.price = rates ? rates[0].toString() : '0'
        pool.token1.price = rates ? rates[1].toString() : '0'

        const token0Percent = getTokenPercent(
          token0Balance,
          token0Balance,
          token1Balance,
          token0.decimals,
          token1.decimals,
          token0.decimals
        )
        const token1Percent = getTokenPercent(
          token1Balance,
          token0Balance,
          token1Balance,
          token0.decimals,
          token1.decimals,
          token1.decimals
        )

        const token0tvl = token0Balance
          .mul(parseEther(pool.token0.price))
          .div(ONE_ETHER)
        const token1tvl = token1Balance
          .mul(parseEther(pool.token1.price))
          .div(ONE_ETHER)

        token0.percent = token0Percent
        token1.percent = token1Percent
        token0.tvl = formatBigNumber(token0tvl, token0.decimals)
        token1.tvl = formatBigNumber(token1tvl, token1.decimals)
        tvl = formatBigNumber(token0tvl.add(token1tvl), token0.decimals)
      } else {
        // Parse API data
        token0.image = token0.image || '/assets/tokens/unknown.png'
        token1.image = token1.image || '/assets/tokens/unknown.png'
        stakedToken.image = stakedToken.image || '/assets/tokens/unknown.png'
        pool.rewardTokens = pool.rewardTokens.map((token: IToken) => ({
          ...token,
          image: token.image || '/assets/tokens/unknown.png',
        }))

        token0.percent = token0.percent.toString()
        token1.percent = token1.percent.toString()
        token0.tvl = formatBigNumber(token0.tvl, token0.decimals)
        token1.tvl = formatBigNumber(token1.tvl, token1.decimals)
        tvl = formatBigNumber(BigNumber.from(pool.tvl), 18)
      }
      // console.timeEnd(`loadInfo token details ${poolAddress}`)

      if (pool.vestingPeriod == null) {
        pool.vestingPeriod = (
          await rewardEscrow.clrPoolVestingPeriod(pool.poolAddress)
        ).toString()
      }
      // console.timeEnd(`loadInfo vesting period ${poolAddress}`)

      if (!pool.rewardTokens[0].price) {
        pool.rewardTokens = (await Promise.all(
          pool.rewardTokens.map((token: { address: string }) =>
            getTokenDetails(token.address)
          )
        )) as IToken[]
      }

      if (pool.rewardsPerToken == null) {
        const rewardCalls = pool.rewardTokens.map((token: IToken) => ({
          name: 'rewardPerToken',
          address: pool.poolAddress,
          params: [token.address],
        }))
        const rewardsResponse = await multicall.multicallv2(
          Abi.xAssetCLR,
          rewardCalls,
          { requireSuccess: false }
        )
        pool.rewardsPerToken = rewardsResponse.map((response: any) =>
          response[0].toString()
        )
      }

      let history: History[] = []
      let earnedTokens = []
      let vestingTokens = []
      let poolShare = '0'
      const user = {
        token0Deposit: BigNumber.from(0),
        token1Deposit: BigNumber.from(0),
        token0Tvl: '0',
        token1Tvl: '0',
        stakedTokenBalance: BigNumber.from(0),
      }
      let _totalSupply = BigNumber.from(0)

      // Fetch events history and reward tokens only on PoolDetails page
      if (isPoolDetails) {
        const depositFilter = clr.contract.filters.Deposit()
        const withdrawFilter = clr.contract.filters.Withdraw()
        const rewardClaimedFilter = clr.contract.filters.RewardClaimed()
        const InitiatedRewardsFilter =
          lmService.contract.filters.InitiatedRewardsProgram(poolAddress)
        const VestedFilter = rewardEscrow.contract.filters.Vested(poolAddress)
        const RewardAddedFilter = clr.contract.filters.RewardAdded()

        const [
          depositHistory,
          withdrawHistory,
          rewardClaimedHistory,
          InitiatedRewardsHistory,
          VestHistory,
          RewardAddedHistory,
        ] = await Promise.all([
          clr.contract.queryFilter(depositFilter),
          clr.contract.queryFilter(withdrawFilter),
          clr.contract.queryFilter(rewardClaimedFilter),
          lmService.contract.queryFilter(InitiatedRewardsFilter),
          rewardEscrow.contract.queryFilter(VestedFilter),
          clr.contract.queryFilter(RewardAddedFilter),
        ])

        const allHistory = [
          ...depositHistory,
          ...withdrawHistory,
          ...rewardClaimedHistory,
          ...InitiatedRewardsHistory,
          ...VestHistory,
        ]

        const blockInfos = await Promise.all(
          allHistory.map((x) => x.getBlock())
        )

        const eventHistory = allHistory.map((x, index) => {
          const timestamp = blockInfos[index].timestamp
          const time = moment.unix(timestamp).format('LLLL')

          const eventName: {
            [key: string]: string
          } = {
            RewardClaimed: 'Claim',
            Deposit: 'Deposit',
            Withdraw: 'Withdraw',
            InitiatedRewardsProgram: 'Initiate Rewards',
            Vested: 'Vest',
          }

          const token = pool.rewardTokens.find(
            (token: IToken) => token.address === x.args?.token
          )

          const totalRewardAmounts =
            RewardAddedHistory.length > 0
              ? RewardAddedHistory.map((history) => history.args?.reward)
              : [BigNumber.from(0)]

          return {
            action: x.event ? eventName[x.event] : '',
            amount0: x.args?.amount0 || BigNumber.from(0),
            amount1: x.args?.amount1 || BigNumber.from(0),
            time,
            tx: x.transactionHash,
            rewardAmount: x.args?.rewardAmount || BigNumber.from(0),
            symbol: token ? token.symbol : '',
            decimals: token ? Number(token.decimals) : 0,
            value: x.args?.value,
            timestamp,
            totalRewardAmounts,
            rewardTokens: pool.rewardTokens,
          }
        })

        history = _.orderBy(eventHistory, 'timestamp', 'desc')

        // Fetch reward tokens and deposit amounts, only if wallet is connected
        if (account) {
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
                const { timestamp, amount } =
                  await rewardEscrow.getNextVestingEntry(
                    poolAddress as string,
                    token.address,
                    account
                  )
                const now = getCurrentTimeStamp()
                const diff = (timestamp - now) * 1000
                const durationRemaining = getTimeRemainingUnits(diff)
                const vestedAmount = await rewardEscrow.getVestedBalance(
                  poolAddress as string,
                  token.address,
                  account
                )
                return {
                  amount,
                  durationRemaining,
                  vestedAmount,
                  ...token,
                }
              })
            )
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
            user.token0Deposit
              .mul(parseEther(pool.token0.price))
              .div(ONE_ETHER),
            pool.token0.decimals
          )

          user.token1Tvl = formatUnits(
            user.token1Deposit
              .mul(parseEther(pool.token1.price))
              .div(ONE_ETHER),
            pool.token1.decimals
          )

          const totalBalance = token0Balance.add(token1Balance)

          poolShare = formatEther(
            user.token0Deposit
              .add(user.token1Deposit)
              .mul(ONE_ETHER)
              .div(totalBalance)
          )
        }
      }

      setState({
        loading: false,
        pool: {
          address: pool.poolAddress,
          manager: pool.manager.toLowerCase(),
          network: pool.network,
          owner: pool.owner.toLowerCase(),
          periodFinish: BigNumber.from(pool.periodFinish),
          poolFee: pool.poolFee,
          rewardsAreEscrowed: pool.rewardsAreEscrowed,
          rewardState: {
            amounts: pool.rewardsPerToken.map((reward: string) =>
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
          vestingTokens: vestingTokens.length ? vestingTokens : undefined,
          earnedTokens,
          history,
          poolShare,
          user,
          totalSupply: _totalSupply,
        },
      })
    } catch (error) {
      console.error('useTerminalPool', error)
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
  }, [networkId, pool, poolAddress])

  return { ...state, loadInfo }
}
