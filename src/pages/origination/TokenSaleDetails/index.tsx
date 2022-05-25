import { useState } from 'react'
import { BigNumber } from 'ethers'
import { transparentize } from 'polished'
import { useHistory, useParams } from 'react-router'
import { useConnectedWeb3Context } from 'contexts'
import { Button, makeStyles, Typography } from '@material-ui/core'
import { PageWrapper, PageHeader, PageContent, SimpleLoader } from 'components'
import { useOriginationPool } from 'helpers/useOriginationPool'
import { InitiateSaleModal } from './components/InitiateSaleModal'
import { SetWhitelistModal } from './components/SetWhitelistModal'
import { Table } from './components/Table'
import { ClaimModal } from './components/ClaimModal'
import { VestModal } from './components/VestModal'
import { getRemainingTimeSec } from 'utils'

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
}))

type RouteParams = {
  network: string
  poolAddress: string
}

interface IState {
  isInitiateSaleModalOpen: boolean
  open: boolean
  isClaimModalOpen: boolean
  isVestModalOpen: boolean
}

const TokenSaleDetails = () => {
  const cl = useStyles()
  const history = useHistory()
  const { poolAddress } = useParams<RouteParams>()
  const { tokenOffer, loadInfo } = useOriginationPool(poolAddress)
  const { account, networkId, library: provider } = useConnectedWeb3Context()

  const [state, setState] = useState<IState>({
    isInitiateSaleModalOpen: false,
    open: false,
    isClaimModalOpen: false,
    isVestModalOpen: false,
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
            <Table
              item={tokenOffer.offeringOverview}
              label={'Offering Overview'}
              toggleModal={toggleInitiateSaleModal}
              isOwnerOrManager={tokenOffer.offeringOverview.isOwnerOrManager}
            />
            {tokenOffer.whitelist.startingPrice &&
              tokenOffer.whitelist.startingPrice.gt(0) && (
                <>
                  <Table
                    item={tokenOffer.whitelist}
                    label={'Whitelist Sale'}
                    toggleModal={toggleSetWhitelistModal}
                    isOwnerOrManager={
                      tokenOffer.offeringOverview.isOwnerOrManager
                    }
                  />
                  <Button
                    className={cl.button}
                    onClick={() => {
                      console.log('onClick')
                    }}
                  >
                    <Typography className={cl.text}>INVEST</Typography>
                  </Button>
                </>
              )}

            {getRemainingTimeSec(tokenOffer.offeringOverview.salesEnd).gt(
              0
            ) && (
              <>
                <Table item={tokenOffer.publicSale} label={'Public Sale'} />
                <Button
                  className={cl.button}
                  onClick={() => {
                    console.log('onClick')
                  }}
                >
                  <Typography className={cl.text}>INVEST</Typography>
                </Button>
              </>
            )}
            <Table
              item={tokenOffer.myPosition}
              label={'My Position'}
              toggleModal={toggleClaimModal}
            />
            <Button className={cl.button} onClick={toggleVestModal}>
              <Typography className={cl.text}>VEST</Typography>
            </Button>
            <Button className={cl.button} onClick={toggleClaimModal}>
              <Typography className={cl.text}>CLAIM</Typography>
            </Button>
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
