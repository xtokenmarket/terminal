import axios from 'axios'
import { TERMINAL_API_URL } from 'config/constants'
import { getContractAddress } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { useNetworkContext } from 'contexts/networkContext'
<<<<<<< HEAD
import { BigNumber } from 'ethers'
=======
import { useServices } from 'helpers'
>>>>>>> 2db2c06 (fix: use originationService from useService)
import { useEffect, useState } from 'react'
import { OriginationService } from 'services'
import { ITokenOffer } from 'types'
import { Network } from 'utils/enums'
import { isTestnet, isTestNetwork } from 'utils/network'

interface IState {
  isLoading: boolean
  // tokenOffers: ITokenOffer[]
  tokenOffers: string[]
}

<<<<<<< HEAD:src/helpers/useTokenOffers/index.ts
const offerings = [
  {
    network: Network.KOVAN,
    poolAddress: '0x21bf5edacb55697b6f1352e453a42b0f6c2cf87e',
    offerToken: {
      address: '0x016750ac630f711882812f24dba6c95b9d35856d',
      decimals: 6,
      image: '/assets/tokens/usdt.png',
      name: 'Tether USD',
      symbol: 'USDT',
    },
    purchaseToken: {
      address: '0x90410304D88E333710703aF6Ed6A14d5ef74575F',
      decimals: 18,
      image: '/assets/tokens/dai.png',
      name: 'DAI',
      symbol: 'DAI',
    },
    totalOfferingAmount: BigNumber.from('1500000000000'),
<<<<<<< HEAD
    remainingOfferingAmount: BigNumber.from('497303000000'),
    pricePerToken: BigNumber.from('1250000000000000000'),
    timeRemaining: BigNumber.from('23420'),
    vestingPeriod: 31622400,
    cliffPeriod: 7890000,
=======
    offerTokenAmountSold: BigNumber.from('1002697000000'),
    startingPrice: BigNumber.from('1250000000000000000'),
    endingPrice: BigNumber.from('1250000000000000000'),
    saleEndTimestamp: BigNumber.from('1653141257'),
    vestingPeriod: BigNumber.from('31622400'),
    cliffPeriod: BigNumber.from('7890000'),
>>>>>>> 399d09b (Fixed discover page data wiring setup)
  },
]

const getTokenOffers = async (): Promise<{ data: ITokenOffer[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: offerings })
    }, 2 * 1000)
  })
  // await axios.get<ITerminalPool[]>(`${TERMINAL_API_URL}/token-offers`)
}

export const useTokenOffers = () => {
=======
export const useOriginationPools = () => {
>>>>>>> 68a7ccc (refactor: rename useTokenOffer to useOriginationPool for keeping it generic between both type of sales):src/helpers/useOriginationPools/index.ts
  const [state, setState] = useState<IState>({
    tokenOffers: [],
    isLoading: true,
  })

  const { chainId } = useNetworkContext()
  const { account, library: provider } = useConnectedWeb3Context()
  const { originationService } = useServices()

  const getFilteredOffers = (offers: ITokenOffer[] = []) =>
    offers.filter((offer: ITokenOffer) =>
      isTestnet(chainId)
        ? isTestNetwork(offer.network)
        : !isTestNetwork(offer.network)
    )

  const loadTokenOffers = async () => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      // const { data: tokenOffers } = await getTokenOffers()

      // TODO: offers data pull from the contract, can be deleted after api is ready
      const readonlyProvider = provider
<<<<<<< HEAD
      const originationAddress = getContractAddress(
        'origination',
        readonlyProvider?.network.chainId
      )
      const origination = new OriginationService(
        provider,
        account,
        originationAddress
      )
=======

>>>>>>> 2db2c06 (fix: use originationService from useService)
      const createFungibleListingFilter =
        originationService.contract.filters.CreateFungibleListing()
      const tokenOffers = await originationService.contract.queryFilter(
        createFungibleListingFilter
      )
      const tokenOfferAddresses = tokenOffers.map((offer) => offer.args?.pool)

      setState((prev) => ({
        ...prev,
        tokenOffers: tokenOfferAddresses,
        isLoading: false,
      }))
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  useEffect(() => {
    loadTokenOffers()
  }, [chainId])

  return state
}
