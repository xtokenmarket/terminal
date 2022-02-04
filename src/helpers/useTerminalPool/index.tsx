import Abi from 'abis'
import { DefaultReadonlyProvider, getTokenFromAddress } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { useServices } from 'helpers'
import { useEffect, useState } from 'react'
import { ERC20Service } from 'services'
import { ITerminalPool, IToken } from 'types'
import { BigNumber } from '@ethersproject/bignumber'
import { formatBigNumber } from 'utils'
import { getCoinGeckoIDs, getTokenExchangeRate } from './helper'
import { ERewardStep } from 'utils/enums'
import { formatDuration } from 'utils/number'

interface IState {
  pool?: ITerminalPool
  loading: boolean
}

const MULTIPLY_PRECISION = 1000000

export const useTerminalPool = (poolAddress: string) => {
  const [state, setState] = useState<IState>({ loading: true })
  const { account, library: provider, networkId } = useConnectedWeb3Context()
  const { multicall, rewardEscrow } = useServices()

  const getTokenDetails = async (addr: string) => {
    try {
      const token = getTokenFromAddress(addr, networkId)
      return token
    } catch (error) {
      const erc20 = new ERC20Service(
        provider || DefaultReadonlyProvider,
        account,
        addr
      )
      const token = await erc20.getDetails()
      return token
    }
  }

  const getERC20TokenBalance = async (
    tokenAddress: string,
    uniswapPool: string
  ) => {
    if (!account) return BigNumber.from(0)
    const erc20 = new ERC20Service(provider, uniswapPool, tokenAddress)
    const bal = await erc20.getBalanceOf(uniswapPool)
    return bal
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

  const loadInfo = async () => {
    setState((prev) => ({ ...prev, loading: true }))
    // console.time(`loadInfo ${poolAddress}`)
    try {
      // console.time(`loadInfo multicall ${poolAddress}`)
      const calls = [
        'token0',
        'token1',
        'stakedToken',
        'tokenId',
        'token0DecimalMultiplier',
        'token1DecimalMultiplier',
        'tokenDiffDecimalMultiplier',
        'tradeFee',
        'poolFee',
        'uniswapPool',
        'getRewardTokens',
        'rewardsDuration',
        'rewardsAreEscrowed',
        'owner',
        'periodFinish',
        'getTicks',
        'manager',
      ].map((method) => ({
        name: method,
        address: poolAddress,
        params: [],
      }))
      const [
        [token0Address],
        [token1Address],
        [stakedTokenAddress],
        [tokenId],
        [token0DecimalMultiplier],
        [token1DecimalMultiplier],
        [tokenDiffDecimalMultiplier],
        [tradeFee],
        [poolFee],
        [uniswapPool],
        [rewardTokenAddresses],
        [rewardsDuration],
        [rewardsAreEscrowed],
        [owner],
        [periodFinish],
        ticks,
        [manager],
      ] = await multicall.multicallv2(Abi.xAssetCLR, calls, {
        requireSuccess: false,
      })
      // console.timeEnd(`loadInfo multicall ${poolAddress}`)

      // console.time(`loadInfo token details ${poolAddress}`)
      const [token0, token1, stakedToken] = await Promise.all([
        getTokenDetails(token0Address),
        getTokenDetails(token1Address),
        getTokenDetails(stakedTokenAddress),
      ])

      const token0Balance = await getERC20TokenBalance(
        token0Address,
        uniswapPool
      )
      const token1Balance = await getERC20TokenBalance(
        token1Address,
        uniswapPool
      )

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

      const ids = await getCoinGeckoIDs([token0.symbol, token1.symbol])
      const rates = await getTokenExchangeRate(ids)

      let tvl = ''
      let token0tvl = BigNumber.from('0')
      let token1tvl = BigNumber.from('0')
      if (rates) {
        token0tvl = token0Balance
          .mul(rates[0] * MULTIPLY_PRECISION)
          .div(MULTIPLY_PRECISION)
        token1tvl = token1Balance
          .mul(rates[1] * MULTIPLY_PRECISION)
          .div(MULTIPLY_PRECISION)
        tvl = formatBigNumber(token0tvl.add(token1tvl), token0.decimals)
        token0.tvl = formatBigNumber(token0tvl, token0.decimals)
        token1.tvl = formatBigNumber(token1tvl, token1.decimals)
        token0.percent = token0Percent
        token1.percent = token1Percent
      }

      // console.timeEnd(`loadInfo token details ${poolAddress}`)

      // console.time(`loadInfo vesting period ${poolAddress}`)
      const vestingPeriod = await rewardEscrow.clrPoolVestingPeriod(poolAddress)
      // console.timeEnd(`loadInfo vesting period ${poolAddress}`)

      // console.time(`loadInfo reward tokens ${poolAddress}`)
      const rewardTokens = (await Promise.all(
        rewardTokenAddresses.map((addr: string) => getTokenDetails(addr))
      )) as IToken[]
      // console.timeEnd(`loadInfo reward tokens ${poolAddress}`)

      const rewardCalls = rewardTokens.map((token) => ({
        name: 'rewardPerToken',
        address: poolAddress,
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

      setState((prev) => ({
        ...prev,
        loading: false,
        pool: {
          address: poolAddress,
          token0,
          token1,
          stakedToken,
          tokenId,
          token0DecimalMultiplier,
          token1DecimalMultiplier,
          tokenDiffDecimalMultiplier,
          tradeFee,
          poolFee,
          uniswapPool,
          rewardState: {
            amounts: rewardsPerToken,
            duration: String(rewardsDuration),
            errors: [],
            step: ERewardStep.Input,
            tokens: rewardTokens,
            vesting: formatDuration(vestingPeriod.toString()),
          },
          rewardsAreEscrowed,
          owner: owner.toLowerCase(),
          periodFinish,
          ticks: {
            tick0: ticks[0],
            tick1: ticks[1],
          },
          manager,
          tvl,
        },
      }))
    } catch (error) {
      console.error(error)
      setState(() => ({ loading: false }))
    }
    // console.timeEnd(`loadInfo ${poolAddress}`)
  }

  useEffect(() => {
    loadInfo()
    const interval = setInterval(loadInfo, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [networkId, poolAddress])

  return { ...state, loadInfo }
}
