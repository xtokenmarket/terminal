import { Button, makeStyles, Tooltip, Typography } from '@material-ui/core'
import { useConnectedWeb3Context } from 'contexts'
import { transparentize } from 'polished'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FungiblePoolService } from 'services'
import { OriginationDetailItem } from 'types'
import { TableHeader } from '../TableHeader'
import { TableRow } from '../TableRow'

const useStyles = makeStyles((theme) => ({
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
  content: {
    minWidth: 1000,
    marginTop: 15,
  },
  label: {
    fontWeight: 700,
    lineHeight: '19.2px',
    marginBottom: 3,
    color: theme.colors.white,
    marginTop: 24,
  },
  button: {
    marginTop: 24,
    height: 33,
    '&:hover': {
      opacity: 0.7,
      backgroundColor: theme.colors.secondary,
    },
    '&:disabled': {
      opacity: 0.3,
    },
    padding: '8px 15px',
    backgroundColor: theme.colors.secondary,
    borderRadius: 4,
  },
  text: {
    color: theme.colors.primary700,
    fontSize: 14,
    fontWeight: 600,
  },
  labelWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
}))

interface IProps {
  item: OriginationDetailItem
  label: string
  toggleModal?: () => void
  isOwnerOrManager?: boolean
  isVestedPropertiesShow?: boolean
  isOfferUnsuccessful?: boolean
  isInitiateSaleButtonDisabled?: boolean
  isWhitelistSet?: boolean
  isSaleInitiated?: boolean
  isFormulaStandard?: boolean
  isWhitelistSaleEnded?: boolean
  onSaleEnd?: () => void
  onCliffTimeEnd?: () => void
  isSaleCompleted?: boolean
}

export const Table = ({
  item,
  label,
  toggleModal,
  isOwnerOrManager,
  isVestedPropertiesShow,
  isOfferUnsuccessful,
  isInitiateSaleButtonDisabled,
  isWhitelistSet,
  isSaleInitiated,
  isFormulaStandard,
  isWhitelistSaleEnded,
  onSaleEnd,
  onCliffTimeEnd,
  isSaleCompleted,
}: IProps) => {
  const [saleInitiated, setSaleInitiated] = useState(false)
  const { account, library: provider } = useConnectedWeb3Context()
  const { poolAddress } = useParams<{ poolAddress: string }>()
  useEffect(() => {
    const fungibleOriginationPool = new FungiblePoolService(
      provider,
      account,
      poolAddress
    )

    fungibleOriginationPool
      .isSaleInitiated()
      .then((initiated) => setSaleInitiated(initiated))
  }, [account, provider, poolAddress])
  const cl = useStyles()

  const renderLabel = (label: string) => {
    switch (label) {
      case 'Whitelist Sale':
        return (
          <div className={cl.labelWrapper}>
            <Typography className={cl.label}>{label}</Typography>
            {isOwnerOrManager && (
              <span>
                <Button
                  className={cl.button}
                  onClick={() => {
                    toggleModal && toggleModal()
                  }}
                  disabled={isSaleInitiated}
                >
                  <Typography className={cl.text}>
                    {isWhitelistSet ? 'UPDATE WHITELIST' : 'SET WHITELIST'}
                  </Typography>
                </Button>
              </span>
            )}
          </div>
        )
      case 'Offering Overview':
        return (
          <div className={cl.labelWrapper}>
            <Typography className={cl.label}>{label}</Typography>
            {isOwnerOrManager && (
              <Button
                className={cl.button}
                onClick={toggleModal}
                disabled={isInitiateSaleButtonDisabled}
              >
                <Typography className={cl.text}>INITIATE SALE</Typography>
              </Button>
            )}
          </div>
        )
      default:
        return <Typography className={cl.label}>{label}</Typography>
    }
  }

  return (
    <>
      {renderLabel(label)}
      <div className={cl.content}>
        <TableHeader
          label={item.label}
          isVestedPropertiesShow={isVestedPropertiesShow}
          isOfferUnsuccessful={isOfferUnsuccessful}
          isFormulaStandard={isFormulaStandard}
          isSaleCompleted={isSaleCompleted}
        />
        <div>
          <TableRow
            item={item}
            toggleModal={toggleModal}
            isVestedPropertiesShow={isVestedPropertiesShow}
            isOfferUnsuccessful={isOfferUnsuccessful}
            isSaleInitiated={isSaleInitiated}
            isOwnerOrManager={isOwnerOrManager}
            isWhitelistSet={isWhitelistSet}
            isWhitelistSaleEnded={isWhitelistSaleEnded}
            onSaleEnd={onSaleEnd}
            onCliffTimeEnd={onCliffTimeEnd}
            isSaleCompleted={isSaleCompleted}
          />
        </div>
      </div>
    </>
  )
}
