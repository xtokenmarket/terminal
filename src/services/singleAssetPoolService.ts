import { BigNumber, Contract, Wallet, ethers } from 'ethers'
import { Maybe, PoolService } from 'types'
import Abi from 'abis'
import { Interface } from '@ethersproject/abi'
import { GAS_DELTA } from 'config/constants'

class SingleAssetPoolService implements PoolService {
  abi: any
  contract: Contract
  provider: any
  version: string

  constructor(provider: any, signerAddress: Maybe<string>, address: string) {
    this.abi = Abi.CLRV0
    this.provider = provider
    this.version = ''
    this.contract = new ethers.Contract(address, Abi.SingleAssetPool, provider)

    this.contract
      .getVersion()
      .then((version: string) => {
        this.abi = Abi.CLRV1
        if (signerAddress) {
          const signer: Wallet = provider.getSigner()
          this.contract = this.contract.connect(signer)
        }
      })
      .catch(() => {
        this.contract = new ethers.Contract(address, Abi.CLRV0, provider)
        if (signerAddress) {
          const signer: Wallet = provider.getSigner()
          this.contract = this.contract.connect(signer)
        }
      })
  }

  get address(): string {
    return this.contract.address
  }

  getRewardTokens = async (): Promise<string[]> => {
    return this.contract.getRewardTokens()
  }

  getStakedTokenBalance = async (): Promise<{
    amount0: BigNumber
    amount1: BigNumber
  }> => {
    const stakedTokenBalance = await this.contract.stakedTotalSupply()

    return { amount0: stakedTokenBalance, amount1: BigNumber.from(0) }
  }

  totalSupply = async (): Promise<BigNumber> => {
    return this.contract.stakedTotalSupply()
  }

  calculateAmountsMintedSingleToken = async (
    inputAsset: number,
    amount: BigNumber
  ) => {
    return
  }

  getLiquidityForAmounts = async (amount0: BigNumber, amount1: BigNumber) => {
    return
  }

  deposit = async (amount0: BigNumber, _: BigNumber) => {
    const estimatedGas = await this.contract.estimateGas['stake'](amount0)

    return this.contract.stake(amount0, {
      gasLimit: estimatedGas.add(GAS_DELTA),
    })
  }

  waitUntilDeposit = async (
    amount: BigNumber,
    _: BigNumber,
    account: string,
    txId: string
  ): Promise<string> => {
    let resolved = false
    return new Promise((resolve) => {
      this.contract.on(
        'Staked',
        (_sender: string, _amount: BigNumber, ...rest) => {
          if (
            account.toLowerCase() === _sender.toLowerCase() &&
            amount.eq(_amount)
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
    account: string
    amount: BigNumber
  } | null> => {
    const { logs } = await this.contract.provider.getTransactionReceipt(txId)
    const filteredLogs = logs.filter(
      (log) => log.address.toLowerCase() === this.address.toLowerCase()
    )

    const contractInterface = new Interface(Abi.SingleAssetPool)
    for (let index = 0; index < filteredLogs.length; index++) {
      const log = filteredLogs[index]
      try {
        const parsed = contractInterface.parseLog(log)
        if (parsed.name === 'Staked') {
          return {
            account: parsed.args[1],
            amount: parsed.args[2],
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
    return null
  }

  withdraw = async (
    amount: BigNumber,
    amount0Estimation: BigNumber,
    amount1Estimation: BigNumber
  ) => {
    const estimatedGas = await this.contract.estimateGas['unstake'](amount)

    return this.contract.unstake(amount, {
      gasLimit: estimatedGas.add(GAS_DELTA),
    })
  }

  parseWithdrawTx = async (
    txId: string
  ): Promise<{
    account: string
    amount: BigNumber
  } | null> => {
    const { logs } = await this.contract.provider.getTransactionReceipt(txId)
    const filteredLogs = logs.filter(
      (log) => log.address.toLowerCase() === this.address.toLowerCase()
    )

    const contractInterface = new Interface(Abi.SingleAssetPool)
    for (let index = 0; index < filteredLogs.length; index++) {
      const log = filteredLogs[index]
      try {
        const parsed = contractInterface.parseLog(log)
        if (parsed.name === 'Withdrawn') {
          return {
            account: parsed.args[0],
            amount: parsed.args[1],
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
    return null
  }

  waitUntilWithdraw = async (
    account: string,
    txId: string
  ): Promise<string> => {
    let resolved = false
    return new Promise((resolve) => {
      this.contract.on(
        'Withdrawn',
        (_sender: string, _amount: BigNumber, ...rest) => {
          if (account.toLowerCase() === _sender.toLowerCase()) {
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

  withdrawAndClaimReward = async (
    amount: BigNumber,
    amount0Estimation: BigNumber,
    amount1Estimation: BigNumber
  ) => {
    const estimatedGas = await this.contract.estimateGas[
      'unstakeAndClaimReward'
    ](amount)

    return this.contract.unstakeAndClaimReward(amount, {
      gasLimit: estimatedGas.add(GAS_DELTA),
    })
  }

  parseClaimTx = async (txId: string) => {
    const result: {
      [key: string]: BigNumber
    } = {}
    const { logs } = await this.contract.provider.getTransactionReceipt(txId)

    const filteredLogs = logs.filter(
      (log) => log.address.toLowerCase() === this.contract.address.toLowerCase()
    )

    const contractInterface = new Interface(Abi.SingleAssetPool)
    for (let index = 0; index < filteredLogs.length; index++) {
      const log = filteredLogs[index]
      try {
        const parsed = contractInterface.parseLog(log)
        if (parsed.name === 'RewardClaimed') {
          result[String(parsed.args[1]).toLowerCase()] = parsed.args[2]
        }
      } catch (error) {
        console.error(error)
      }
    }
    return result
  }

  claimReward = async () => {
    const transactionObject = await this.contract.claimReward()
    console.log(`claimReward transaction hash: ${transactionObject.hash}`)

    return transactionObject.hash
  }

  waitUntilClaimReward = async (account: string, txId: string) => {
    let resolved = false
    return new Promise((resolve) => {
      this.contract.on('RewardClaimed', (_: string, sender: any, ...rest) => {
        if (account.toLowerCase() === sender.toLowerCase()) {
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

  calculateWithdrawAmounts = async (amount: BigNumber) => {
    return this.contract.calculateWithdrawAmounts(amount)
  }

  earned = async (
    account: Maybe<string>,
    tokenAddress: string
  ): Promise<BigNumber> => {
    return this.contract.earned(account, tokenAddress)
  }

  reinvest = async () => {
    return
  }

  waitUntilReinvest = async (txId: string): Promise<string> => {
    return ''
  }
}

export { SingleAssetPoolService }
