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

  checkAccountSchedule = async (
    poolAddress: string,
    tokenAddress: string,
    account: string
  ) => {
    const entries = await this.contract.checkAccountSchedule(
      poolAddress,
      tokenAddress,
      account
    )
    const vestingEntries = entries.filter((s: BigNumber) => !s.isZero())
    const amounts: BigNumber[] = []
    const timestamps: BigNumber[] = []
    vestingEntries.map((entry: BigNumber, index: number) =>
      index % 2 === 0 ? timestamps.push(entry) : amounts.push(entry)
    )
    return { amounts, timestamps }
  }

  getNextVestingEntry = async (
    address: string,
    tokenAddress: string,
    account: string
  ) => {
    const [timestamp, amount] = await this.contract.getNextVestingEntry(
      address,
      tokenAddress,
      account
    )

    return { timestamp, amount }
  }

  vestAll = async (poolAddress: string, tokenAddresses: string[]) => {
    const txObj = await this.contract.vestAll(poolAddress, tokenAddresses)
    return txObj.hash
  }

  waitUntilVestAll = async (account: string, txId: string): Promise<string> => {
    let resolved = false
    return new Promise((resolve) => {
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

  getVestedBalance = async (
    address: string,
    tokenAddress: string,
    account: string
  ): Promise<any> => {
    let sum = BigNumber.from(0)
    try {
      const latestBlock = await this.provider.getBlock('latest')
      const numVestingEntries = await this.contract.numVestingEntries(
        address,
        tokenAddress,
        account
      )
      const schedule = await this.contract.checkAccountSchedule(
        address,
        tokenAddress,
        account
      )
      if (numVestingEntries > 0) {
        for (let i = 0; i < +numVestingEntries * 2; i = i + 2) {
          const t = schedule[i]
          const v = schedule[i + 1]
          if (t.gt(0) && v.gt(0)) {
            if (t.lt(latestBlock.timestamp)) {
              sum = BigNumber.from(sum).add(v)
            }
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
    return sum
  }
}

export { RewardEscrowService }
