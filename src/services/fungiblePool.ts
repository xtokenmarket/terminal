import axios from 'axios'
import { Contract, Wallet, ethers, BigNumber } from 'ethers'
import { Maybe } from 'types'
import Abi from 'abis'
import { CHAIN_NAMES, ChainId, ORIGINATION_API_URL } from 'config/constants'
import { hexlify } from 'ethers/lib/utils'

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
      this.contract.on(
        'InitiateSale',
        (_offeringAmount: BigNumber, ...rest) => {
          if (!resolved) {
            resolved = true
            resolve(rest[0].transactionHash)
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

  purchase = async (
    contributionAmount: BigNumber,
    isPurchaseTokenETH: boolean
  ): Promise<string> => {
    const tx = await this.contract.purchase.apply(
      this,
      isPurchaseTokenETH
        ? [contributionAmount, { value: contributionAmount }]
        : [contributionAmount]
    )
    console.log(`public purchase transaction hash: ${tx.hash}`)
    return tx.hash
  }

  whitelistPurchase = async (
    account: string,
    poolAddress: string,
    offerAmount: BigNumber,
    maxContributionAmount: BigNumber,
    isPurchaseTokenETH: boolean
  ): Promise<string> => {
    const merkleProof = await this.generateMerkleProof(account, poolAddress)
    const tx = await this.contract.whitelistPurchase.apply(
      this,
      isPurchaseTokenETH
        ? [
            merkleProof,
            offerAmount,
            maxContributionAmount,
            { value: offerAmount },
          ]
        : [merkleProof, offerAmount, maxContributionAmount]
    )

    console.log(`whitelist purchase transaction hash: ${tx.hash}`)
    return tx.hash
  }

  waitUntilPurchase = async (
    amount0: BigNumber,
    amount1: BigNumber,
    account: string,
    txId: string
  ): Promise<string> => {
    let resolved = false
    return new Promise((resolve) => {
      this.contract.on('Purchase', (_sender, _amount0, _amount1, ...rest) => {
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
      })

      this.contract.provider.waitForTransaction(txId).then(() => {
        if (!resolved) {
          resolved = true
          resolve(txId)
        }
      })
    })
  }

  vest = async (userToVestingId: string[]): Promise<string> => {
    const tx = await this.contract.claimVested(userToVestingId)
    console.log(`vest transaction hash: ${tx.hash}`)
    return tx.hash
  }

  waitUntilVest = async (txId: string): Promise<string> => {
    let resolved = false
    return new Promise((resolve) => {
      this.contract.on('ClaimVested', (sender, amount0, amount1, ...rest) => {
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

  claimPurchaseToken = async (): Promise<string> => {
    const transactionObject = await this.contract.claimPurchaseToken()

    return transactionObject.hash
  }

  waitUntilClaim = async (
    txId: string,
    isOwnerOrManager?: boolean
  ): Promise<string> => {
    let resolved = false
    return new Promise((resolve) => {
      this.contract.on(
        isOwnerOrManager ? 'PurchaseTokenClaim' : 'TokensClaimed',
        (...rest) => {
          if (!resolved) {
            resolved = true
            resolve(rest[0].transactionHash)
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
}

export { FungiblePoolService }
