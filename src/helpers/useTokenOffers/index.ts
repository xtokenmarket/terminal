import axios from 'axios'
import { TERMINAL_API_URL } from 'config/constants'
import { getContractAddress } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { useNetworkContext } from 'contexts/networkContext'
import { BigNumber } from 'ethers'
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
    remainingOfferingAmount: BigNumber.from('497303000000'),
    pricePerToken: BigNumber.from('1250000000000000000'),
    timeRemaining: BigNumber.from('23420'),
    vestingPeriod: 31622400,
    cliffPeriod: 7890000,
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
  const [state, setState] = useState<IState>({
    tokenOffers: [],
    isLoading: true,
  })

  const { chainId } = useNetworkContext()
  const { account, library: provider } = useConnectedWeb3Context()

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
      const originationAddress = getContractAddress(
        'origination',
        readonlyProvider?.network.chainId
      )
      const origination = new OriginationService(
        provider,
        account,
        originationAddress
      )
      const createFungibleListingFilter =
        origination.contract.filters.CreateFungibleListing()
      const tokenOffers = await origination.contract.queryFilter(
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
