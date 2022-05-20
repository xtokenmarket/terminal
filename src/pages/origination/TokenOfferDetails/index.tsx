import { Button, makeStyles, Typography } from '@material-ui/core'
import { PageWrapper, PageHeader, PageContent, SimpleLoader } from 'components'
import { useOriginationPool } from 'helpers/useOriginationPool'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { transparentize } from 'polished'
import { InitiateSaleModal } from './components/InitiateSaleModal'
import { SetWhitelistModal } from './components/SetWhitelistModal'
import { Table } from './components/Table'
import { ClaimModal } from '../CreateTokenSale/components/ClaimModal'
import { BigNumber } from 'ethers'

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
}

const TokenSaleDetails = () => {
  const cl = useStyles()
  const history = useHistory()
  const { poolAddress } = useParams<RouteParams>()
  const { tokenOffer, loadInfo } = useOriginationPool(poolAddress)
  const [state, setState] = useState<IState>({
    isInitiateSaleModalOpen: false,
    open: false,
    isClaimModalOpen: false,
  })

  const onInitiateSuccess = async () => {
    setState((prev) => ({
      ...prev,
      isInitiateSaleModalOpen: false,
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
    setState((prev) => ({
      ...prev,
      isClaimModalOpen: !state.isClaimModalOpen,
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
            />
            <Table
              item={tokenOffer.whitelist}
              label={'Whitelist Sale'}
              toggleModal={toggleSetWhitelistModal}
            />
            <Button
              className={cl.button}
              onClick={() => {
                console.log('onClick')
              }}
            >
              <Typography className={cl.text}>INVEST</Typography>
            </Button>
            <Table item={tokenOffer.publicSale} label={'Public Sale'} />
            <Button
              className={cl.button}
              onClick={() => {
                console.log('onClick')
              }}
            >
              <Typography className={cl.text}>INVEST</Typography>
            </Button>
            <Table
              item={tokenOffer.myPosition}
              label={'My Position'}
              toggleModal={toggleClaimModal}
            />
            <InitiateSaleModal
              offerData={tokenOffer.offeringOverview}
              onClose={toggleInitiateSaleModal}
              onSuccess={onInitiateSuccess}
              open={state.isInitiateSaleModalOpen}
            />
            <ClaimModal
              isOpen={state.isClaimModalOpen}
              onClose={toggleClaimModal}
              data={{
                token: tokenOffer.offeringOverview.purchaseToken,
                amount: BigNumber.from('0'),
              }}
            />
          </div>
        )}
      </PageContent>
    </PageWrapper>
  )
}

export default TokenSaleDetails
