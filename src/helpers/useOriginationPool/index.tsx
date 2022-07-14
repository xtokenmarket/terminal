import { useEffect, useState } from 'react'
import Abi from 'abis'
import axios from 'axios'
import { BigNumber, constants, Contract, ethers } from 'ethers'
import {
  getNetworkProvider,
  getTokenFromAddress,
  knownTokens,
} from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { useServices } from 'helpers'
import {
  EOriginationEvent,
  EPricingFormula,
  Network,
  OriginationLabels,
} from 'utils/enums'
import { getOffersDataMulticall } from './helper'
import { IToken, ITokenOffer, IWhitelistSale } from 'types'
import { ERC20Service, FungiblePoolService } from 'services'
import { getCurrentTimeStamp, getRemainingTimeSec } from 'utils'
import { ChainId, ORIGINATION_API_URL } from 'config/constants'
import { ZERO } from 'utils/number'
import { getIdFromNetwork, isTestnet } from 'utils/network'
import { isAddress } from 'utils/tools'
import { getAddress } from 'ethers/lib/utils'
import {
  getCoinGeckoIDs,
  getTokenExchangeRate,
} from 'helpers/useTerminalPool/helper'

import { fetchQuery } from 'utils/thegraph'
import { ENTRY_IDS_QUERY } from 'helpers/useOriginationPools/helper'
interface IState {
  tokenOffer?: ITokenOffer
  loading: boolean
}

export const useOriginationPool = (
  poolAddress: string,
  network: Network,
  offerData?: any,
  isPoolDetails = false
) => {
  const { account, networkId, library: provider } = useConnectedWeb3Context()
  const { multicall } = useServices(network)

  const [state, setState] = useState<IState>({ loading: true })

  let readonlyProvider = provider

  const isWrongNetwork = networkId !== getIdFromNetwork(network)
  if (isWrongNetwork) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    readonlyProvider = getNetworkProvider(network)
  }

  const ETH: IToken = {
    ...knownTokens.eth,
    address: constants.AddressZero,
  }
  const defaultTokenLogo = '/assets/tokens/unknown.png'

  const getTokenDetails = async (address: string) => {
    try {
      return getTokenFromAddress(address, readonlyProvider?.network.chainId)
    } catch (error) {
      const erc20 = new ERC20Service(
        readonlyProvider,
        isWrongNetwork ? null : account,
        address
      )
      return erc20.getDetails()
    }
  }

  const fungiblePool = new FungiblePoolService(provider, account, poolAddress)

  const loadInfo = async (isReloadPool = false, event?: EOriginationEvent) => {
    if (!offerData && !poolAddress) return

    setState((prev) => ({ ...prev, loading: true }))

    if ((!offerData && poolAddress) || isReloadPool) {
      try {
        offerData = (
          await axios.get(
            `${ORIGINATION_API_URL}/pool/${getAddress(poolAddress)}`,
            {
              params: {
                network,
              },
            }
          )
        ).data

        // TODO: Workaround for delay in updating API data from subgraph
        if (isReloadPool && event) {
          switch (event) {
            case EOriginationEvent.Claim: {
              offerData.sponsorTokensClaimed =
                await fungiblePool.contract.sponsorTokensClaimed()
              break
            }
            case EOriginationEvent.InitiateSale: {
              const [
                getOfferTokenPrice,
                publicEndingPrice,
                publicStartingPrice,
                purchaseTokensAcquired,
                saleEndTimestamp,
                saleInitiatedTimestamp,
                whitelistEndingPrice,
                whitelistSaleDuration,
                whitelistStartingPrice,
              ] = await Promise.all([
                fungiblePool.contract.getOfferTokenPrice(),
                fungiblePool.contract.publicEndingPrice(),
                fungiblePool.contract.publicStartingPrice(),
                fungiblePool.contract.purchaseTokensAcquired(),
                fungiblePool.contract.saleEndTimestamp(),
                fungiblePool.contract.saleInitiatedTimestamp(),
                fungiblePool.contract.whitelistEndingPrice(),
                fungiblePool.contract.whitelistSaleDuration(),
                fungiblePool.contract.whitelistStartingPrice(),
              ])

              offerData.getOfferTokenPrice = getOfferTokenPrice
              offerData.publicEndingPrice = publicEndingPrice
              offerData.publicStartingPrice = publicStartingPrice
              offerData.purchaseTokensAcquired = purchaseTokensAcquired
              offerData.saleEndTimestamp = saleEndTimestamp
              offerData.saleInitiatedTimestamp = saleInitiatedTimestamp
              offerData.whitelistEndingPrice = whitelistEndingPrice
              offerData.whitelistSaleDuration = whitelistSaleDuration
              offerData.whitelistStartingPrice = whitelistStartingPrice
              break
            }
            case EOriginationEvent.Invest: {
              offerData.offerTokenAmountSold =
                await fungiblePool.contract.offerTokenAmountSold()
              break
            }
          }
        }
      } catch (e) {
        console.error('Error fetching token offer details', e)

        // Fallback in case API doesn't return token offer details
        offerData = await getOffersDataMulticall(poolAddress, multicall)
        offerData.network = network
      }
    }

    for (const key in offerData) {
      if (
        typeof offerData[key] === 'string' &&
        !isNaN(offerData[key]) &&
        !isAddress(offerData[key]) &&
        !['network'].includes(key)
      ) {
        offerData[key] = BigNumber.from(offerData[key])
      }
    }

    // Fetch token details and price, in fallback behaviour
    if (!offerData?.offerToken.price || !offerData?.purchaseToken.price) {
      const [offerToken, purchaseToken] = await Promise.all([
        getTokenDetails(offerData?.offerToken.address || offerData?.offerToken),
        getTokenDetails(
          offerData?.purchaseToken.address || offerData?.purchaseToken
        ),
      ])

      offerData.offerToken = offerToken
      offerData.purchaseToken = purchaseToken

      let rates = undefined
      if (!isTestnet(readonlyProvider?.network.chainId as ChainId)) {
        const ids = await getCoinGeckoIDs([
          offerToken.symbol,
          purchaseToken.symbol,
        ])
        rates = await getTokenExchangeRate(ids)
      }

      offerData.offerToken.price = rates && rates[0] ? rates[0].toString() : '0'
      offerData.purchaseToken.price =
        rates && rates[1] ? rates[1].toString() : '0'
    }

    offerData.offerToken.image = offerData.offerToken?.image || defaultTokenLogo
    offerData.purchaseToken.image =
      offerData.purchaseToken?.image || defaultTokenLogo

    const {
      cliffPeriod,
      getOfferTokenPrice,
      offerTokenAmountSold,
      publicEndingPrice,
      publicSaleDuration,
      publicStartingPrice,
      purchaseTokensAcquired,
      reserveAmount,
      saleEndTimestamp,
      saleInitiatedTimestamp,
      totalOfferingAmount,
      vestableTokenAmount,
      vestingPeriod,
      whitelistEndingPrice,
      whitelistSaleDuration,
      whitelistStartingPrice,
      // sponsorTokensClaimed,
      offerToken,
      purchaseToken,
    } = offerData

    const _publicSaleDuration = BigNumber.from(Number(publicSaleDuration))
    const _whitelistSaleDuration = BigNumber.from(Number(whitelistSaleDuration))

    const offeringOverview = {
      label: OriginationLabels.OfferingOverview,
      offerToken: offerToken || ETH,
      purchaseToken: purchaseToken || ETH,
      reserveAmount,
      vestingPeriod,
      cliffPeriod,
      salesBegin: saleInitiatedTimestamp,
      salesEnd: saleEndTimestamp,
      salesPeriod: _publicSaleDuration.add(_whitelistSaleDuration),
      offerTokenAmountSold,
      totalOfferingAmount,
      poolAddress,
      isOwnerOrManager: false,
    }

    const endOfWhitelistPeriod = saleInitiatedTimestamp.add(
      whitelistSaleDuration || ZERO
    )
    const whitelistTimeRemaining = !endOfWhitelistPeriod.isZero()
      ? getRemainingTimeSec(endOfWhitelistPeriod)
      : ZERO

    const timeRemaining = !saleEndTimestamp.isZero()
      ? getRemainingTimeSec(saleEndTimestamp)
      : ZERO

    const _whitelist: IWhitelistSale = {
      label: OriginationLabels.WhitelistSale,
      currentPrice: getOfferTokenPrice,
      pricingFormula:
        whitelistStartingPrice?.toString() === whitelistEndingPrice?.toString()
          ? EPricingFormula.Standard
          : whitelistStartingPrice?.gt(whitelistEndingPrice)
          ? EPricingFormula.Descending
          : EPricingFormula.Ascending,
      startingPrice: whitelistStartingPrice,
      endingPrice: whitelistEndingPrice,
      whitelist: false,
      addressCap: ZERO,
      timeRemaining: whitelistTimeRemaining,
      salesPeriod: whitelistSaleDuration,
      offerToken: offerToken,
      purchaseToken: purchaseToken || ETH,
      whitelistMerkleRoot: undefined,
      isAddressWhitelisted: false,
      endOfWhitelistPeriod,
    }

    const publicSale = {
      label: OriginationLabels.PublicSale,
      currentPrice: getOfferTokenPrice,
      pricingFormula:
        publicStartingPrice.toString() === publicEndingPrice.toString()
          ? EPricingFormula.Standard
          : publicStartingPrice?.gt(publicEndingPrice)
          ? EPricingFormula.Descending
          : EPricingFormula.Ascending,
      salesPeriod: publicSaleDuration,
      timeRemaining,
      offerToken: offerToken,
      purchaseToken: purchaseToken || ETH,
      startingPrice: publicStartingPrice,
      endingPrice: publicEndingPrice,
      saleEndTimestamp,
    }

    const myPosition = {
      label: OriginationLabels.MyPosition,
      tokenPurchased: ZERO,
      amountInvested: ZERO,
      amountvested: ZERO,
      amountAvailableToVest: ZERO,
      offerToken: offerToken,
      purchaseToken: purchaseToken || ETH,
      vestableTokenAmount,
      userToVestingId: [],
    }

    const offeringSummary = {
      label: OriginationLabels.OfferingSummary,
      offerToken: offerToken,
      purchaseToken: purchaseToken || ETH,
      tokensSold: offerTokenAmountSold,
      amountsRaised: purchaseTokensAcquired,
      vestingPeriod,
      cliffPeriod,
      salesCompleted: saleEndTimestamp,
      timeSinceCompleted: BigNumber.from(getCurrentTimeStamp()).sub(
        saleEndTimestamp
      ),
    }

    // Fetch whitelist merkle root, only on Token Offer page
    if (isPoolDetails) {
      try {
        // TODO: Fetch Whitelist sale details, only if `whitelistSaleDuration` is set
        const whitelistMerkleRoot = (
          await axios.get(
            `${ORIGINATION_API_URL}/whitelistMerkleRoot?network=${offerData.network}&poolAddress=${poolAddress}`
          )
        ).data

        _whitelist.whitelist = whitelistMerkleRoot.hasSetWhitelistMerkleRoot
        _whitelist.whitelistMerkleRoot = whitelistMerkleRoot.merkleRoot

        if (whitelistMerkleRoot.hasSetWhitelistMerkleRoot) {
          // `maxContributionAmount` doesn't exist on contract level. Can only get from API.
          const whitelistedAccountDetails = (
            await axios.get(
              `${ORIGINATION_API_URL}/whitelistedAccountDetails/?accountAddress=${account}&poolAddress=${poolAddress}&network=${offerData.network}`
            )
          ).data

          _whitelist.addressCap = BigNumber.from(
            whitelistedAccountDetails.maxContributionAmount
          )
          _whitelist.isAddressWhitelisted =
            whitelistedAccountDetails.isAddressWhitelisted
        }
      } catch (e) {
        // Whitelist detail for pool is missing
      }

      // Fetch `account` related data
      if (account) {
        try {
          const [
            offerTokenAmountPurchased,
            purchaseTokenContribution,
            userToVestingId, // TODO: need to be refactored later after graph is ready
            isOwnerOrManager,
            vestingEntryNFTAddress,
          ] = await Promise.all([
            fungiblePool.contract.offerTokenAmountPurchased(account),
            fungiblePool.contract.purchaseTokenContribution(account),
            fungiblePool.contract.userToVestingId(account),
            fungiblePool.contract.isOwnerOrManager(account),
            fungiblePool.contract.vestingEntryNFT(),
          ])

          const graphqlUrl =
            'https://api.thegraph.com/subgraphs/name/cryptopixelfrog/subgraph-study'
          const eventVariables = {
            poolAddress: poolAddress.toLowerCase(),
            account: account.toLowerCase(),
          }

          const userToVestingEntryIds = (
            await fetchQuery(ENTRY_IDS_QUERY, eventVariables, graphqlUrl)
          ).userToVestingEntryIds


          const vestingEntryNFTContract = new Contract(
            vestingEntryNFTAddress,
            Abi.VestingEntryNFT,
            provider
          )

          let nftInfos = []

          if (vestingEntryNFTAddress !== ethers.constants.AddressZero) {
            nftInfos = await Promise.all(
              userToVestingEntryIds.map((x: any) =>
                vestingEntryNFTContract.tokenIdVestingAmounts(x.userToVestingId)
              )
            )
          }

          const totalTokenAmount = nftInfos.reduce((a, b) => {
            return a.add(b.tokenAmount)
          }, BigNumber.from(0))
          const totalTokenAmountClaimed = nftInfos.reduce((a, b) => {
            return a.add(b.tokenAmountClaimed)
          }, BigNumber.from(0))

          offeringOverview.isOwnerOrManager = isOwnerOrManager

          myPosition.amountAvailableToVest = totalTokenAmount.sub(
            totalTokenAmountClaimed
          )
          myPosition.amountInvested = purchaseTokenContribution
          myPosition.amountvested = totalTokenAmountClaimed
          myPosition.tokenPurchased = offerTokenAmountPurchased
          myPosition.userToVestingId = userToVestingEntryIds.map(
            (x: any) => x.userToVestingId
          )
        } catch (e) {
          console.error('Error while fetching account related data', e)
        }
      }
    }

    const _offerData: ITokenOffer = {
      address: poolAddress,
      network,
      offeringSummary,
      myPosition,
      whitelist: _whitelist,
      offeringOverview,
      publicSale,
      originationRow: {
        ...offeringOverview,
        startingPrice: publicStartingPrice,
        saleDuration: publicSaleDuration,
      },
      sponsorTokensClaimed: offerData.sponsorTokensClaimed,
    }

    setState({
      loading: false,
      tokenOffer: _offerData,
    })
  }

  useEffect(() => {
    loadInfo()
  }, [networkId, poolAddress, account])

  return { ...state, loadInfo }
}
