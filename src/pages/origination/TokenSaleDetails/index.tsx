import { useState } from 'react'
import { BigNumber } from 'ethers'
import { transparentize } from 'polished'
import { useHistory, useParams } from 'react-router'
import { Button, makeStyles, Tooltip, Typography } from '@material-ui/core'
import { PageContent, PageHeader, PageWrapper, SimpleLoader } from 'components'
import { useOriginationPool } from 'helpers'
import { formatDateTime, getCurrentTimeStamp, getRemainingTimeSec } from 'utils'
import { EOriginationEvent, EPricingFormula, Network } from 'utils/enums'
import { IClaimData } from 'types'

import { ClaimModal } from './components/ClaimModal'
import { InitiateSaleModal } from './components/InitiateSaleModal'
import { InvestModal } from './components/InvestModal'
import { SetWhitelistModal } from './components/SetWhitelistModal'
import { Table } from './components/Table'
import { VestModal } from './components/VestModal'
import { useConnectedWeb3Context } from 'contexts'
import { TokenSaleDescription } from '../TokenSaleDescription'

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: 14,
    '&:hover': {
      opacity: 0.7,
      backgroundColor: theme.colors.secondary,
    },
    padding: '8px 20px',
    backgroundColor: theme.colors.secondary,
    borderRadius: 4,
    '&:disabled': {
      opacity: 0.3,
      backgroundColor: theme.colors.secondary,
    },
  },
  text: {
    color: theme.colors.primary700,
    fontSize: 14,
    fontWeight: 600,
  },
  root: {
    paddingBottom: 20,
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      backgroundColor: transparentize(0.6, theme.colors.primary),
      height: 12,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.colors.primary,
    },
  },
  marginLeft: {
    marginLeft: 10,
  },
  buttonWrapper: {
    display: 'flex',
  },
  errorMessageWrapper: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    marginTop: 14,
    color: theme.colors.warn3,
    marginLeft: 10,
    fontSize: 14,
  },
  tooltip: {
    backgroundColor: theme.colors.primary300,
    fontFamily: 'Gilmer',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 8,
  },
  tooltipArrow: {
    color: theme.colors.primary300,
  },
  hr: {
    borderColor: theme.colors.primary200,
    marginTop: 20,
  },
}))

export type RouteParams = {
  network: string
  poolAddress: string
}

interface IState {
  isClaimModalOpen: boolean
  isInitiateSaleModalOpen: boolean
  isInvestModalOpen: boolean
  isVestModalOpen: boolean
  open: boolean
  isWhitelistInvestClicked: boolean
  isClaimToken: boolean
}

const TokenSaleDetails = () => {
  const cl = useStyles()
  const history = useHistory()
  const { network, poolAddress } = useParams<RouteParams>()
  const { tokenOffer, loadInfo } = useOriginationPool(
    poolAddress,
    network as Network,
    undefined,
    true
  )
  const { account, library: provider } = useConnectedWeb3Context()

  const [state, setState] = useState<IState>({
    isClaimModalOpen: false,
    isInitiateSaleModalOpen: false,
    isInvestModalOpen: false,
    isVestModalOpen: false,
    open: false,
    isWhitelistInvestClicked: false,
    isClaimToken: false,
  })

  const unsoldOfferTokenAmount =
    tokenOffer?.offeringOverview.totalOfferingAmount.sub(
      tokenOffer?.offeringOverview.offerTokenAmountSold
    )

  const onInitiateSuccess = async () => {
    setState((prev) => ({
      ...prev,
      isInitiateSaleModalOpen: false,
    }))
    await loadInfo(true, EOriginationEvent.InitiateSale)
  }

  const onVestSuccess = async () => {
    setState((prev) => ({
      ...prev,
      isVestModalOpen: false,
    }))
    await loadInfo()
  }

  const onClose = () => {
    setState((prev) => ({
      ...prev,
      open: false,
    }))
  }

  const onSuccess = async () => {
    setState((prev) => ({
      ...prev,
      open: false,
    }))
    await loadInfo()
  }

  const onSaleEnd = async () => {
    await loadInfo(true, EOriginationEvent.SaleEnded)
  }

  const onCliffTimeEnd = async () => {
    await loadInfo(true, EOriginationEvent.Vestable)
  }

  const toggleSetWhitelistModal = () => {
    setState((prev) => ({
      ...prev,
      open: !state.open,
    }))
  }

  const toggleInitiateSaleModal = () => {
    setState((prev) => ({
      ...prev,
      isInitiateSaleModalOpen: !state.isInitiateSaleModalOpen,
    }))
  }

  const toggleClaimModal = (label?: string) => {
    setState((prev) => ({
      ...prev,
      isClaimModalOpen: !state.isClaimModalOpen,
      isClaimToken: !!(label === 'My Position'),
    }))
  }

  const toggleVestModal = () => {
    setState((prev) => ({
      ...prev,
      isVestModalOpen: !state.isVestModalOpen,
    }))
  }

  const toggleInvestModal = () => {
    setState((prev) => ({
      ...prev,
      isInvestModalOpen: !state.isInvestModalOpen,
      isWhitelistInvestClicked: false,
    }))
  }

  const toggleWhitelistInvestModal = () => {
    setState((prev) => ({
      ...prev,
      isInvestModalOpen: !state.isInvestModalOpen,
      isWhitelistInvestClicked: true,
    }))
  }

  const onInvestSuccess = async () => {
    setState((prev) => ({
      ...prev,
      isInvestModalOpen: false,
    }))
    await loadInfo(true, EOriginationEvent.Invest)
  }

  const onClaimSuccess = async () => {
    setState((prev) => ({
      ...prev,
      isClaimModalOpen: false,
    }))
    await loadInfo(true, EOriginationEvent.Claim)
  }

  const _onClose = (key: string) => {
    setState((prev) => ({
      ...prev,
      [key]: false,
    }))
  }

  const isCliffPeriodPassed = () => {
    if (!tokenOffer) return false

    const now = BigNumber.from(getCurrentTimeStamp())
    const cliffPeriodEnd = tokenOffer?.offeringOverview.salesEnd.add(
      tokenOffer.offeringOverview.cliffPeriod
    )
    return now.gt(cliffPeriodEnd)
  }

  const isOwnerOrManager = tokenOffer?.offeringOverview.isOwnerOrManager

  const getClaimData = (): IClaimData | undefined => {
    if (!tokenOffer) return undefined

    if (!isVestingPeriodZero || !isReserveAmountZero) {
      // manager claim all the offter tokens when sale is unsuccessful
      if (!state.isClaimToken && isOfferUnsuccessful) {
        return {
          offerToken: tokenOffer.offeringOverview.offerToken,
          offerTokenAmount: tokenOffer.offeringOverview.totalOfferingAmount,
        }
      }
      // manager claim all the purchase tokens and unsold offer tokens(if exist) when sale is successful
      if (!state.isClaimToken && !isOfferUnsuccessful) {
        const offerTokenData = unsoldOfferTokenAmount?.gt(0)
          ? {
              offerToken: tokenOffer.offeringOverview.offerToken,
              offerTokenAmount: unsoldOfferTokenAmount,
            }
          : {}
        return {
          purchaseToken: tokenOffer.offeringOverview.purchaseToken,
          purchaseTokenAmount: tokenOffer.offeringSummary.purchaseTokenRaised,
          ...offerTokenData,
        }
      }
      // user/manager claim their purchase tokens when sale is unsuccessful
      if (state.isClaimToken && isOfferUnsuccessful) {
        return {
          purchaseToken: tokenOffer.offeringOverview.purchaseToken,
          purchaseTokenAmount: BigNumber.from(
            tokenOffer.userPosition.amountInvested
          ),
        }
      }
      // user/manager claim their offer tokens when sale is successful
      if (state.isClaimToken && !isOfferUnsuccessful) {
        return {
          offerToken: tokenOffer.offeringOverview.offerToken,
          offerTokenAmount: BigNumber.from(
            tokenOffer.userPosition.tokenPurchased
          ),
        }
      }
    }

    if (isVestingPeriodZero && isReserveAmountZero) {
      // manager claim accrued purchase tokens during sale
      if (!state.isClaimToken && !isSaleCompleted) {
        return {
          purchaseToken: tokenOffer.offeringOverview.purchaseToken,
          purchaseTokenAmount: tokenOffer.purchaseTokenBalance,
        }
      }
      // manager claim accrued purchase tokens and/or unsold offer tokens after sale
      if (!state.isClaimToken && isSaleCompleted) {
        const purchaseTokenData = tokenOffer.purchaseTokenBalance.gt(0)
          ? {
              purchaseToken: tokenOffer.offeringOverview.purchaseToken,
              purchaseTokenAmount: tokenOffer.purchaseTokenBalance,
            }
          : {}
        const offerTokenData = unsoldOfferTokenAmount?.gt(0)
          ? {
              offerToken: tokenOffer.offeringOverview.offerToken,
              offerTokenAmount: unsoldOfferTokenAmount,
            }
          : {}
        return {
          ...purchaseTokenData,
          ...offerTokenData,
        }
      }
    }
  }

  const isSaleInitiated = tokenOffer?.offeringOverview.salesBegin.gt(0)

  const isReserveAmountZero =
    tokenOffer?.offeringOverview.reserveAmount.isZero()

  const isVestingPeriodZero =
    tokenOffer?.offeringOverview.vestingPeriod.isZero()

  const isSoldOut = tokenOffer?.offeringOverview.offerTokenAmountSold.eq(
    tokenOffer?.offeringOverview.totalOfferingAmount
  )

  const isAmountRaisedZero =
    tokenOffer?.offeringSummary.purchaseTokenRaised.isZero()
  const isVestingReserveZero = isReserveAmountZero && isVestingPeriodZero

  const isSaleCompleted =
    tokenOffer &&
    !tokenOffer?.offeringOverview.salesBegin.isZero() &&
    getRemainingTimeSec(tokenOffer?.offeringOverview.salesEnd).isZero()

  const isOfferUnsuccessful =
    tokenOffer &&
    isSaleCompleted &&
    (tokenOffer.offeringOverview.reserveAmount.gt(
      tokenOffer.offeringSummary.purchaseTokenRaised
    ) ||
      isAmountRaisedZero)

  const isVestButtonShow =
    tokenOffer &&
    tokenOffer?.userPosition.amountAvailableToVest.gt(0) &&
    tokenOffer.offeringOverview.vestingPeriod.gt(0) &&
    !isOfferUnsuccessful &&
    isSaleCompleted

  const isWhitelistSaleConfigured =
    tokenOffer &&
    tokenOffer.whitelist.startingPrice &&
    tokenOffer.whitelist.startingPrice.gt(0)

  const isPublicSaleConfigured =
    tokenOffer &&
    tokenOffer.publicSale.startingPrice &&
    tokenOffer.publicSale.startingPrice.gt(0)

  // ref: https://discord.com/channels/790695551057657876/923246975137226842/1004704774580617216
  // when vesting == 0, reserve == 0, pool manager has the the option to claim the accrued purchase token amount during and after sale
  // if used during sale, I should receive the accrued purchase token (can be called multiple times during sale if purchase token accrued)
  const isClaimPurchaseTokenButtonDisabled =
    !isSaleCompleted &&
    isReserveAmountZero &&
    isVestingPeriodZero &&
    !tokenOffer?.purchaseTokenBalance?.gt(0)

  // users calim their offer tokens when sale is successful after cliff period
  const isSuccessfulSaleClaimUser =
    isCliffPeriodPassed() &&
    !isOfferUnsuccessful &&
    tokenOffer?.userPosition.tokenPurchased.gt(0)

  // users calim their purchase tokens when sale is unsuccessful(with/without vesting period. Not showing "vest" in this case)
  const isUnsuccessfulSaleClaimUser =
    isOfferUnsuccessful && tokenOffer.userPosition.amountInvested.gt(0)

  // user/manager claim their offer/purchase tokens
  const isClaimButtonShowAfterSale =
    tokenOffer &&
    isSaleInitiated &&
    !isVestingReserveZero &&
    isSaleCompleted &&
    // vesting period must === 0 in this case. Otherwise it should show "vest"
    isVestingPeriodZero &&
    isSuccessfulSaleClaimUser

  // manager claim all the purchase tokens and unsold offer tokens(if exist) after sale
  const isClaimPurchaseTokenButtonShowAfterSale =
    isOwnerOrManager && isSaleCompleted && !tokenOffer.sponsorTokensClaimed

  // vesting and reserve === 0
  // manager claim all the purchase tokens during sale
  const isClaimButtonShowDuringSale =
    isOwnerOrManager &&
    !isSaleCompleted &&
    isVestingReserveZero &&
    tokenOffer?.purchaseTokenBalance.gt(0)

  // vesting and reserve === 0
  // manager claim all the purchase tokens and unsold offer tokens(if exist) after sale
  const isClaimButtonShowAfterSaleVestingReserve0 =
    isOwnerOrManager &&
    isSaleCompleted &&
    isVestingReserveZero &&
    (tokenOffer?.purchaseTokenBalance.gt(0) ||
      (unsoldOfferTokenAmount?.gt(0) && !tokenOffer.sponsorTokensClaimed))

  const isUserPositionShow =
    tokenOffer &&
    (tokenOffer.userPosition.tokenPurchased.gt(0) ||
      tokenOffer.userPosition.amountInvested.gt(0) ||
      tokenOffer?.userPosition.amountAvailableToVest.gt(0))

  const isPublicSaleItemsDisabled =
    !isSaleInitiated || tokenOffer?.whitelist.timeRemaining.gt(0) || isSoldOut

  const isWhitelistSaleEnded = BigNumber.from(
    Math.floor(Date.now() / 1000)
  ).gte(tokenOffer?.whitelist.endOfWhitelistPeriod || 0)

  const isAddressCapExceeded = tokenOffer?.userPosition.amountInvested.gte(
    tokenOffer?.whitelist.addressCap
  )

  const isDuringWhitelistSale =
    isSaleInitiated && !isSoldOut && !isWhitelistSaleEnded

  const iswhitelistSaleInvestDisabled =
    !isSaleInitiated ||
    !tokenOffer?.whitelist.isAddressWhitelisted ||
    isSoldOut ||
    isWhitelistSaleEnded ||
    isAddressCapExceeded

  const isInitiateSaleButtonDisabled =
    (tokenOffer &&
      tokenOffer.whitelist.salesPeriod?.gt(0) &&
      !tokenOffer.whitelist.whitelist) ||
    !tokenOffer?.originationRow.poolName

  const isVestedPropertiesShow =
    (tokenOffer?.userPosition.amountAvailableToVest.gt(0) ||
      tokenOffer?.userPosition.amountvested.gt(0)) &&
    !isOfferUnsuccessful

  const offeringName = tokenOffer?.originationRow.poolName
    ? tokenOffer.originationRow.poolName
    : `${tokenOffer?.offeringOverview.offerToken.symbol} ${formatDateTime(
        tokenOffer?.originationRow.createdAt.toNumber() || 0
      )}`

  return (
    <PageWrapper>
      <PageHeader
        headerTitle=" "
        backVisible
        onBack={() => history.push('/origination/discover')}
      />
      <PageContent>
        {!tokenOffer ? (
          <SimpleLoader />
        ) : (
          <div className={cl.root}>
            <TokenSaleDescription
              offeringName={offeringName}
              offeringDescription={tokenOffer.originationRow.description}
              loadInfo={() => loadInfo(true)}
              isOwnerOrManager={isOwnerOrManager}
              isSaleInitiated={isSaleInitiated}
            />
            <hr className={cl.hr} />
            <SetWhitelistModal
              poolAddress={poolAddress}
              open={state.open}
              onClose={onClose}
              onSuccess={onSuccess}
              purchaseToken={tokenOffer.offeringOverview.purchaseToken}
              totalOfferingAmount={
                tokenOffer.offeringOverview.totalOfferingAmount
              }
            />
            {isSaleCompleted ? (
              <Table
                item={tokenOffer.offeringSummary}
                label={'Offering Summary'}
                isOfferUnsuccessful={isOfferUnsuccessful}
                toggleModal={toggleClaimModal}
                isClaimButtonShow={
                  isClaimPurchaseTokenButtonShowAfterSale ||
                  isClaimButtonShowAfterSaleVestingReserve0
                }
              />
            ) : (
              <Table
                item={tokenOffer.offeringOverview}
                label={'Offering Overview'}
                toggleModal={
                  isSaleInitiated ? toggleClaimModal : toggleInitiateSaleModal
                }
                isOwnerOrManager={tokenOffer.offeringOverview.isOwnerOrManager}
                isInitiateSaleButtonDisabled={isInitiateSaleButtonDisabled}
                isSaleInitiated={isSaleInitiated}
              />
            )}
            {!isSaleCompleted && isWhitelistSaleConfigured && (
              <>
                <Table
                  onSaleEnd={onSaleEnd}
                  isSaleInitiated={isSaleInitiated}
                  item={tokenOffer.whitelist}
                  label={'Allowlist Sale'}
                  toggleModal={
                    isSaleInitiated ? toggleClaimModal : toggleSetWhitelistModal
                  }
                  isOwnerOrManager={isOwnerOrManager}
                  isWhitelistSet={tokenOffer.whitelist.whitelist}
                  isFormulaStandard={
                    tokenOffer.whitelist.pricingFormula ===
                    EPricingFormula.Standard
                  }
                  isClaimButtonShow={isClaimButtonShowDuringSale}
                  isClaimButtonDisabled={
                    isClaimPurchaseTokenButtonDisabled || !isDuringWhitelistSale
                  }
                />
                <div className={cl.buttonWrapper}>
                  <Tooltip
                    title={
                      isAddressCapExceeded &&
                      !isWhitelistSaleEnded &&
                      !(
                        tokenOffer.whitelist.whitelist &&
                        !tokenOffer.whitelist.isAddressWhitelisted
                      )
                        ? 'Invested amount has reached the address cap.'
                        : ''
                    }
                    arrow
                    placement="right"
                    classes={{
                      arrow: cl.tooltipArrow,
                      tooltip: cl.tooltip,
                    }}
                  >
                    <div>
                      <Button
                        className={cl.button}
                        onClick={toggleWhitelistInvestModal}
                        disabled={iswhitelistSaleInvestDisabled}
                      >
                        <Typography className={cl.text}>INVEST</Typography>
                      </Button>
                    </div>
                  </Tooltip>
                  {!tokenOffer.whitelist.isAddressWhitelisted &&
                    tokenOffer.whitelist.whitelist &&
                    !isWhitelistSaleEnded && (
                      <div className={cl.errorMessageWrapper}>
                        <img alt="info" src="/assets/icons/warning.svg" />
                        &nbsp;&nbsp;
                        <div>
                          Unfortunately, your address was not allowlisted
                        </div>
                      </div>
                    )}
                </div>
              </>
            )}
            {!isSaleCompleted && isPublicSaleConfigured && (
              <>
                <Table
                  onSaleEnd={onSaleEnd}
                  isWhitelistSaleEnded={isWhitelistSaleEnded}
                  isWhitelistSet={tokenOffer.whitelist.whitelist}
                  isSaleInitiated={isSaleInitiated}
                  item={tokenOffer.publicSale}
                  label={'Public Sale'}
                  isFormulaStandard={
                    tokenOffer.publicSale.pricingFormula ===
                    EPricingFormula.Standard
                  }
                  isClaimButtonShow={
                    isClaimButtonShowDuringSale && isWhitelistSaleEnded
                  }
                  toggleModal={toggleClaimModal}
                  isClaimButtonDisabled={
                    isClaimPurchaseTokenButtonDisabled ||
                    isPublicSaleItemsDisabled
                  }
                />
                <Button
                  className={cl.button}
                  onClick={toggleInvestModal}
                  disabled={isPublicSaleItemsDisabled}
                >
                  <Typography className={cl.text}>INVEST</Typography>
                </Button>
              </>
            )}
            {isUserPositionShow && (
              <Table
                isSaleCompleted={isSaleCompleted}
                onCliffTimeEnd={onCliffTimeEnd}
                item={tokenOffer.userPosition}
                label={'My Position'}
                toggleModal={toggleClaimModal}
                isVestedPropertiesShow={isVestedPropertiesShow}
                isOfferUnsuccessful={isOfferUnsuccessful}
                isClaimButtonDisabled={isClaimPurchaseTokenButtonDisabled}
                isClaimButtonShow={
                  isClaimButtonShowAfterSale || isUnsuccessfulSaleClaimUser
                }
              />
            )}
            {isVestButtonShow && (
              <Button
                className={cl.button}
                onClick={toggleVestModal}
                disabled={!isCliffPeriodPassed()}
              >
                <Typography className={cl.text}>VEST</Typography>
              </Button>
            )}
            <InitiateSaleModal
              offerData={tokenOffer.offeringOverview}
              onClose={() => _onClose('isInitiateSaleModalOpen')}
              onSuccess={onInitiateSuccess}
              open={state.isInitiateSaleModalOpen}
            />
            <ClaimModal
              poolAddress={poolAddress}
              isOpen={state.isClaimModalOpen}
              onClose={() => _onClose('isClaimModalOpen')}
              data={getClaimData()}
              isOwnerOrManager={isOwnerOrManager}
              onClaimSuccess={onClaimSuccess}
              isClaimToken={state.isClaimToken}
            />
            <InvestModal
              isWhitelist={state.isWhitelistInvestClicked}
              offerData={tokenOffer.offeringOverview}
              onClose={() => _onClose('isInvestModalOpen')}
              onSuccess={onInvestSuccess}
              open={state.isInvestModalOpen}
              addressCap={tokenOffer.whitelist.addressCap}
              isSaleCompleted={isSaleCompleted}
              whitelistData={tokenOffer.whitelist}
              userPositionData={tokenOffer.userPosition}
            />
            <VestModal
              offerData={tokenOffer.offeringOverview}
              onClose={() => _onClose('isVestModalOpen')}
              onSuccess={onVestSuccess}
              open={state.isVestModalOpen}
              userPositionData={tokenOffer.userPosition}
            />
          </div>
        )}
      </PageContent>
    </PageWrapper>
  )
}

export default TokenSaleDetails
