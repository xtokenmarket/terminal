import Abi from 'abis'
import { BigNumber } from 'ethers'
import { MulticallService } from 'services'

export interface ITokenOfferDetails {
  cliffPeriod: BigNumber
  getOfferTokenPrice: BigNumber
  offerToken: string
  offerTokenAmountSold: BigNumber
  publicEndingPrice: BigNumber
  publicSaleDuration?: BigNumber
  publicStartingPrice: BigNumber
  purchaseToken: string
  purchaseTokensAcquired: BigNumber
  reserveAmount: BigNumber
  saleEndTimestamp: BigNumber
  saleInitiatedTimestamp: BigNumber
  totalOfferingAmount: BigNumber
  vestableTokenAmount: BigNumber
  vestingPeriod: BigNumber
  whitelistEndingPrice?: BigNumber
  whitelistMerkleRoot?: string[]
  whitelistSaleDuration?: BigNumber
  whitelistStartingPrice?: BigNumber
}

export const getOffersDataMulticall = async (
  poolAddress: string,
  multicall: MulticallService
): Promise<ITokenOfferDetails | undefined> => {
  try {
    const calls = [
      'offerToken',
      'purchaseToken',
      'totalOfferingAmount',
      'offerTokenAmountSold',
      'publicStartingPrice',
      'publicEndingPrice',
      'saleInitiatedTimestamp',
      'saleEndTimestamp',
      'vestingPeriod',
      'cliffPeriod',
      'reserveAmount',
      'whitelistStartingPrice',
      'whitelistEndingPrice',
      'whitelistSaleDuration',
      'publicSaleDuration',
      'whitelistMerkleRoot',
      'getOfferTokenPrice',
      'vestableTokenAmount',
      'purchaseTokensAcquired',
    ].map((method) => ({
      name: method,
      address: poolAddress,
      params: [],
    }))

    const [
      [offerToken],
      [purchaseToken],
      [totalOfferingAmount],
      [offerTokenAmountSold],
      [publicStartingPrice],
      [publicEndingPrice],
      [saleInitiatedTimestamp],
      [saleEndTimestamp],
      [vestingPeriod],
      [cliffPeriod],
      [reserveAmount],
      [whitelistStartingPrice],
      [whitelistEndingPrice],
      [whitelistSaleDuration],
      publicSaleDuration,
      whitelistMerkleRoot,
      [getOfferTokenPrice],
      [vestableTokenAmount],
      [purchaseTokensAcquired],
    ] = await multicall.multicallv2(Abi.OriginationPool, calls, {
      requireSuccess: false,
    })
    return {
      offerToken,
      purchaseToken,
      totalOfferingAmount,
      offerTokenAmountSold,
      publicStartingPrice,
      publicEndingPrice,
      saleEndTimestamp,
      saleInitiatedTimestamp,
      vestingPeriod,
      cliffPeriod,
      reserveAmount,
      whitelistStartingPrice,
      whitelistEndingPrice,
      whitelistSaleDuration,
      publicSaleDuration,
      whitelistMerkleRoot,
      getOfferTokenPrice,
      vestableTokenAmount,
      purchaseTokensAcquired,
    }
  } catch (error) {
    console.log('error', error)
  }
}
