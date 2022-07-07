import { Network } from 'utils/enums'
import { AddressZero } from '@ethersproject/constants'
import { getAddress } from 'ethers/lib/utils'
import { parseTokenDetails } from 'utils/token'

export const TOKEN_OFFERS_QUERY = `
query {
  pools(first: 1000, orderBy: createdAt, orderDirection: desc) {
      id
      offerToken {
        id
        symbol
        name
        decimals
      }
      purchaseToken {
        id
        symbol
        name
        decimals
      }
      owner {
        id
      }
      manager {
        id
      }
      reserveAmount
      totalOfferingAmount
      offerTokenAmountSold
      publicStartingPrice
      publicEndingPrice
      publicSaleDuration
      saleInitiatedTimestamp
      saleEndTimestamp
      vestingPeriod
      cliffPeriod
      whitelistStartingPrice
      whitelistEndingPrice
      whitelistSaleDuration
      getOfferTokenPrice
      vestableTokenAmount
      purchaseTokensAcquired
    }
}
`

export const parseTokenOffers = (data: any, network: Network) => {
  return data.errors
    ? []
    : data.pools.map((pool: any) => {
        const { id, offerToken, purchaseToken, owner, manager, ...poolInfo } =
          pool
        return {
          address: getAddress(id),
          network,
          manager: manager ? getAddress(manager.id) : AddressZero,
          owner: owner ? getAddress(owner.id) : AddressZero,
          offerToken: parseTokenDetails(offerToken),
          purchaseToken: parseTokenDetails(purchaseToken),
          ...poolInfo,
        }
      })
}