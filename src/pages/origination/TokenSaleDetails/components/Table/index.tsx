import { Button, makeStyles, Tooltip, Typography } from '@material-ui/core'
import { transparentize } from 'polished'
import { OriginationDetailItem } from 'types'
import { getRemainingTimeSec } from 'utils'

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
    marginTop: 40,
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
  },
  tooltipArrow: {
    color: theme.colors.primary300,
  },
  tooltip: {
    backgroundColor: theme.colors.primary300,
    fontFamily: 'Gilmer',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 8,
  },
}))

interface IProps {
  item: OriginationDetailItem
  label: string
  toggleModal?: (label?: string) => void
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
  isClaimButtonDisabled?: boolean
  isClaimButtonShow?: boolean
  isBonding?: boolean
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
  isClaimButtonDisabled,
  isClaimButtonShow,
  isBonding,
}: IProps) => {
  const cl = useStyles()

  const renderLabel = (label: string) => {
    const ClaimButton = () => (
      <Button
        className={cl.button}
        onClick={() => toggleModal && toggleModal(label || '')}
        disabled={isClaimButtonDisabled}
      >
        <Typography className={cl.text}>
          {label === 'My Activity'
            ? 'CLAIM'
            : `CLAIM ${item.purchaseToken.symbol}`}
        </Typography>
      </Button>
    )

    switch (label) {
      case 'Allowlist Program':
        return (
          <div className={cl.labelWrapper}>
            <Typography className={cl.label}>{label}</Typography>
            {isOwnerOrManager && !isSaleInitiated && (
              <span>
                <Button
                  id="setWhitelist"
                  className={cl.button}
                  onClick={() => {
                    toggleModal && toggleModal()
                  }}
                >
                  <Typography className={cl.text}>
                    {`${isWhitelistSet ? 'UPDATE' : 'SET'} ALLOWLIST`}
                  </Typography>
                </Button>
              </span>
            )}
            {isClaimButtonShow && <ClaimButton />}
          </div>
        )
      case 'Program Overview':
        return (
          <div className={cl.labelWrapper}>
            <Typography className={cl.label}>{label}</Typography>
            {isOwnerOrManager && !isSaleInitiated && (
              <Tooltip
                title={
                  isInitiateSaleButtonDisabled
                    ? 'Set up allowlist before initiate program'
                    : ''
                }
                arrow
                placement="top"
                classes={{
                  arrow: cl.tooltipArrow,
                  tooltip: cl.tooltip,
                }}
              >
                <div>
                  <Button
                    id="initiateSale"
                    className={cl.button}
                    onClick={() => toggleModal && toggleModal()}
                    disabled={isInitiateSaleButtonDisabled}
                  >
                    <Typography className={cl.text}>
                      INITIATE PROGRAM
                    </Typography>
                  </Button>
                </div>
              </Tooltip>
            )}
          </div>
        )

      case 'Public Program':
      case 'Program Summary':
      case 'My Activity':
        return (
          <div className={cl.labelWrapper}>
            <Typography className={cl.label}>
              {label === 'Public Program' && isBonding
                ? 'Bonding Programme'
                : label}
            </Typography>
            {isClaimButtonShow && <ClaimButton />}
          </div>
        )
      default:
        return <Typography className={cl.label}>{label}</Typography>
    }
  }

  // TODO: Simplify
  const getIsTimeRemainingToCliffShow = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (item.vestableAt) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return !getRemainingTimeSec(item.vestableAt).isZero()
    }
    return false
  }

  // TODO: Simplify
  const getIsTimeToFullVestShow = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (item.vestableAt && getRemainingTimeSec(item.vestableAt).isZero()) {
      return !getRemainingTimeSec(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        item.fullyVestableAt
      ).isZero()
    }
    return false
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
          isSaleInitiated={isSaleInitiated}
          isTimeRemainingToCliffShow={getIsTimeRemainingToCliffShow()}
          isTimeToFullVestShow={getIsTimeToFullVestShow()}
          isBonding={isBonding}
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
