import { BigNumber, Contract, Wallet, ethers } from 'ethers'
import { ICreatePoolData, Maybe } from 'types'
import Abi from 'abis'
import { parseDuration } from 'utils/number'
import { getSortedToken } from 'utils/token'
import { Interface } from '@ethersproject/abi'
import { NULL_ADDRESS } from 'config/constants'

const lmAbi = Abi.LMTerminal

class LMService {
  provider: any
  contract: Contract

  constructor(provider: any, signerAddress: Maybe<string>, address: string) {
    this.provider = provider
    if (signerAddress) {
      const signer: Wallet = provider.getSigner()
      this.contract = new ethers.Contract(address, lmAbi, provider).connect(
        signer
      )
    } else {
      this.contract = new ethers.Contract(address, lmAbi, provider)
    }
  }

  get address(): string {
    return this.contract.address
  }

  getRewardFee = async (): Promise<BigNumber> => {
    return this.contract.rewardFee()
  }

  isCustomFeeEnabled = async (address: string): Promise<boolean> => {
    return this.contract.customDeploymentFeeEnabled(address)
  }

  getCustomFee = async (address: string): Promise<BigNumber> => {
    return this.contract.customDeploymentFee(address)
  }

  provideLiquidity = async (
    clrPool: string,
    inputAsset: number,
    amount: BigNumber
  ): Promise<string> => {
    const transactionObject = await this.contract.provideLiquidity(
      clrPool,
      inputAsset,
      amount
    )
    console.log(`provideLiquidity transaction hash: ${transactionObject.hash}`)

    return transactionObject.hash
  }

  waitUntilProvideLiquidity = async (
    clrPool: string,
    inputAsset: number,
    amount: BigNumber,
    account: string,
    txId: string
  ): Promise<string> => {
    let resolved = false
    return new Promise((resolve) => {
      this.contract.on(
        'ProvidedLiquidity',
        (
          clrPoolAddress: string,
          sender: string,
          inputAssetType: any,
          amountStr: any,
          ...rest
        ) => {
          if (
            clrPool.toLowerCase() === clrPoolAddress.toLowerCase() &&
            inputAsset === BigNumber.from(inputAssetType).toNumber() &&
            account.toLowerCase() === sender.toLowerCase() &&
            amount.eq(BigNumber.from(amountStr))
          ) {
            if (!resolved) {
              resolved = true
              resolve(rest[0].transactionHash)
            }
          }
        }
      )

      this.contract.provider.waitForTransaction(txId).then(() => {
        if (!resolved) {
          resolved = true
          resolve(txId)
        }
      })
    })
  }

  parseProvideLiquidityTx = async (
    txId: string
  ): Promise<{
    amount0: BigNumber
    amount1: BigNumber
    liquidity: BigNumber
  } | null> => {
    const { logs } = await this.contract.provider.getTransactionReceipt(txId)
    const uniPositionInterface = new Interface(Abi.UniswapV3Position)
    for (let index = 0; index < logs.length; index++) {
      const log = logs[index]
      try {
        const parsed = uniPositionInterface.parseLog(log)
        if (parsed.name === 'IncreaseLiquidity') {
          return {
            amount0: parsed.args[2],
            amount1: parsed.args[3],
            liquidity: parsed.args[1],
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
    return null
  }

  removeLiquidity = async (
    clrPool: string,
    amount: BigNumber
  ): Promise<string> => {
    const transactionObject = await this.contract.removeLiquidity(
      clrPool,
      amount
    )
    console.log(`removeLiquidity transaction hash: ${transactionObject.hash}`)

    return transactionObject.hash
  }

  removeLiquidityAndClaimReward = async (
    clrPool: string,
    amount: BigNumber
  ): Promise<string> => {
    const transactionObject = await this.contract.removeLiquidityAndClaimReward(
      clrPool,
      amount
    )
    console.log(`removeLiquidity transaction hash: ${transactionObject.hash}`)

    return transactionObject.hash
  }

  waitUntilRemoveLiquidity = async (
    clrPool: string,
    amount: BigNumber,
    account: string,
    txId: string
  ): Promise<string> => {
    let resolved = false
    return new Promise((resolve) => {
      this.contract.on(
        'RemovedLiquidity',
        (clrPoolAddress: string, sender: string, amountStr: any, ...rest) => {
          if (
            clrPool.toLowerCase() === clrPoolAddress.toLowerCase() &&
            account.toLowerCase() === sender.toLowerCase() &&
            amount.eq(BigNumber.from(amountStr))
          ) {
            if (!resolved) {
              resolved = true
              resolve(rest[0].transactionHash)
            }
          }
        }
      )

      this.contract.provider.waitForTransaction(txId).then(() => {
        if (!resolved) {
          resolved = true
          resolve(txId)
        }
      })
    })
  }

  parseRemoveLiquidityTx = async (
    txId: string
  ): Promise<{
    amount0: BigNumber
    amount1: BigNumber
    liquidity: BigNumber
  } | null> => {
    const { logs } = await this.contract.provider.getTransactionReceipt(txId)
    const uniPositionInterface = new Interface(Abi.UniswapV3Position)
    for (let index = 0; index < logs.length; index++) {
      const log = logs[index]
      try {
        const parsed = uniPositionInterface.parseLog(log)
        if (parsed.name === 'DecreaseLiquidity') {
          return {
            amount0: parsed.args[2],
            amount1: parsed.args[3],
            liquidity: parsed.args[1],
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
    return null
  }

  parseClaimTx = async (
    txId: string
  ): Promise<{
    [key: string]: BigNumber
  }> => {
    const result: {
      [key: string]: BigNumber
    } = {}
    const { logs } = await this.contract.provider.getTransactionReceipt(txId)
    const uniPositionInterface = new Interface(Abi.CLRV0)
    for (let index = 0; index < logs.length; index++) {
      const log = logs[index]
      try {
        const parsed = uniPositionInterface.parseLog(log)
        if (parsed.name === 'RewardClaimed') {
          result[String(parsed.args[1]).toLowerCase()] = parsed.args[2]
        }
      } catch (error) {
        console.error(error)
      }
    }
    return result
  }

  // initiate rewards program
  initiateRewardsProgram = async (
    clrPool: string,
    amounts: BigNumber[],
    duration: number
  ): Promise<string> => {
    const transactionObject = await this.contract.initiateRewardsProgram(
      clrPool,
      amounts,
      duration
    )
    console.log(
      `initiateRewardsProgram transaction hash: ${transactionObject.hash}`
    )
    return transactionObject.hash
  }

  // initiate new rewards program
  initiateNewRewardsProgram = async (
    clrPool: string,
    amounts: BigNumber[],
    duration: number
  ): Promise<string> => {
    const transactionObject = await this.contract.initiateNewRewardsProgram(
      clrPool,
      amounts,
      duration
    )
    console.log(
      `initiateNewRewardsProgram transaction hash: ${transactionObject.hash}`
    )
    return transactionObject.hash
  }

  waitUntilRewardsProgramInitiated = async (
    clrPool: string,
    amounts: BigNumber[],
    duration: number,
    txId: string
  ): Promise<string> => {
    let resolved = false
    return new Promise((resolve) => {
      this.contract.on(
        'InitiatedRewardsProgram',
        (
          clrPoolAddress: string,
          rewardTokens: string[],
          rewardAmounts: string[],
          durationStr: any,
          ...rest
        ) => {
          if (
            clrPool.toLowerCase() === clrPoolAddress.toLowerCase() &&
            duration === BigNumber.from(durationStr).toNumber()
          ) {
            if (!resolved) {
              resolved = true
              resolve(rest[0].transactionHash)
            }
          }
        }
      )

      this.contract.provider.waitForTransaction(txId).then(() => {
        if (!resolved) {
          resolved = true
          resolve(txId)
        }
      })
    })
  }

  getPool = async (
    token0: string,
    token1: string,
    tier: BigNumber
  ): Promise<string> => {
    return this.contract.getPool(...getSortedToken(token0, token1), tier)
  }

  deployUniswapPool = async (
    token0: string,
    token1: string,
    tier: BigNumber,
    initPrice: any
  ): Promise<string> => {
    const transactionObject = await this.contract.deployUniswapPool(
      token0,
      token1,
      tier,
      initPrice,
      {
        value: '0x0',
      }
    )
    console.log(`deployUniswapPool transaction hash: ${transactionObject.hash}`)
    return transactionObject.hash
  }

  waitUntilPoolCreated = async (
    tokenA: string,
    tokenB: string,
    tier: BigNumber,
    txId: string
  ): Promise<string> => {
    const [token0, token1] = getSortedToken(tokenA, tokenB)
    let resolved = false

    return new Promise((resolve) => {
      this.contract.on('DeployedUniV3Pool', (pool, t0, t1, fee, ...rest) => {
        if (
          t0.toLowerCase() === token0 &&
          t1.toLowerCase() === token1 &&
          tier.eq(BigNumber.from(fee))
        ) {
          if (!resolved) {
            resolved = true
            resolve(rest[0].transactionHash)
          }
        }
      })

      this.contract.provider.waitForTransaction(txId).then(() => {
        if (!resolved) {
          resolved = true
          resolve(txId)
        }
      })
    })
  }

  parsePoolCreatedTx = async (txId: string): Promise<string> => {
    const { logs } = await this.contract.provider.getTransactionReceipt(txId)

    const filteredLogs = logs.filter(
      (log) => log.address.toLowerCase() === this.contract.address.toLowerCase()
    )

    const uniPositionInterface = new Interface(Abi.LMTerminal)
    for (let index = 0; index < filteredLogs.length; index++) {
      const log = filteredLogs[index]
      try {
        const parsed = uniPositionInterface.parseLog(log)
        if (parsed.name === 'DeployedUniV3Pool') {
          return parsed.args[0]
        }
      } catch (error) {
        console.error(error)
      }
    }
    return NULL_ADDRESS
  }

  claimReward = async (clrPool: string): Promise<string> => {
    const transactionObject = await this.contract.claimReward(clrPool)
    console.log(`claimReward transaction hash: ${transactionObject.hash}`)

    return transactionObject.hash
  }

  waitUntilClaimReward = async (
    account: string,
    txId: string
  ): Promise<string> => {
    let resolved = false
    return new Promise((resolve) => {
      this.contract.on(
        'ClaimedReward',
        (clrPool: string, sender: any, ...rest) => {
          if (account.toLowerCase() === sender.toLowerCase()) {
            if (!resolved) {
              resolved = true
              resolve(rest[0].transactionHash)
            }
          }
        }
      )

      this.contract.provider.waitForTransaction(txId).then(() => {
        if (!resolved) {
          resolved = true
          resolve(txId)
        }
      })
    })
  }

  deployIncentivizedPool = async (
    poolData: ICreatePoolData,
    deploymentFee?: BigNumber
  ): Promise<string> => {
    // Default deployment fee
    deploymentFee = await this.contract.deploymentFee()

    const isTokenSorted = BigNumber.from(poolData.token0.address).lt(
      BigNumber.from(poolData.token1.address)
    )

    const _sortedToken0 = isTokenSorted ? poolData.token0 : poolData.token1
    const _sortedToken1 = isTokenSorted ? poolData.token1 : poolData.token0

    // Includes fee tier as part of symbol
    const symbol = `${_sortedToken0.symbol}-${_sortedToken1.symbol}-CLR-${
      poolData.tier.toNumber() / 100
    }bps`

    const rewardsProgram = {
      rewardTokens: poolData.rewardState.tokens.map((token) => token.address),
      vestingPeriod: parseDuration(poolData.rewardState.vesting),
    }

    const poolDetails = {
      amount0: isTokenSorted ? poolData.amount0 : poolData.amount1,
      amount1: isTokenSorted ? poolData.amount1 : poolData.amount0,
      fee: poolData.tier,
      token0: _sortedToken0.address,
      token1: _sortedToken1.address,
    }

    const transactionObject = await this.contract.deployIncentivizedPool(
      symbol,
      poolData.ticks,
      rewardsProgram,
      poolDetails,
      {
        value: deploymentFee,
      }
    )
    console.log(
      `deployIncentivizedPool transaction hash: ${transactionObject.hash}`
    )
    return transactionObject.hash
  }

  deployNonIncentivizedPool = async (
    poolData: ICreatePoolData,
    deploymentFee?: BigNumber
  ): Promise<string> => {
    // Default deployment fee
    deploymentFee = await this.contract.deploymentFee()

    const isTokenSorted = BigNumber.from(poolData.token0.address).lt(
      BigNumber.from(poolData.token1.address)
    )

    const _sortedToken0 = isTokenSorted ? poolData.token0 : poolData.token1
    const _sortedToken1 = isTokenSorted ? poolData.token1 : poolData.token0

    // Includes fee tier as part of symbol
    const symbol = `${_sortedToken0.symbol}-${_sortedToken1.symbol}-CLR-${
      poolData.tier.toNumber() / 100
    }bps`

    const poolDetails = {
      amount0: isTokenSorted ? poolData.amount0 : poolData.amount1,
      amount1: isTokenSorted ? poolData.amount1 : poolData.amount0,
      fee: poolData.tier,
      token0: _sortedToken0.address,
      token1: _sortedToken1.address,
    }

    const transactionObject = await this.contract.deployNonIncentivizedPool(
      symbol,
      poolData.ticks,
      poolDetails,
      {
        value: deploymentFee,
      }
    )
    console.log(
      `deployNonIncentivizedPool transaction hash: ${transactionObject.hash}`
    )
    return transactionObject.hash
  }

  waitUntilTerminalPoolCreated = async (
    poolData: ICreatePoolData,
    txId: string
  ): Promise<string> => {
    const { incentivized, tier } = poolData
    const tokenA = poolData.token0.address
    const tokenB = poolData.token1.address

    const [token0, token1] = getSortedToken(tokenA, tokenB)
    let resolved = false

    return new Promise((resolve) => {
      this.contract.on(
        incentivized
          ? 'DeployedIncentivizedPool'
          : 'DeployedNonIncentivizedPool',
        (poolAddress, t0, t1, fee, lowerTick, upperTick, ...rest) => {
          if (
            t0.toLowerCase() === token0 &&
            t1.toLowerCase() === token1 &&
            tier.eq(BigNumber.from(fee))
          ) {
            if (!resolved) {
              resolved = true
              resolve(rest[0].transactionHash)
            }
          }
        }
      )

      this.contract.provider.waitForTransaction(txId).then(() => {
        if (!resolved) {
          resolved = true
          resolve(txId)
        }
      })
    })
  }

  parseTerminalPoolCreatedTx = async (
    poolData: ICreatePoolData,
    txId: string
  ): Promise<string> => {
    const { logs } = await this.contract.provider.getTransactionReceipt(txId)

    const filteredLogs = logs.filter(
      (log) => log.address.toLowerCase() === this.contract.address.toLowerCase()
    )

    const uniPositionInterface = new Interface(Abi.LMTerminal)
    for (let index = 0; index < filteredLogs.length; index++) {
      const log = filteredLogs[index]
      try {
        const parsed = uniPositionInterface.parseLog(log)

        if (
          poolData.incentivized &&
          parsed.name === 'DeployedIncentivizedPool'
        ) {
          return parsed.args[0]
        }

        if (
          !poolData.incentivized &&
          parsed.name === 'DeployedNonIncentivizedPool'
        ) {
          return parsed.args[0]
        }
      } catch (error) {
        console.error(error)
      }
    }
    return NULL_ADDRESS
  }
}

export { LMService }
