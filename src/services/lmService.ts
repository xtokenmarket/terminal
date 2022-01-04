import { BigNumber, Contract, Wallet, ethers } from 'ethers'
import { Maybe } from 'types'
import Abi from 'abis'
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
    const uniPositionInterface = new Interface(Abi.xAssetCLR)
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
  initiateNewRewardsProgram = async (
    clrPool: string,
    amounts: BigNumber[],
    duration: number,
    rewardsAreEscrowed: boolean
  ): Promise<string> => {
    const transactionObject = await this.contract.initiateNewRewardsProgram(
      clrPool,
      amounts,
      duration,
      rewardsAreEscrowed
    )
    console.log(
      `initiateNewRewardsProgram transaction hash: ${transactionObject.hash}`
    )

    return transactionObject.hash
  }

  waitUntilNewRewardsProgramInitiated = async (
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
    const uniPositionInterface = new Interface(Abi.LMTerminal)
    for (let index = 0; index < logs.length; index++) {
      const log = logs[index]
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
}

export { LMService }
