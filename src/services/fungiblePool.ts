import { Contract, Wallet, ethers } from 'ethers'
import { Maybe } from 'types'
import Abi from 'abis'

class FungiblePoolService {
  provider: any
  contract: Contract

  constructor(provider: any, signerAddress: Maybe<string>, address: string) {
    this.provider = provider
    if (signerAddress) {
      const signer: Wallet = provider.getSigner()
      this.contract = new ethers.Contract(
        address,
        Abi.OriginationPool,
        provider
      ).connect(signer)
    } else {
      this.contract = new ethers.Contract(
        address,
        Abi.OriginationPool,
        provider
      )
    }
  }

  get address(): string {
    return this.contract.address
  }

  initiateSale = async (): Promise<string> => {
    const tx = await this.contract.initiateSale()
    console.log(`initiate sale transaction hash: ${tx.hash}`)
    return tx.hash
  }

  waitUntilInitiateSale = async (txId: string): Promise<string> => {
    let resolved = false
    return new Promise((resolve) => {
      this.contract.on('InitiateSale', (...rest) => {
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

export { FungiblePoolService }
