import Abi from 'abis'
import { DefaultReadonlyProvider, getTokenFromAddress } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { useServices } from 'helpers'
import { useEffect, useState } from 'react'
import { ERC20Service } from 'services'
import { ITerminalPool, IToken } from 'types'

import { BigNumber as BigNumberEther } from '@ethersproject/bignumber'
import { BigNumber } from 'bignumber.js'
interface IState {
  pool?: ITerminalPool
  loading: boolean
}

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

  const getERC20TokenBalance = async(tokenAddress: string, uniswapPool: string) => {
    if(!account) return BigNumberEther.from(0)
    const erc20 = new ERC20Service(provider, uniswapPool, tokenAddress)
    const bal = await erc20.getBalanceOf(uniswapPool)
    return bal
  }

  const getTokenPercent = (balance: BigNumberEther, token0Balance: BigNumberEther, token1Balance: BigNumberEther) => {
    const divisor = token0Balance.add(token1Balance)
    const bigNumberBalance = new BigNumber(balance.toString())
    const bigNumbertoken0Balance = new BigNumber(token0Balance.toString())
    const bigNumbertoken1Balance = new BigNumber(token1Balance.toString())
  
    if(Number(divisor.toString()) === 0) return ""
  
    const percent = bigNumberBalance.div(bigNumbertoken0Balance.plus(bigNumbertoken1Balance)).multipliedBy(100).decimalPlaces(2).toString()
    return percent
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
      
      const token0Balance = await getERC20TokenBalance(token0Address, uniswapPool)
      const token1Balance = await getERC20TokenBalance(token1Address, uniswapPool)

      const token0Percent = getTokenPercent(token0Balance, token0Balance, token1Balance)
      const token1Percent = getTokenPercent(token1Balance, token0Balance, token1Balance)
      
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
          rewardTokens,
          rewardsDuration,
          rewardsAreEscrowed,
          owner: owner.toLowerCase(),
          periodFinish,
          vestingPeriod,
          ticks: {
            tick0: ticks[0],
            tick1: ticks[1],
          },
          rewardsPerToken,
          manager,
          token0Percent,
          token1Percent
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
