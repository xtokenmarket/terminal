import axios from 'axios'
import { ORIGINATION_API_URL } from 'config/constants'
import { useNetworkContext } from 'contexts/networkContext'
import { useServices } from 'helpers/useServices'
import { useEffect, useState } from 'react'
import { IOriginationPool } from 'types'
import { isTestnet, isTestNetwork } from 'utils/network'

interface IState {
  isLoading: boolean
  tokenOffers: IOriginationPool[]
}

export const useOriginationPools = () => {
  const [state, setState] = useState<IState>({
    tokenOffers: [],
    isLoading: true,
  })

  const { chainId } = useNetworkContext()
  const { originationService } = useServices()

  const getFilteredOffers = (offers: IOriginationPool[] = []) =>
    offers.filter((offer: IOriginationPool) =>
      isTestnet(chainId)
        ? isTestNetwork(offer.network)
        : !isTestNetwork(offer.network)
    )

  const loadTokenOffers = async () => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const { data: pools } = await axios.get<any[]>(
        `${ORIGINATION_API_URL}/pools`
      )

      const filteredPools = getFilteredOffers(pools)

      setState((prev) => ({
        ...prev,
        tokenOffers: pools,
        isLoading: false,
      }))
    } catch (error) {
      // TODO: for testing only. Can be remove later
      // const createFungibleListingFilter =
      //   originationService.contract.filters.CreateFungibleListing()
      // const tokenOffers = await originationService.contract.queryFilter(
      //   createFungibleListingFilter
      // )
      // const pools = tokenOffers.map((offer) => {
      //   return { address: offer.args?.pool }
      // })
      // setState((prev) => ({
      //   ...prev,
      //   tokenOffers: pools as IOriginationPool[],
      //   isLoading: false,
      // }))

      setState((prev) => ({
        ...prev,
        isLoading: false,
      }))
    }
  }

  useEffect(() => {
    loadTokenOffers()
  }, [chainId])

  return state
}
