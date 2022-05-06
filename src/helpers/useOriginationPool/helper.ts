import Abi from 'abis'
import { BigNumber } from 'ethers'
import { MulticallService } from 'services'
export interface ITokenOfferDetails {
  offerToken: string
  purchaseToken: string
  totalOfferingAmount: BigNumber
  offerTokenAmountSold: BigNumber
  startingPrice: BigNumber
  endingPrice: BigNumber
  saleInitiatedTimestamp: BigNumber
  saleEndTimestamp: BigNumber
  vestingPeriod: BigNumber
  cliffPeriod: BigNumber
  reserveAmount: BigNumber
  whitelistStartingPrice: BigNumber
  whitelistEndingPrice: BigNumber
  whitelistSaleDuration: BigNumber
  whitelist: BigNumber
  publicSaleDuration: BigNumber
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
      'startingPrice',
      'endingPrice',
      'saleInitiatedTimestamp',
      'saleEndTimestamp',
      'vestingPeriod',
      'cliffPeriod',
      'reserveAmount',
      'whitelistStartingPrice',
      'whitelistEndingPrice',
      'whitelistSaleDuration',
      'publicSaleDuration',
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
      [startingPrice],
      [endingPrice],
      [saleInitiatedTimestamp],
      [saleEndTimestamp],
      [vestingPeriod],
      [cliffPeriod],
      [reserveAmount],
      whitelistStartingPrice,
      whitelistEndingPrice,
      whitelistSaleDuration,
      whitelist,
      publicSaleDuration,
    ] = await multicall.multicallv2(Abi.OriginationPool, calls, {
      requireSuccess: false,
    })
    return {
      offerToken,
      purchaseToken,
      totalOfferingAmount,
      offerTokenAmountSold,
      startingPrice,
      endingPrice,
      saleEndTimestamp,
      saleInitiatedTimestamp,
      vestingPeriod,
      cliffPeriod,
      reserveAmount,
      whitelistStartingPrice,
      whitelistEndingPrice,
      whitelistSaleDuration,
      whitelist,
      publicSaleDuration,
    }
  } catch (error) {
    console.log('error', error)
  }
}
