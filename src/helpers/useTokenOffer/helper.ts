import Abi from 'abis'
import { MulticallService } from 'services'

export const getOffersDataMulticall = async (
  tokenOfferPoolAddress: string,
  multicall: MulticallService
) => {
  try {
    const calls = [
      'totalOfferingAmount',
      'offerTokenAmountSold',
      'startingPrice',
      'endingPrice',
      'saleDuration',
      'saleEndTimestamp',
      'saleInitiatedTimestamp',
      'vestingPeriod ',
      'cliffPeriod',
    ].map((method) => ({
      name: method,
      address: tokenOfferPoolAddress,
      params: [],
    }))
    const [
      [totalOfferingAmount],
      [offerTokenAmountSold],
      [startingPrice],
      [endingPrice],
      [saleDuration],
      [saleEndTimestamp],
      [saleInitiatedTimestamp],
      [vestingPeriod],
      [cliffPeriod],
    ] = await multicall.multicallv2(Abi.OriginationPool, calls, {
      requireSuccess: false,
    })
    return {
      totalOfferingAmount,
      offerTokenAmountSold,
      startingPrice,
      endingPrice,
      saleDuration,
      saleEndTimestamp,
      saleInitiatedTimestamp,
      vestingPeriod,
      cliffPeriod,
    }
  } catch (error) {
    console.error(error)
  }
}
