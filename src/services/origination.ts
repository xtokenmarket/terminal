import { Contract, Wallet, ethers } from 'ethers'
import { Maybe } from 'types'
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
}

export { OriginationService }
