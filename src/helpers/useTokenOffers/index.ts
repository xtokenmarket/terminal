import axios from 'axios'
import { TERMINAL_API_URL } from 'config/constants'
import { useNetworkContext } from 'contexts/networkContext'
import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { ITokenOffer } from 'types'
import { Network } from 'utils/enums'
import { isTestnet, isTestNetwork } from 'utils/network'

interface IState {
  isLoading: boolean
  tokenOffers: ITokenOffer[]
}

const offerings = [
  {
    network: Network.KOVAN,
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
    timeRemaining: 23420,
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

  const getFilteredOffers = (offers: ITokenOffer[] = []) =>
    offers.filter((offer: ITokenOffer) =>
      isTestnet(chainId)
        ? isTestNetwork(offer.network)
        : !isTestNetwork(offer.network)
    )

  const loadTokenOffers = async () => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const { data: tokenOffers } = await getTokenOffers()

      setState((prev) => ({
        ...prev,
        tokenOffers: getFilteredOffers(tokenOffers),
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
