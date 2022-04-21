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
  tokenOfferPoolAddress: string,
  multicall: MulticallService
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
    address: tokenOfferPoolAddress,
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
  }
}
