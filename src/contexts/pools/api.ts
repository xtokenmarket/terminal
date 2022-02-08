import axios from 'axios'
import { DefaultReadonlyProvider, getTokenFromAddress } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { ERC20Service } from 'services'
import { ITerminalPool } from 'types'
import { ERewardStep } from 'utils/enums'
import { formatDuration } from 'utils/number'

const URL = 'http://3.8.192.52:3000/api'

interface ITerminalApiPool {
  poolAddress: string
  token0: string
  token1: string
  stakedToken: string
  tokenId: string
  token0DecimalMultiplier: string
  token1DecimalMultiplier: string
  tokenDiffDecimalMultiplier: string
  tradeFee: string
  poolFee: number
  uniswapPool: string
  rewardsPerToken: string[]
  rewardProgramDuration: string
  rewardTokens: string[]
  vestingPeriod: number  
  rewardsAreEscrowed: boolean
  owner: string
  periodFinish: string
  ticks: {
    tick0: number
    tick1: number
  }
  manager: string
  tvl: string

  // TODO: include in ITerminalPool type?
  apr: string

  // TODO: do we use this?
  rewardsPerWeek: string[]
}

export const usePoolsApi = () => {
  const { account, library: provider, networkId } = useConnectedWeb3Context()

  const fetchAllPools = async () => {
    const { data } = await axios.get<ITerminalApiPool[]>(URL + '/pools', {
      params: {
       limit: 10,
      },
    })
    
    const pools = await Promise.all(data.map(async pool => {
      const rewardTokens = await Promise.all(pool.rewardTokens.map(async addr => {
        try {
          getTokenFromAddress(addr, networkId)
        } catch (e) {
          // TODO: should this catch just be part of getTokenFromAddress?
          const erc20 = new ERC20Service(
            provider || DefaultReadonlyProvider,
            account,
            addr
          )
          const token = await erc20.getDetails()
          return token
        }
      }))
      return {
        address: pool.poolAddress,
        token0: pool.token0,
        token1: pool.token1,
        stakedToken: pool.stakedToken,
        tokenId: pool.tokenId,
        token0DecimalMultiplier: pool.token0DecimalMultiplier,
        token1DecimalMultiplier: pool.token1DecimalMultiplier,
        tokenDiffDecimalMultiplier: pool.tokenDiffDecimalMultiplier,
        tradeFee: pool.tradeFee,
        poolFee: pool.poolFee,
        uniswapPool: pool.uniswapPool,
        rewardState: {
          amounts: pool.rewardsPerToken,
          duration: pool.rewardProgramDuration,
          errors: [],
          step: ERewardStep.Input,
          vesting: formatDuration(pool.vestingPeriod.toString()),
          tokens: rewardTokens,
        },
        rewardsAreEscrowed: pool.rewardsAreEscrowed,
        owner: pool.owner.toLowerCase(),
        periodFinish: pool.periodFinish,
        ticks: pool.ticks,
        manager: pool.manager,
        tvl: pool.tvl,
      }
    }))

    return pools
  }

  return {
    fetchAllPools,
  }
}