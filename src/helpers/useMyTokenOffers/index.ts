import axios from 'axios'
import { getContractAddress } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { useNetworkContext } from 'contexts/networkContext'
import { useEffect, useState } from 'react'
import { OriginationService } from 'services'
import { ITokenOffer } from 'types'
import { isTestnet, isTestNetwork } from 'utils/network'

interface IState {
  isLoading: boolean
  // tokenOffers: ITokenOffer[]
  tokenOffers: string[]
}

export const useMyTokenOffers = () => {
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
        readonlyProvider?.network?.chainId
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

      const userTokenOffers = tokenOffers.filter(
        (offer) => offer.args?.owner === account
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
  }, [chainId])

  return state
}
