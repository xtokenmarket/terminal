import { BigNumber, Contract, Wallet, ethers } from 'ethers'
import { Maybe, PoolService } from 'types'
import Abi from 'abis'
import { Interface } from '@ethersproject/abi'
import { getContractAddress } from 'config/networks'

class NonRewardPoolService implements PoolService {
  abi: any
  contract: Contract
  provider: any
  version: string

  constructor(provider: any, signerAddress: Maybe<string>, address: string) {
    this.abi = Abi.CLRV0
    this.provider = provider
    this.version = ''
    this.contract = new ethers.Contract(address, Abi.NonRewardPool, provider)

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

  calculateAmountsMintedSingleToken = async (
    inputAsset: number,
    amount: BigNumber
  ) => {
    return this.contract.calculateAmountsMintedSingleToken(inputAsset, amount)
  }

  getLiquidityForAmounts = async (amount0: BigNumber, amount1: BigNumber) => {
    return this.contract.getLiquidityForAmounts(amount0, amount1)
  }

  deposit = async (amount0: BigNumber, amount1: BigNumber) => {
    return this.contract.deposit(amount0, amount1)
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
    return
  }

  withdraw = async (
    amount: BigNumber,
    amount0Estimation: BigNumber,
    amount1Estimation: BigNumber
  ) => {
    return this.contract.withdraw(
      amount,
      // 1% slippage
      amount0Estimation.mul(99).div(100),
      amount1Estimation.mul(99).div(100)
    )
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

  parseClaimTx = async (txId: string) => {
    return
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

  claimReward = async () => {
    return
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

  waitUntilClaimReward = async (account: string, txId: string) => {
    return
  }

  calculateWithdrawAmounts = async (amount: BigNumber) => {
    return this.contract.calculateWithdrawAmounts(amount)
  }

  earned = async (account: Maybe<string>, tokenAddress: string) => {
    return
  }

  reinvest = async () => {
    return
  }
}

export { NonRewardPoolService }
