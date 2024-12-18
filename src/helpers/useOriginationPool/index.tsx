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
import { fetchQuery } from 'utils/thegraph'
import {
  getCoinGeckoIDs,
  getTokenExchangeRate,
} from 'helpers/useTerminalPool/helper'
import {
  ENTRY_IDS_QUERY,
  TOKEN_PURCHASED_AMOUNT_QUERY,
} from 'helpers/useOriginationPools/helper'

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
  const clrTokenLogo = '/assets/tokens/clr.png'

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

  const getTokenLogo = (address: string) => {
    try {
      return getTokenFromAddress(address, readonlyProvider?.network.chainId)
        .image
    } catch (error) {
      return defaultTokenLogo
    }
  }

  const fungiblePool = new FungiblePoolService(
    readonlyProvider,
    account,
    poolAddress
  )

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
              const [offerTokenAmountSold, saleEndTimestamp] =
                await Promise.all([
                  fungiblePool.contract.offerTokenAmountSold(),
                  fungiblePool.contract.saleEndTimestamp(),
                ])

              offerData.offerTokenAmountSold = offerTokenAmountSold
              offerData.saleEndTimestamp = saleEndTimestamp
              break
            }
            case EOriginationEvent.SaleEnded:
            case EOriginationEvent.Vestable: {
              offerData.saleEndTimestamp =
                await fungiblePool.contract.saleEndTimestamp()
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
    if (
      offerData?.offerToken.price === undefined ||
      offerData?.purchaseToken.price === undefined
    ) {
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

    offerData.offerToken.image =
      offerData.offerToken?.image ||
      getTokenLogo(offerData?.offerToken.address || offerData?.offerToken)
    offerData.purchaseToken.image =
      offerData.purchaseToken?.image ||
      getTokenLogo(offerData?.purchaseToken.address || offerData?.purchaseToken)

    // Bonding curve
    offerData.isBonding = false
    try {
      const purchaseTokenContract = new Contract(
        offerData.purchaseToken.address,
        Abi.CLRV1,
        readonlyProvider
      )
      await purchaseTokenContract.getVersion()
      offerData.isBonding = true
      offerData.purchaseToken.symbol =
        offerData.purchaseToken.symbol.split('-CLR')[0] + ' CLR'
      offerData.purchaseToken.image = clrTokenLogo
    } catch (e) {
      // Do nothing
    }

    const {
      cliffPeriod,
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
      offerToken,
      purchaseToken,
      createdAt,
      description,
      poolName,
      isBonding,
    } = offerData

    const _publicSaleDuration = BigNumber.from(publicSaleDuration)
    const _whitelistSaleDuration = BigNumber.from(whitelistSaleDuration)

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
      purchaseTokenRaised: purchaseTokensAcquired,
      isBonding,
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

    /*
    call getOfferTokenPrice() directly for getting the correct result.  
    ref: https://discord.com/channels/790695551057657876/951862075070750750/1014205744377241690
    */
    try {
      if (saleInitiatedTimestamp.gt(0)) {
        offerData.getOfferTokenPrice =
          await fungiblePool.contract.getOfferTokenPrice()
      }
    } catch (error) {
      console.error('getOfferTokenPrice error', error)
    }

    const _whitelist: IWhitelistSale = {
      label: OriginationLabels.WhitelistSale,
      currentPrice: offerData.getOfferTokenPrice,
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
      currentPrice: offerData.getOfferTokenPrice,
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

    const userPosition = {
      amountAvailableToVest: ZERO,
      amountAvailableToVestToWallet: ZERO,
      amountInvested: ZERO,
      amountVested: ZERO,
      fullyVestableAt: saleEndTimestamp.add(vestingPeriod.sub(cliffPeriod)),
      label: OriginationLabels.UserPosition,
      offerToken: offerToken,
      purchaseToken: purchaseToken || ETH,
      tokenPurchased: ZERO,
      userToVestingId: [],
      vestableAt: saleEndTimestamp.add(cliffPeriod),
      vestableTokenAmount, // TODO: Redundant?
      vestingPeriod,
    }

    const offeringSummary = {
      label: OriginationLabels.OfferingSummary,
      offerToken: offerToken,
      purchaseToken: purchaseToken || ETH,
      tokensAcquired: offerTokenAmountSold,
      purchaseTokenRaised: purchaseTokensAcquired,
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
        if (whitelistSaleDuration.gt(0)) {
          const { hasSetWhitelistMerkleRoot, merkleRoot } = (
            await axios.get(
              `${ORIGINATION_API_URL}/whitelistMerkleRoot?network=${offerData.network}&poolAddress=${poolAddress}`
            )
          ).data

          _whitelist.whitelist = hasSetWhitelistMerkleRoot
          _whitelist.whitelistMerkleRoot = merkleRoot

          if (hasSetWhitelistMerkleRoot) {
            // `maxContributionAmount` doesn't exist on contract level. Can only get from API.
            const { maxContributionAmount, isAddressWhitelisted } = (
              await axios.get(
                `${ORIGINATION_API_URL}/whitelistedAccountDetails/?accountAddress=${account}&poolAddress=${poolAddress}&network=${offerData.network}`
              )
            ).data

            _whitelist.addressCap = BigNumber.from(maxContributionAmount)
            _whitelist.isAddressWhitelisted = isAddressWhitelisted
          }
        }

        const erc20 = new ERC20Service(
          readonlyProvider,
          poolAddress,
          offerData.purchaseToken.address
        )
        offerData.purchaseTokenBalance = await erc20.getBalanceOf(poolAddress)
      } catch (e) {
        // Whitelist detail for pool is missing
      }

      // Fetch `account` related data
      if (account) {
        try {
          const [
            offerTokenAmountPurchased,
            purchaseTokenContribution,
            isOwnerOrManager,
            vestingEntryNFTAddress,
          ] = await Promise.all([
            fungiblePool.contract.offerTokenAmountPurchased(account),
            fungiblePool.contract.purchaseTokenContribution(account),
            fungiblePool.contract.isOwnerOrManager(account),
            fungiblePool.contract.vestingEntryNFT(),
          ])

          const graphqlUrl = `https://api.thegraph.com/subgraphs/name/xtokenmarket/origination-${offerData.network}`
          const eventVariables = {
            poolAddress: poolAddress.toLowerCase(),
            account: account.toLowerCase(),
          }

          let tokensClaimedEntry = ZERO
          if (reserveAmount.isZero() && vestingPeriod.isZero()) {
            try {
              const entries = (
                await fetchQuery(
                  TOKEN_PURCHASED_AMOUNT_QUERY,
                  eventVariables,
                  graphqlUrl
                )
              ).tokensClaimedEntries

              tokensClaimedEntry = entries.reduce(
                (partialSum: string, a: any) =>
                  BigNumber.from(partialSum).add(a.amountClaimed),
                ZERO
              )
            } catch (error) {
              console.error('Error while fetching tokensClaimedEntry')
            }
          }

          let userToVestingEntryIds = []
          try {
            userToVestingEntryIds = (
              await fetchQuery(ENTRY_IDS_QUERY, eventVariables, graphqlUrl)
            ).userToVestingEntryIds
          } catch (error) {
            console.error('Error while fetching userToVestingEntryIds')
          }

          const vestingEntryNFTContract = new Contract(
            vestingEntryNFTAddress,
            Abi.VestingEntryNFT,
            readonlyProvider
          )

          let nftInfos = []

          if (
            vestingEntryNFTAddress !== ethers.constants.AddressZero &&
            userToVestingEntryIds.length !== 0
          ) {
            nftInfos = await Promise.all(
              userToVestingEntryIds.map((x: any) =>
                vestingEntryNFTContract.tokenIdVestingAmounts(x.userToVestingId)
              )
            )
          }

          const totalTokenAmount = nftInfos.reduce((a, b) => {
            return a.add(b.tokenAmount)
          }, ZERO)
          const totalTokenAmountClaimed = nftInfos.reduce((a, b) => {
            return a.add(b.tokenAmountClaimed)
          }, ZERO)

          let offerTokenPayout = ZERO
          try {
            offerTokenPayout =
              await fungiblePool.contract.calculateClaimableVestedAmount(
                totalTokenAmount,
                totalTokenAmountClaimed
              )
          } catch (error) {
            // Ignore
          }

          offeringOverview.isOwnerOrManager = isOwnerOrManager

          userPosition.amountAvailableToVest = totalTokenAmount.sub(
            totalTokenAmountClaimed
          )
          userPosition.amountInvested = purchaseTokenContribution
          userPosition.amountVested = totalTokenAmountClaimed
          userPosition.tokenPurchased =
            reserveAmount.isZero() && vestingPeriod.isZero()
              ? tokensClaimedEntry
              : offerTokenAmountPurchased
          userPosition.userToVestingId = userToVestingEntryIds.map(
            (x: any) => x.userToVestingId
          )
          userPosition.amountAvailableToVestToWallet = offerTokenPayout
        } catch (e) {
          console.error('Error while fetching account related data', e)
        }
      }
    }

    const _startingPrice = saleInitiatedTimestamp.gt(0)
      ? offerData.getOfferTokenPrice
      : !whitelistStartingPrice.isZero()
      ? whitelistStartingPrice
      : publicStartingPrice

    const _offerData: ITokenOffer = {
      address: poolAddress,
      network,
      offeringSummary,
      userPosition,
      whitelist: _whitelist,
      offeringOverview,
      publicSale,
      originationRow: {
        ...offeringOverview,
        startingPrice: _startingPrice,
        saleDuration: publicSaleDuration,
        createdAt,
        description,
        poolName,
      },
      sponsorTokensClaimed: offerData.sponsorTokensClaimed,
      purchaseTokenBalance: offerData.purchaseTokenBalance,
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
