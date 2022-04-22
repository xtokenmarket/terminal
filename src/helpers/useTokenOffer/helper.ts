import Abi from 'abis'
import { MulticallService } from 'services'

export const getOffersDataMulticall = async (
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
    }
  }