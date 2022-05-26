import Abi from 'abis'
import { BigNumber } from 'ethers'
import { MulticallService } from 'services'
export interface ITokenOfferDetails {
  offerToken: string
  purchaseToken: string
  totalOfferingAmount: BigNumber
  offerTokenAmountSold: BigNumber
  publicStartingPrice: BigNumber
  publicEndingPrice: BigNumber
  saleInitiatedTimestamp: BigNumber
  saleEndTimestamp: BigNumber
  vestingPeriod: BigNumber
  cliffPeriod: BigNumber
  reserveAmount: BigNumber
  whitelistStartingPrice?: BigNumber
  whitelistEndingPrice?: BigNumber
  whitelistSaleDuration?: BigNumber
  publicSaleDuration?: BigNumber
  whitelistMerkleRoot?: string[]
  getOfferTokenPrice: BigNumber
  vestableTokenAmount: BigNumber
  purchaseTokensAcquired: BigNumber
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
