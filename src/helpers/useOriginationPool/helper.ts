import Abi from 'abis'
import { BigNumber } from 'ethers'
import { MulticallService } from 'services'

interface ITokenOfferDetails {
  offerToken: string
  purchaseToken: string
  totalOfferingAmount: BigNumber
  offerTokenAmountSold: BigNumber
  startingPrice: BigNumber
  endingPrice: BigNumber
  saleEndTimestamp: BigNumber
  vestingPeriod: BigNumber
  cliffPeriod: BigNumber
}

export const getOffersDataMulticall = async (
<<<<<<< HEAD
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
=======
  poolAddress: string,
>>>>>>> d5228be (fix: rename tokenOfferPoolAddress to poolAddress for it to be commonly used on both Token Sale and NFT Mint)
  multicall: MulticallService
<<<<<<< HEAD
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
=======
): Promise<ITokenOfferDetails> => {
  const calls = [
    'offerToken',
    'purchaseToken',
    'totalOfferingAmount',
    'offerTokenAmountSold',
    'startingPrice',
    'endingPrice',
    'saleEndTimestamp',
    'vestingPeriod ',
    'cliffPeriod',
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
    [saleEndTimestamp],
    [vestingPeriod],
    [cliffPeriod],
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
    vestingPeriod,
    cliffPeriod,
>>>>>>> 399d09b (Fixed discover page data wiring setup)
  }
}
