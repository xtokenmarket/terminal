import { BigNumber, Contract, Wallet, ethers } from 'ethers'
import { Maybe } from 'types'
import Abi from 'abis'
import { Interface } from '@ethersproject/abi'
import { getContractAddress } from 'config/networks'

class CLRService {
  abi: any
  contract: Contract
  provider: any
  version: string

  constructor(provider: any, signerAddress: Maybe<string>, address: string) {
    this.abi = Abi.CLRV0
    this.provider = provider
    this.version = 'v1.0.0'
    this.contract = new ethers.Contract(address, Abi.CLRV1, provider)

    this.contract
      .getVersion()
      .then((version: string) => {
        this.abi = Abi.CLRV1
        this.version = version
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

  calculateAmountsMintedSingleToken = async (
    inputAsset: number,
    amount: BigNumber
  ) => {
    return this.contract.calculateAmountsMintedSingleToken(inputAsset, amount)
  }

  getLiquidityForAmounts = async (amount0: BigNumber, amount1: BigNumber) => {
    return this.contract.getLiquidityForAmounts(amount0, amount1)
  }

  // TODO: Remove `isToken1Deposit` arg
  deposit = async (
    amount0: BigNumber,
    amount1: BigNumber,
    isToken1Deposit = false
  ) => {
    if (this.version === 'v1.0.0') {
      return this.contract.deposit(
        isToken1Deposit ? 1 : 0,
        isToken1Deposit ? amount1 : amount0
      )
    } else {
      return this.contract.deposit(amount0, amount1)
    }
  }

  waitUntilDeposit = async (
    amount0: BigNumber,
    amount1: BigNumber,
    account: string,
    txId: string
  ): Promise<string> => {
    let resolved = false
    return new Promise((resolve) => {
      this.contract.on(
        'Deposit',
        (
          _sender: string,
          _amount0: BigNumber,
          _amount1: BigNumber,
          ...rest
        ) => {
          if (
            account.toLowerCase() === _sender.toLowerCase() &&
            amount0.eq(_amount0) &&
            amount1.eq(_amount1)
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

    const address = getContractAddress(
      'uniPositionManager',
      this.provider.networkId
    )

    const filteredLogs = logs.filter(
      (log) => log.address.toLowerCase() === address.toLowerCase()
    )

    const uniPositionInterface = new Interface(Abi.UniswapV3Position)
    for (let index = 0; index < filteredLogs.length; index++) {
      const log = filteredLogs[index]
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

  withdrawAndClaimReward = async (
    amount: BigNumber,
    amount0Estimation: BigNumber,
    amount1Estimation: BigNumber
  ) => {
    if (this.version === 'v1.0.0') {
      return this.contract.withdrawAndClaimReward(amount)
    } else {
      return this.contract.withdrawAndClaimReward(
        amount,
        amount0Estimation,
        amount1Estimation
      )
    }
  }

  withdraw = async (
    amount: BigNumber,
    amount0Estimation: BigNumber,
    amount1Estimation: BigNumber
  ) => {
    if (this.version === 'v1.0.0') {
      return this.contract.withdraw(amount)
    } else {
      return this.contract.withdraw(
        amount,
        amount0Estimation,
        amount1Estimation
      )
    }
  }

  parseWithdrawTx = async (
    txId: string
  ): Promise<{
    amount0: BigNumber
    amount1: BigNumber
    liquidity: BigNumber
  } | null> => {
    const { logs } = await this.contract.provider.getTransactionReceipt(txId)

    const address = getContractAddress(
      'uniPositionManager',
      this.provider.networkId
    )

    const filteredLogs = logs.filter(
      (log) => log.address.toLowerCase() === address.toLowerCase()
    )

    const uniPositionInterface = new Interface(Abi.UniswapV3Position)
    for (let index = 0; index < filteredLogs.length; index++) {
      const log = filteredLogs[index]
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

    const filteredLogs = logs.filter(
      (log) => log.address.toLowerCase() === this.contract.address.toLowerCase()
    )

    const uniPositionInterface = new Interface(Abi.CLRV0)
    for (let index = 0; index < filteredLogs.length; index++) {
      const log = filteredLogs[index]
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

  waitUntilWithdraw = async (
    account: string,
    txId: string
  ): Promise<string> => {
    let resolved = false
    return new Promise((resolve) => {
      this.contract.on(
        'Withdraw',
        (sender: string, amount0: BigNumber, amount1: BigNumber, ...rest) => {
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

  claimReward = async (): Promise<string> => {
    const transactionObject = await this.contract.claimReward()
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
        'RewardClaimed',
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

  earned = async (
    account: Maybe<string>,
    tokenAddress: string
  ): Promise<BigNumber> => {
    return this.contract.earned(account, tokenAddress)
  }

  reinvest = async (): Promise<string> => {
    const transactionObject = await this.contract.collectAndReinvest()
    console.log(`reinvest transaction hash: ${transactionObject.hash}`)

    return transactionObject.hash
  }

  waitUntilReinvest = async (txId: string): Promise<string> => {
    let resolved = false
    return new Promise((resolve) => {
      this.contract.on('Reinvest', (...rest) => {
        if (!resolved) {
          resolved = true
          resolve(rest[0].transactionHash)
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
}

export { CLRService }
