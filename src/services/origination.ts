import { Contract, Wallet, ethers, BigNumber } from 'ethers'
import { ISaleParams, Maybe } from 'types'
import Abi from 'abis'
import { Interface } from 'ethers/lib/utils'
import { NULL_ADDRESS } from 'config/constants'

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

  createFungibleListing = async (
    saleParams: ISaleParams,
    listingFee?: BigNumber
  ): Promise<string> => {
    if (!listingFee) {
      // Default listing fee
      listingFee = await this.contract.listingFee()
    }

    const transactionObject = await this.contract.createFungibleListing(
      saleParams,
      { value: listingFee }
    )
    console.log(
      `CreateFungibleListing transaction hash: ${transactionObject.hash}`
    )

    return transactionObject.hash
  }

  waitUntilCreateFungibleListing = async (
    account: string,
    txId: string
  ): Promise<string> => {
    let resolved = false
    return new Promise((resolve) => {
      this.contract.on(
        'CreateFungibleListing',
        (_: string, sender: any, transactionDetails: any) => {
          if (account.toLowerCase() === sender.toLowerCase() && !resolved) {
            resolved = true
            resolve(transactionDetails.transactionHash)
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

  parseFungibleListingCreatedTx = async (txId: string): Promise<string> => {
    const { logs } = await this.contract.provider.getTransactionReceipt(txId)

    const filteredLogs = logs.filter(
      (log) => log.address.toLowerCase() === this.contract.address.toLowerCase()
    )

    const uniPositionInterface = new Interface(Abi.OriginationCore)
    for (let index = 0; index < filteredLogs.length; index++) {
      const log = filteredLogs[index]
      try {
        const parsed = uniPositionInterface.parseLog(log)
        if (parsed.name === 'CreateFungibleListing') {
          return parsed.args[0]
        }
      } catch (error) {
        console.error(error)
      }
    }
    return NULL_ADDRESS
  }

  isCustomFeeEnabled = async (address: string): Promise<boolean> => {
    return this.contract.customListingFeeEnabled(address)
  }

  getCustomFee = async (address: string): Promise<BigNumber> => {
    return this.contract.customListingFee(address)
  }
}

export { OriginationService }
