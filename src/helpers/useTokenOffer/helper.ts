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
        'offerTokenAmountPurchased',
        'startingPrice',
        'endingPrice',
        'saleDuration',
        'saleEndTimestamp',
        'saleInitiatedTimestamp',
        'vestingPeriod ',
        'cliffPeriod'
      ].map((method) => ({
        name: method,
        address: tokenOfferAddress,
        params: [],
      }))
      const [
        [totalOfferingAmount],
        [offerTokenAmountPurchased],
        [startingPrice],
        [endingPrice],
        [saleDuration],
        [saleEndTimestamp],
        [saleInitiatedTimestamp],
        [vestingPeriod ],
        [cliffPeriod]
      ] = await multicall.multicallv2(Abi.OriginationCore, calls, {
        requireSuccess: false,
      })
      return {
        totalOfferingAmount,
        offerTokenAmountPurchased,
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