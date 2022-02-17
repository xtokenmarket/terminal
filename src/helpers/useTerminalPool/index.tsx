import Abi from 'abis'
import axios from 'axios'
import { POLL_API_DATA, TERMINAL_API_URL } from 'config/constants'
import { getNetworkProvider, getTokenFromAddress } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { parseEther } from 'ethers/lib/utils'
import { useServices } from 'helpers'
import { useEffect, useState } from 'react'
import { CLRService, ERC20Service } from 'services'
import { ITerminalPool, IToken } from 'types'
import { BigNumber } from '@ethersproject/bignumber'
import { formatBigNumber } from 'utils'
import { ERewardStep, Network } from 'utils/enums'
import { formatDuration, ONE_ETHER } from 'utils/number'
import _ from 'lodash'

import {
  getCoinGeckoIDs,
  getPoolDataMulticall,
  getTokenExchangeRate,
} from './helper'
import moment from 'moment'

interface IState {
  pool?: ITerminalPool
  loading: boolean
}

// TODO: Remove this and leverage `parseEther()` & `formatEther()`
const MULTIPLY_PRECISION = 1000000

export const useTerminalPool = (
  pool?: any,
  poolAddress?: string,
  network?: Network
) => {
  const [state, setState] = useState<IState>({ loading: true, pool: undefined })
  const { account, library: provider, networkId } = useConnectedWeb3Context()
  const { multicall, rewardEscrow } = useServices(network)

  const getTokenDetails = async (addr: string) => {
    try {
      return getTokenFromAddress(addr, networkId)
    } catch (error) {
      const erc20 = new ERC20Service(
        provider || getNetworkProvider(network),
        account,
        addr
      )
      return erc20.getDetails()
    }
  }

  const getERC20TokenBalance = async (
    tokenAddress: string,
    uniswapPool: string
  ) => {
    if (!account) return BigNumber.from(0)
    const erc20 = new ERC20Service(
      provider || getNetworkProvider(network),
      uniswapPool,
      tokenAddress
    )
    return erc20.getBalanceOf(uniswapPool)
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
    const getFormatNumber = (_balance: BigNumber, _tokenDecimals: number) => {
      return (
        Number(formatBigNumber(_balance, _tokenDecimals)) * MULTIPLY_PRECISION
      )
    }

    if (Number(divisor.toString()) === 0) return ''
    const balanceNumber = getFormatNumber(balance, tokenDecimals)
    const token0Number = getFormatNumber(token0Balance, token0Decimals)
    const token1Number = getFormatNumber(token1Balance, token1Decimals)
    const percent = (balanceNumber / (token0Number + token1Number)) * 100

    return JSON.stringify(percent)
  }

  const loadInfo = async (isReloadPool = false) => {
    // console.log('loadInfo', pool, poolAddress)
    if (!pool && !poolAddress) return

    setState((prev) => ({ ...prev, loading: true }))

    if ((!pool && poolAddress) || isReloadPool) {
      pool = (
        await axios.get(`${TERMINAL_API_URL}/pool/${poolAddress}`, {
          params: {
            network,
          },
        })
      ).data

      // Fallback in case the pool is recently deployed
      if (!pool) {
        pool = await getPoolDataMulticall(poolAddress as string, multicall)
      }
    }

    try {
      // console.time(`loadInfo token details ${pool.poolAddress}`)
      let { token0, token1, stakedToken } = pool
      let tvl = '0'

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

        const [token0Balance, token1Balance] = await Promise.all([
          getERC20TokenBalance(token0.address, pool.uniswapPool),
          getERC20TokenBalance(token1.address, pool.uniswapPool),
        ])
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

      // console.time(`loadInfo vesting period ${poolAddress}`)
      const vestingPeriod = await rewardEscrow.clrPoolVestingPeriod(
        pool.poolAddress
      )
      // console.timeEnd(`loadInfo vesting period ${poolAddress}`)

      if (!pool.rewardTokens[0].price) {
        pool.rewardTokens = (await Promise.all(
          pool.rewardTokens.map((token: { address: string }) =>
            getTokenDetails(token.address)
          )
        )) as IToken[]
      }

      // TODO: Replace with `rewardsPerToken` from API response
      const rewardCalls = pool.rewardTokens.map((token: IToken) => ({
        name: 'rewardPerToken',
        address: pool.poolAddress,
        params: [token.address],
      }))

      // console.time(`loadInfo rewards response ${poolAddress}`)
      const rewardsResponse = await multicall.multicallv2(
        Abi.xAssetCLR,
        rewardCalls,
        { requireSuccess: false }
      )
      // console.timeEnd(`loadInfo rewards response ${poolAddress}`)

      const rewardsPerToken = rewardsResponse.map(
        (response: any) => response[0]
      )

      const clr = new CLRService(provider, account, pool.poolAddress)

      const depositFilter = clr.contract.filters.Deposit()
      const withdrawFilter = clr.contract.filters.Withdraw()

      const [depositHistory, withdrawHistory] = await Promise.all([
        clr.contract.queryFilter(depositFilter),
        clr.contract.queryFilter(withdrawFilter),
      ])

      const blockInfos = await Promise.all(
        [...depositHistory, ...withdrawHistory].map((x) => x.getBlock())
      )

      let history = [...depositHistory, ...withdrawHistory].map((x, index) => {
        const timestamp = blockInfos[index].timestamp
        const time = moment.unix(timestamp).format('LLLL')

        return {
          action: x.event,
          amount: x.args,
          amount0: x.args?.amount0,
          amount1: x.args?.amount1,
          time,
          tx: x.transactionHash,
          timestamp,
        }
      })

      history = _.orderBy(history, 'timestamp', 'desc')

      setState({
        loading: false,
        pool: {
          address: pool.poolAddress,
          manager: pool.manager.toLowerCase(),
          network: Network.KOVAN,
          owner: pool.owner.toLowerCase(),
          periodFinish: BigNumber.from(pool.periodFinish),
          poolFee: pool.poolFee,
          rewardsAreEscrowed: pool.rewardsAreEscrowed,
          rewardState: {
            amounts: rewardsPerToken,
            duration: pool.rewardProgramDuration,
            errors: [],
            step: ERewardStep.Input,
            tokens: pool.rewardTokens,
            vesting: formatDuration(vestingPeriod.toString()),
          },
          stakedToken,
          ticks: pool.ticks,
          token0,
          token1,
          tokenId: pool.tokenId,
          tradeFee: pool.tradeFee,
          tvl,
          uniswapPool: pool.uniswapPool,
          history,
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
    const interval = setInterval(loadInfo, POLL_API_DATA)

    return () => {
      clearInterval(interval)
    }
  }, [networkId, pool, poolAddress])

  return { ...state, loadInfo }
}
