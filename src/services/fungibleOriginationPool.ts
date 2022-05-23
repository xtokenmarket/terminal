import { hexlify } from 'ethers/lib/utils'
import { Contract, ethers, Wallet } from 'ethers'
import { Maybe } from 'types'
import Abi from 'abis'

class FungibleOriginationPoolService {
  provider: any
  contract: Contract

  constructor(
    provider: any,
    signerAddress: Maybe<string>,
    poolAddress: string
  ) {
    this.provider = provider

    if (signerAddress) {
      const signer: Wallet = provider.getSigner()
      this.contract = new ethers.Contract(
        poolAddress,
        Abi.FungibleOriginationPool,
        provider
      ).connect(signer)
    } else {
      this.contract = new ethers.Contract(
        poolAddress,
        Abi.FungibleOriginationPool,
        provider
      )
    }
  }

  /*
   * Set origination pool whitelist merkle root
   */
  setWhitelist = async (whitelistMerkleRoot: string): Promise<string> => {
    const transactionObject = await this.contract.setWhitelist(
      whitelistMerkleRoot,
      {
        value: '0x0',
        gasLimit: hexlify(100000),
      }
    )

    console.log('Set whitelist transaction hash:', transactionObject.hash)
    await transactionObject.wait()

    return transactionObject.hash
  }

  isSaleInitiated = async () => this.contract.saleInitiated()

  /*
   * Claim purchased tokens
   */
  claimTokens = async (): Promise<string> => {
    const transactionObject = await this.contract.claimTokens()

    console.log('Claim tokens transaction hash:', transactionObject.hash)

    return transactionObject.hash
  }

  waitUntilClaimTokens = async (txId: string): Promise<string> =>
    new Promise((resolve) => {
      this.contract.provider.waitForTransaction(txId).then(() => resolve(txId))
    })
}

export { FungibleOriginationPoolService }
