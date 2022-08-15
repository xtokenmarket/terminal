import { useState } from 'react'
import { BigNumber } from 'ethers'
import { transparentize } from 'polished'
import { useHistory, useParams } from 'react-router'
import { Button, makeStyles, Tooltip, Typography } from '@material-ui/core'
import { PageContent, PageHeader, PageWrapper, SimpleLoader } from 'components'
import { useOriginationPool } from 'helpers'
import { getCurrentTimeStamp, getRemainingTimeSec } from 'utils'
import { EOriginationEvent, EPricingFormula, Network } from 'utils/enums'
import { IClaimData } from 'types'

import { ClaimModal } from './components/ClaimModal'
import { InitiateSaleModal } from './components/InitiateSaleModal'
import { InvestModal } from './components/InvestModal'
import { SetWhitelistModal } from './components/SetWhitelistModal'
import { Table } from './components/Table'
import { VestModal } from './components/VestModal'

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
}))

type RouteParams = {
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

  const [state, setState] = useState<IState>({
    isClaimModalOpen: false,
    isInitiateSaleModalOpen: false,
    isInvestModalOpen: false,
    isVestModalOpen: false,
    open: false,
    isWhitelistInvestClicked: false,
  })

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

  const toggleClaimModal = () => {
    setState((prev) => ({
      ...prev,
      isClaimModalOpen: !state.isClaimModalOpen,
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

    if (isOwnerOrManager && isOfferUnsuccessful) {
      return {
        token: tokenOffer.offeringOverview.offerToken,
        amount: tokenOffer.offeringOverview.totalOfferingAmount,
      }
    }
    if (isOwnerOrManager && !isOfferUnsuccessful) {
      return {
        token: tokenOffer.offeringOverview.purchaseToken,
        amount: tokenOffer.offeringSummary.amountsRaised,
      }
    }
    if (!isOwnerOrManager && isOfferUnsuccessful) {
      return {
        token: tokenOffer.offeringOverview.purchaseToken,
        amount: BigNumber.from(tokenOffer.userPosition.amountInvested),
      }
    }
    if (!isOwnerOrManager && !isOfferUnsuccessful) {
      return {
        token: tokenOffer.offeringOverview.offerToken,
        amount: BigNumber.from(tokenOffer.userPosition.tokenPurchased),
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

  const isSaleCompleted =
    tokenOffer &&
    !tokenOffer?.offeringOverview.salesBegin.isZero() &&
    getRemainingTimeSec(tokenOffer?.offeringOverview.salesEnd).isZero()

  const isOfferUnsuccessful =
    tokenOffer &&
    isSaleCompleted &&
    tokenOffer.offeringOverview.reserveAmount.gt(
      tokenOffer.offeringSummary.amountsRaised
    )

  const isVestButtonShow =
    tokenOffer &&
    tokenOffer?.userPosition.amountAvailableToVest.gt(0) &&
    tokenOffer.offeringOverview.vestingPeriod.gt(0) &&
    !isOwnerOrManager &&
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
  const isClaimableDuringSale =
    isOwnerOrManager &&
    !isSaleCompleted &&
    isReserveAmountZero &&
    isVestingPeriodZero &&
    tokenOffer?.offerTokenBalance.gt(0)

  const isClaimManager =
    isOwnerOrManager && isSaleCompleted && !tokenOffer.sponsorTokensClaimed

  const isUnsuccessfulVestingSaleClaimUser =
    isOfferUnsuccessful &&
    tokenOffer.userPosition.amountInvested.gt(0) &&
    tokenOffer.offeringOverview.vestingPeriod.gt(0)

  const isSuccessfulSaleClaimUser =
    isCliffPeriodPassed() &&
    !isReserveAmountZero &&
    !isOfferUnsuccessful &&
    tokenOffer?.userPosition.tokenPurchased.gt(0) &&
    isVestingPeriodZero

  const isUnsuccessfulSaleClaimUser =
    isOfferUnsuccessful &&
    tokenOffer.userPosition.amountInvested.gt(0) &&
    !isReserveAmountZero

  const isClaimButtonShow =
    tokenOffer &&
    isSaleInitiated &&
    (isClaimManager ||
      isUnsuccessfulVestingSaleClaimUser ||
      isSuccessfulSaleClaimUser ||
      isUnsuccessfulSaleClaimUser ||
      (isVestingPeriodZero && isReserveAmountZero && isOwnerOrManager))

  const isUserPositionShow =
    tokenOffer &&
    (tokenOffer.userPosition.tokenPurchased.gt(0) ||
      tokenOffer.userPosition.amountInvested.gt(0) ||
      tokenOffer?.userPosition.amountAvailableToVest.gt(0))

  const isPublicSaleInvestDisabled =
    !isSaleInitiated || tokenOffer?.whitelist.timeRemaining.gt(0) || isSoldOut

  const isWhitelistSaleEnded = BigNumber.from(
    Math.floor(Date.now() / 1000)
  ).gte(tokenOffer?.whitelist.endOfWhitelistPeriod || 0)

  const isAddressCapExceeded = tokenOffer?.userPosition.amountInvested.gte(
    tokenOffer?.whitelist.addressCap
  )

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
    isSaleInitiated

  const isVestedPropertiesShow =
    (tokenOffer?.userPosition.amountAvailableToVest.gt(0) ||
      tokenOffer?.userPosition.amountvested.gt(0)) &&
    !isOfferUnsuccessful

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
              />
            ) : (
              <Table
                item={tokenOffer.offeringOverview}
                label={'Offering Overview'}
                toggleModal={toggleInitiateSaleModal}
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
                  toggleModal={toggleSetWhitelistModal}
                  isOwnerOrManager={isOwnerOrManager}
                  isWhitelistSet={tokenOffer.whitelist.whitelist}
                  isFormulaStandard={
                    tokenOffer.whitelist.pricingFormula ===
                    EPricingFormula.Standard
                  }
                />
                <div className={cl.buttonWrapper}>
                  <Tooltip
                    title={
                      isAddressCapExceeded && !isWhitelistSaleEnded
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
                />
                <Button
                  className={cl.button}
                  onClick={toggleInvestModal}
                  disabled={isPublicSaleInvestDisabled}
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
                isClaimButtonDisabled={
                  !isClaimableDuringSale && !isSaleCompleted
                }
                isClaimButtonShow={isClaimButtonShow}
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
              onClose={toggleInitiateSaleModal}
              onSuccess={onInitiateSuccess}
              open={state.isInitiateSaleModalOpen}
            />
            <ClaimModal
              poolAddress={poolAddress}
              isOpen={state.isClaimModalOpen}
              onClose={toggleClaimModal}
              data={getClaimData()}
              isOwnerOrManager={isOwnerOrManager}
              onClaimSuccess={onClaimSuccess}
            />
            <InvestModal
              isWhitelist={state.isWhitelistInvestClicked}
              offerData={tokenOffer.offeringOverview}
              onClose={toggleInvestModal}
              onSuccess={onInvestSuccess}
              open={state.isInvestModalOpen}
              addressCap={tokenOffer.whitelist.addressCap}
              isSaleCompleted={isSaleCompleted}
              whitelistData={tokenOffer.whitelist}
              userPositionData={tokenOffer.userPosition}
            />
            <VestModal
              offerData={tokenOffer.offeringOverview}
              onClose={toggleVestModal}
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
