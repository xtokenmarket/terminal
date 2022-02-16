import { BigNumber, Contract, Wallet, ethers } from 'ethers'
import { Maybe } from 'types'
import Abi from 'abis'
import { Interface } from '@ethersproject/abi'

const rewardEscrowAbi = Abi.RewardEscrow

class RewardEscrowService {
  provider: any
  contract: Contract

  constructor(provider: any, signerAddress: Maybe<string>, address: string) {
    this.provider = provider
    if (signerAddress) {
      const signer: Wallet = provider.getSigner()
      this.contract = new ethers.Contract(
        address,
        rewardEscrowAbi,
        provider
      ).connect(signer)
    } else {
      this.contract = new ethers.Contract(address, rewardEscrowAbi, provider)
    }
  }

  get address(): string {
    return this.contract.address
  }

  clrPoolVestingPeriod = async (addr: string): Promise<BigNumber> => {
    return this.contract.clrPoolVestingPeriod(addr)
  }

  getNextVestingEntry = async (
    address: string,
    tokenAddress: string,
    account: string
  ) => {
    const [timestamp, amount] = await this.contract.getNextVestingEntry(
      address,
      tokenAddress,
      account,
    )

    return { timestamp, amount }
  }

  vestAll = async (
    poolAddress: string,
    tokenAddresses: string[],
  ) => {
    const txObj = await this.contract.vestAll(poolAddress, tokenAddresses)
    return txObj.hash
  }

  waitUntilVestAll = async (
    account: string,
    txId: string,
  ): Promise<string> => {
    let resolved = false
    return new Promise(resolve => {
      this.contract.on('Vested', (clrPool: string, sender: any, ...rest) => {
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

  parseVestAllTx = async (txId: string) => {
    const result: Record<string, BigNumber> = {}
    const { logs } = await this.contract.provider.getTransactionReceipt(txId)
    const uniPositionInterface = new Interface(Abi.RewardEscrow)
    console.log('parseVestAllTx logs:', logs)
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i]
      try {
        const parsed = uniPositionInterface.parseLog(log)
        if (parsed.name === 'Vested') {
          result[String(parsed.args[1]).toLowerCase()] = parsed.args[2]
        }
      } catch (error) {
        console.error(error)
      }
    }
    return result
  }
}

export { RewardEscrowService }
