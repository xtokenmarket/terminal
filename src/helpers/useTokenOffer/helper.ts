import Abi from 'abis'
import { MulticallService } from 'services'

export const getOffersDataMulticall = async (
<<<<<<< HEAD
    tokenOfferAddress: string,
    multicall: MulticallService
  ) => {
    try {
      // console.time(`loadInfo multicall ${tokenOfferAddress}`)
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
        'offerToken',
        'purchaseToken'
      ].map((method) => ({
        name: method,
        address: tokenOfferAddress,
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
        [vestingPeriod ],
        [cliffPeriod],
        [offerToken],
        [purchaseToken]
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
        offerToken,
        purchaseToken
      }
    } catch (error) {
      console.error('getOffersDataMulticall', error)
=======
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
>>>>>>> 34f2682 (Bootstrapped token offer details page)
    }
  } catch (error) {
    console.error(error)
  }
}
