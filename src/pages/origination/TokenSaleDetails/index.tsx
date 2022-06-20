import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { transparentize } from 'polished'
import { useHistory, useParams } from 'react-router'
import { useConnectedWeb3Context } from 'contexts'
import { Button, makeStyles, Typography } from '@material-ui/core'
import { PageWrapper, PageHeader, PageContent, SimpleLoader } from 'components'
import { useOriginationPool } from 'helpers'
import { getCurrentTimeStamp, getRemainingTimeSec } from 'utils'
import { EPricingFormula, Network } from 'utils/enums'

import { ClaimModal } from './components/ClaimModal'
import { InitiateSaleModal } from './components/InitiateSaleModal'
import { InvestModal } from './components/InvestModal'
import { SetWhitelistModal } from './components/SetWhitelistModal'
import { Table } from './components/Table'
import { VestModal } from './components/VestModal'
import axios from 'axios'

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
    paddingBottom: 10,
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
    network as Network
  )
  const { account, networkId, library: provider } = useConnectedWeb3Context()
  const whitelistMerkleRoot = tokenOffer?.whitelist.whitelistMerkleRoot

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
    await loadInfo()
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
    console.log('Toggle open:', !state.isClaimModalOpen)
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
    await loadInfo()
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

  // TODO: user own at least 1 vesting entry nft
  const isVestButtonShow =
    tokenOffer &&
    tokenOffer?.myPosition.amountAvailableToVest.gt(0) &&
    isCliffPeriodPassed() &&
    tokenOffer.offeringOverview.vestingPeriod.gt(0) &&
    !isOwnerOrManager

  const isWhitelistSaleConfigured =
    tokenOffer &&
    tokenOffer.whitelist.startingPrice &&
    tokenOffer.whitelist.startingPrice.gt(0)

  const isPublicSaleConfigured =
    tokenOffer &&
    tokenOffer.publicSale.startingPrice &&
    tokenOffer.publicSale.startingPrice.gt(0)

  const isSaleCompleted =
    tokenOffer &&
    !tokenOffer?.offeringOverview.salesBegin.isZero() &&
    getRemainingTimeSec(tokenOffer?.offeringOverview.salesEnd).isZero()

  const isOfferUnsuccessful =
    tokenOffer &&
    isSaleCompleted &&
    tokenOffer.offeringOverview.offeringReserve.gt(
      tokenOffer.offeringSummary.amountsRaised
    )

  const isClaimButtonShow =
    tokenOffer &&
    ((isOwnerOrManager &&
      isCliffPeriodPassed() &&
      isSaleCompleted &&
      !tokenOffer.sponsorTokensClaimed) ||
      (tokenOffer.myPosition.tokenPurchased.gt(0) &&
        isCliffPeriodPassed() &&
        tokenOffer.offeringOverview.vestingPeriod.isZero()))

  const isMyPositionShow =
    tokenOffer &&
    (tokenOffer.myPosition.tokenPurchased.gt(0) ||
      tokenOffer.myPosition.amountInvested.gt(0))

  const isPublicSaleInvestDisabled =
    !tokenOffer?.offeringOverview.salesBegin.gt(0) ||
    tokenOffer.whitelist.timeRemaining.gt(0)

  const iswhitelistSaleInvestDisabled =
    !tokenOffer?.offeringOverview.salesBegin.gt(0) ||
    !tokenOffer.whitelist.isAddressWhitelisted

  const isInitiateSaleButtonDisabled =
    (tokenOffer &&
      tokenOffer.whitelist.salesPeriod?.gt(0) &&
      !tokenOffer.whitelist.whitelist) ||
    tokenOffer?.offeringOverview.salesBegin.gt(0)

  const isVestedPropertiesShow =
    tokenOffer?.myPosition.amountAvailableToVest.gt(0) ||
    tokenOffer?.myPosition.amountvested.gt(0)

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
              />
            )}
            {!isSaleCompleted && isWhitelistSaleConfigured && (
              <>
                <Table
                  isSaleInitiated={tokenOffer.offeringOverview.salesBegin.gt(0)}
                  item={tokenOffer.whitelist}
                  label={'Whitelist Sale'}
                  toggleModal={toggleSetWhitelistModal}
                  isOwnerOrManager={isOwnerOrManager}
                  isWhitelistSet={tokenOffer.whitelist.whitelist}
                  isFormulaStandard={
                    tokenOffer.whitelist.pricingFormula ===
                    EPricingFormula.Standard
                  }
                />
                {!isOwnerOrManager && (
                  <div className={cl.buttonWrapper}>
                    <Button
                      className={cl.button}
                      onClick={toggleWhitelistInvestModal}
                      disabled={iswhitelistSaleInvestDisabled}
                    >
                      <Typography className={cl.text}>INVEST</Typography>
                    </Button>
                    {!tokenOffer.whitelist.isAddressWhitelisted &&
                      tokenOffer.whitelist.whitelist && (
                        <div className={cl.errorMessageWrapper}>
                          <img alt="info" src="/assets/icons/warning.svg" />
                          &nbsp;&nbsp;
                          <div>
                            Unfortunately, your address was not whitelisted
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </>
            )}
            {!isSaleCompleted && isPublicSaleConfigured && (
              <>
                <Table
                  isWhitelistSaleEnded={BigNumber.from(
                    Math.floor(Date.now() / 1000)
                  ).gte(tokenOffer.whitelist.endOfWhitelistPeriod || 0)}
                  isWhitelistSet={tokenOffer.whitelist.whitelist}
                  isSaleInitiated={tokenOffer.offeringOverview.salesBegin.gt(0)}
                  item={tokenOffer.publicSale}
                  label={'Public Sale'}
                  isFormulaStandard={
                    tokenOffer.publicSale.pricingFormula ===
                    EPricingFormula.Standard
                  }
                />
                {!isOwnerOrManager && (
                  <Button
                    className={cl.button}
                    onClick={toggleInvestModal}
                    disabled={isPublicSaleInvestDisabled}
                  >
                    <Typography className={cl.text}>INVEST</Typography>
                  </Button>
                )}
              </>
            )}
            {isMyPositionShow && (
              <Table
                item={tokenOffer.myPosition}
                label={'My Position'}
                toggleModal={toggleClaimModal}
                isVestedPropertiesShow={isVestedPropertiesShow}
              />
            )}
            {isVestButtonShow && (
              <Button className={cl.button} onClick={toggleVestModal}>
                <Typography className={cl.text}>VEST</Typography>
              </Button>
            )}
            {isClaimButtonShow && (
              <Button className={cl.button} onClick={toggleClaimModal}>
                <Typography className={cl.text}>CLAIM</Typography>
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
              data={{
                token: isOwnerOrManager
                  ? tokenOffer.offeringOverview.purchaseToken
                  : tokenOffer.offeringOverview.offerToken,
                amount: isOwnerOrManager
                  ? tokenOffer.offeringSummary.amountsRaised
                  : BigNumber.from(tokenOffer.myPosition.tokenPurchased),
              }}
              isOwnerOrManager={isOwnerOrManager}
            />
            <InvestModal
              isWhitelist={state.isWhitelistInvestClicked}
              offerData={tokenOffer.offeringOverview}
              onClose={toggleInvestModal}
              onSuccess={onInvestSuccess}
              open={state.isInvestModalOpen}
              addressCap={tokenOffer.whitelist.addressCap}
            />
            <VestModal
              offerData={tokenOffer.offeringOverview}
              onClose={toggleVestModal}
              onSuccess={onVestSuccess}
              open={state.isVestModalOpen}
              myPositionData={tokenOffer.myPosition}
            />
          </div>
        )}
      </PageContent>
    </PageWrapper>
  )
}

export default TokenSaleDetails
