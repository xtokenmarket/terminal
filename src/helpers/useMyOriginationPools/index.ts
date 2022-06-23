import axios from 'axios'
import { useConnectedWeb3Context } from 'contexts'
import { useNetworkContext } from 'contexts/networkContext'
import { useServices } from 'helpers'
import { useEffect, useState } from 'react'
import { IOriginationPool, ITokenOffer } from 'types'
import { isTestnet, isTestNetwork } from 'utils/network'

interface IState {
  isLoading: boolean
  tokenOffers: IOriginationPool[]
}

export const useMyTokenOffers = () => {
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
      const createFungibleListingFilter =
        originationService.contract.filters.CreateFungibleListing()
      const tokenOffers = await originationService.contract.queryFilter(
        createFungibleListingFilter
      )

      const userTokenOffers = tokenOffers.filter(
        (offer) => offer.args?.owner.toLowerCase() === account?.toLowerCase()
      )

      const userTokenOfferAddresses = userTokenOffers.map(
        (offer) => offer.args?.pool
      )

      setState((prev) => ({
        ...prev,
        tokenOffers: userTokenOfferAddresses,
        isLoading: false,
      }))
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  useEffect(() => {
    loadTokenOffers()
  }, [chainId, account])

  return state
}
