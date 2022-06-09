import axios from 'axios'
import { Contract, Wallet, ethers, BigNumber } from 'ethers'
import { Maybe } from 'types'
import Abi from 'abis'
import { CHAIN_NAMES, ChainId, ORIGINATION_API_URL } from 'config/constants'

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

  getPurchaseAmountFromOfferAmount = async (
    offerAmount: BigNumber
  ): Promise<BigNumber> => {
    return this.contract.getPurchaseAmountFromOfferAmount(offerAmount)
  }

  getCurrentMintAmount = async (
    contributionAmount: BigNumber
  ): Promise<BigNumber> => {
    return this.contract.getCurrentMintAmount(contributionAmount)
  }

  purchase = async (contributionAmount: BigNumber): Promise<string> => {
    const tx = await this.contract.purchase(contributionAmount)
    console.log(`public purchase transaction hash: ${tx.hash}`)
    return tx.hash
  }

  whitelistPurchase = async (
    account: string,
    poolAddress: string,
    offerAmount: BigNumber,
    maxContributionAmount: BigNumber
  ): Promise<string> => {
    const merkleProof = await this.generateMerkleProof(account, poolAddress)
    const tx = await this.contract.whitelistPurchase(
      merkleProof,
      offerAmount,
      maxContributionAmount,
      { value: offerAmount }
    )

    console.log(`whitelist purchase transaction hash: ${tx.hash}`)
    return tx.hash
  }

  waitUntilPurchase = async (txId: string): Promise<string> => {
    let resolved = false
    return new Promise((resolve) => {
      this.contract.on('Purchase', (...rest) => {
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

  private generateMerkleProof = async (
    account: string,
    poolAddress: string
  ) => {
    const { hexProof } = await axios
      .post(`${ORIGINATION_API_URL}/generateProof`, {
        accountAddress: account,
        network:
          CHAIN_NAMES[this.provider.network.chainId as ChainId]?.toLowerCase(),
        poolAddress,
      })
      .then((response) => response.data)
      .catch(({ response }) => {
        throw Error(
          response.data.error ||
            'Unknown error occurred while generating merkle proof'
        )
      })

    return hexProof
  }
}

export { FungiblePoolService }
