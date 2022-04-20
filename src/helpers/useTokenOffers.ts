import axios from 'axios'
import { TERMINAL_API_URL } from 'config/constants'
import { useNetworkContext } from 'contexts/networkContext'
import { useEffect, useState } from 'react'
import { ITerminalPool } from 'types'
import { Network } from 'utils/enums'
import { isTestnet } from 'utils/network'

interface IState {
  isLoading: boolean
  tokenOffers: ITerminalPool[]
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
    maxOffering: '1500000',
    remainingOffering: '497303',
    pricePerToken: '1.25',
    timeRemaining: '6D 19H 30M',
    vestingPeriod: '1 Year',
    vestingCliff: '3 Months',
  },
]

const getTokenOffers = async (): Promise<{ data: any }> => {
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

  useEffect(() => {
    const loadTokenOffers = async () => {
      setState((prev) => ({ ...prev, isLoading: true }))

      try {
        const { data: tokenOffers } = await getTokenOffers()

        const testNetworks = [Network.KOVAN, Network.RINKEBY]
        // TODO fix typing
        const filteredOffers = isTestnet(chainId)
          ? tokenOffers.filter((offer: any) =>
              testNetworks.includes(offer.network as Network)
            )
          : tokenOffers.filter(
              (offer: any) => !testNetworks.includes(offer.network as Network)
            )

        setState((prev) => ({
          ...prev,
          tokenOffers: filteredOffers,
          isLoading: false,
        }))
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    }

    setState((prev) => ({ ...prev, tokenOffers: [], isLoading: true }))
    loadTokenOffers()
  }, [chainId])

  return state
}
