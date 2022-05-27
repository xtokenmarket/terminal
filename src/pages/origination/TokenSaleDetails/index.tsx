import clsx from 'clsx'
import { useState } from 'react'
import { BigNumber } from 'ethers'
import { transparentize } from 'polished'
import { useHistory, useParams } from 'react-router'
// import { useConnectedWeb3Context } from 'contexts'
import { Button, makeStyles, Typography } from '@material-ui/core'
import { PageWrapper, PageHeader, PageContent, SimpleLoader } from 'components'
import { useOriginationPool } from 'helpers'
import { getCurrentTimeStamp, getRemainingTimeSec } from 'utils'

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
}

const TokenSaleDetails = () => {
  const cl = useStyles()
  const history = useHistory()
  const { poolAddress } = useParams<RouteParams>()
  const { tokenOffer, loadInfo } = useOriginationPool(poolAddress)
  // const { account, networkId, library: provider } = useConnectedWeb3Context()

  const [state, setState] = useState<IState>({
    isClaimModalOpen: false,
    isInitiateSaleModalOpen: false,
    isInvestModalOpen: false,
    isVestModalOpen: false,
    open: false,
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

  const toggleInitiateSaleModal = () => {
    setState((prev) => ({
      ...prev,
      isInitiateSaleModalOpen: !state.isInitiateSaleModalOpen,
    }))
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

  // TODO: user own at least 1 vesting entry nft
  const isVestButtonShow =
    tokenOffer &&
    tokenOffer?.myPosition.amountvested.gt(0) &&
    isCliffPeriodPassed()

  const isWhitelistSaleConfigured =
    tokenOffer &&
    tokenOffer.whitelist.startingPrice &&
    tokenOffer.whitelist.startingPrice.gt(0)

  const isSaleCompleted =
    tokenOffer &&
    !tokenOffer.offeringOverview.salesBegin.isZero() &&
    getRemainingTimeSec(tokenOffer?.offeringOverview.salesEnd).isZero()

  const isOfferUnsuccessful =
    tokenOffer &&
    isSaleCompleted &&
    tokenOffer.offeringOverview.offeringReserve.gt(
      tokenOffer.offeringSummary.amountsRaised
    )

  const isClaimButtonShow =
    tokenOffer &&
    tokenOffer.myPosition.tokenPurchased.gt(0) &&
    isCliffPeriodPassed()

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
              />
            )}
            {isWhitelistSaleConfigured && (
              <>
                <Table
                  item={tokenOffer.whitelist}
                  label={'Whitelist Sale'}
                  toggleModal={toggleSetWhitelistModal}
                  isOwnerOrManager={
                    tokenOffer.offeringOverview.isOwnerOrManager
                  }
                />
                <Button className={cl.button} onClick={toggleInvestModal}>
                  <Typography className={cl.text}>INVEST</Typography>
                </Button>
              </>
            )}
            {!isSaleCompleted && (
              <>
                <Table item={tokenOffer.publicSale} label={'Public Sale'} />
                <Button className={cl.button} onClick={toggleInvestModal}>
                  <Typography className={cl.text}>INVEST</Typography>
                </Button>
              </>
            )}
            <Table
              item={tokenOffer.myPosition}
              label={'My Position'}
              toggleModal={toggleClaimModal}
              isVestedPropertiesShow={isVestButtonShow}
            />
            {isVestButtonShow && (
              <Button
                className={clsx(cl.button, cl.marginLeft)}
                onClick={toggleVestModal}
              >
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
                token: tokenOffer.offeringOverview.offerToken,
                amount: BigNumber.from(tokenOffer.myPosition.tokenPurchased),
              }}
            />
            <InvestModal
              isWhitelist={Boolean(isWhitelistSaleConfigured)}
              offerData={tokenOffer.offeringOverview}
              onClose={toggleInvestModal}
              onSuccess={onInvestSuccess}
              open={state.isInvestModalOpen}
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
