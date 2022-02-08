import { BigNumber, Contract, Wallet, ethers } from 'ethers'
import { Maybe } from 'types'
import Abi from 'abis'
import { Interface } from '@ethersproject/abi'

const xAssetCLRAbi = Abi.xAssetCLR

class CLRService {
  provider: any
  contract: Contract

  constructor(provider: any, signerAddress: Maybe<string>, address: string) {
    this.provider = provider
    if (signerAddress) {
      const signer: Wallet = provider.getSigner()
      this.contract = new ethers.Contract(
        address,
        xAssetCLRAbi,
        provider
      ).connect(signer)
    } else {
      this.contract = new ethers.Contract(address, xAssetCLRAbi, provider)
    }
  }

  withdraw = async (
    amount: BigNumber
  ) => {
    return this.contract.withdraw(amount)
  }

  deposit = async (
    inputAsset: number,
    amount: BigNumber
  ) => {
    return this.contract.deposit(inputAsset, amount)
  }

  waitUntilDeposit = async (
    clrPool: string,
    inputAsset: number,
    amount: BigNumber,
    account: string,
    txId: string
  ): Promise<string> => {
    let resolved = false
    return new Promise((resolve) => {
      this.contract.on(
        'deposit',
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
}

export { CLRService }
