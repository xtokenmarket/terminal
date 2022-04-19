import { Contract, Wallet, ethers } from 'ethers'
import { ISaleParams, Maybe } from 'types'
import Abi from 'abis'

class OriginationService {
  provider: any
  contract: Contract

  constructor(provider: any, signerAddress: Maybe<string>, address: string) {
    this.provider = provider
    if (signerAddress) {
      const signer: Wallet = provider.getSigner()
      this.contract = new ethers.Contract(
        address,
        Abi.OriginationCore,
        provider
      ).connect(signer)
    } else {
      this.contract = new ethers.Contract(
        address,
        Abi.OriginationCore,
        provider
      )
    }
  }

  get address(): string {
    return this.contract.address
  }

  createFungibleListing = async (saleParams: ISaleParams): Promise<string> => {
    const listingFee = await this.contract.listingFee()
    const transactionObject = await this.contract.createFungibleListing(
      saleParams,
      { value: listingFee }
    )
    console.log(
      `CreateFungibleListing transaction hash: ${transactionObject.hash}`
    )

    return transactionObject.hash
  }

  waitUntilCreateFungibleListing = async (account: string, txId: string): Promise<string> => {
    let resolved = false
    return new Promise((resolve) => {
      this.contract.on('CreateFungibleListing', (...rest) => {
        (contractAddress: string, sender: any, ...rest: any) => {
          if (account.toLowerCase() === sender.toLowerCase()) {
            if (!resolved) {
              resolved = true
              resolve(rest[0].transactionHash)
            }
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
}

export { OriginationService }
