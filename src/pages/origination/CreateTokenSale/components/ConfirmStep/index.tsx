import { useState } from 'react'
import { Button, Grid, Typography, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { ICreateTokenSaleData, IToken } from 'types'
import { CreateTokenSaleModal } from '../CreateTokenSaleModal'
import { PricingFormulaTable } from '../PricingFormulaTable'
import { getDurationSec, parseDurationSec } from 'utils'

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.colors.white,
    marginBottom: theme.spacing(2),
    fontWeight: 700,
    fontSize: 18,
  },
  editWrapper: {
    borderRadius: 4,
    backgroundColor: theme.colors.primary600,
    padding: '16px 32px 36px 32px',
    marginRight: 6,
  },
  tokenLogo: {
    display: 'flex',
    lineHeight: '48px',
    verticalAlign: 'middle',
    marginBottom: 20,
  },
  tokenIcon: {
    width: 48,
    height: 48,
    marginRight: theme.spacing(1),
    position: 'relative',
    borderRadius: '50%',
    '&+&': {
      left: -16,
    },
  },
  tokenSymbols: {
    color: theme.colors.white,
    fontSize: 28,
    fontWeight: 700,
    lineHeight: '48px',
  },
  detailsWrapper: {
    marginTop: 10,
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'nowrap',
    },

    '& .separator': {
      [theme.breakpoints.up('sm')]: {
        marginRight: 'auto',
        marginLeft: 'auto',
        alignSelf: 'flex-end',
        width: 1,
        background: theme.colors.primary200,
        height: 58,
      },
    },
  },
  section: {
    width: 'fit-content',
    minHeight: 88,

    '& .title': {
      color: theme.colors.primary100,
      margin: 0,
      fontSize: 14,
      fontWeight: 700,
      marginBottom: 4,
    },

    '& .data': {
      color: theme.colors.white,
      margin: 0,
      fontSize: 22,
      fontWeight: 600,
    },

    '& .description': {
      color: theme.colors.primary100,
      margin: 0,
      fontSize: 14,
      fontWeight: 500,
    },
  },
  nextButton: {
    marginTop: 'auto',
  },
  invisible: {
    visibility: 'hidden',
  },
  whitelistSaleSummary: {
    marginBottom: theme.spacing(3),
  },
  editBtn: {
    marginTop: theme.spacing(3.3),
    border: `1px solid ${theme.colors.primary200}`,
  },
}))

interface IProps {
  data: ICreateTokenSaleData
  updateData: (_: any) => void
  onEdit: () => void
}

export const ConfirmStep: React.FC<IProps> = ({ data, onEdit }) => {
  const { offerToken } = data
  const classes = useStyles()
  const [isSellTokenModalVisible, setIsSellTokenModalVisible] = useState(false)

  const toggleSellTokenModal = () =>
    setIsSellTokenModalVisible((prevState) => !prevState)

  const getOfferingPeriod = () => {
    const whitelistSaleSec = getDurationSec(
      Number(data.whitelistSale.offeringPeriod || 0),
      data.whitelistSale.offeringPeriodUnit.toString()
    ).toNumber()
    const publicSaleSec = getDurationSec(
      Number(data.publicSale.offeringPeriod || 0),
      data.publicSale.offeringPeriodUnit.toString()
    ).toNumber()

    return parseDurationSec(whitelistSaleSec + publicSaleSec)
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <div className={classes.editWrapper}>
            <Grid item xs={12}>
              <div className={classes.tokenLogo}>
                <img className={classes.tokenIcon} src={offerToken?.image} />
                <Typography className={classes.tokenSymbols}>
                  {offerToken?.symbol.toUpperCase()}
                </Typography>
              </div>
              <Grid container className={classes.detailsWrapper}>
                <Grid item xs={12} sm={3} className={classes.section}>
                  <div className="content">
                    <p className="title">Offer token amount</p>
                    <p className="data">
                      {data.offerTokenAmount} {offerToken?.symbol.toUpperCase()}
                    </p>
                  </div>
                </Grid>
                <span className="separator" />
                <Grid item xs={12} sm={4} className={classes.section}>
                  <div className="content">
                    <p className="title">Reserve amount</p>
                    <p className="data">
                      {data.reserveOfferTokenAmount}{' '}
                      {data.purchaseToken?.symbol.toUpperCase()}
                    </p>
                  </div>
                </Grid>
                <span className="separator" />
                <Grid item xs={12} sm={3} className={classes.section}>
                  <div className="content">
                    <p className="title">Offering Period</p>
                    <p className="data">{getOfferingPeriod()}</p>
                  </div>
                </Grid>
              </Grid>
              {data.vestingPeriod && (
                <Grid container className={classes.detailsWrapper}>
                  <Grid item xs={12} sm={3} className={classes.section}>
                    <div className="content">
                      <p className="title">Vesting Period</p>
                      <p className="data">
                        {data.vestingPeriod} {data.vestingPeriodUnit}
                      </p>
                    </div>
                  </Grid>
                  <span className="separator" />
                  <Grid item xs={12} sm={4} className={classes.section}>
                    <div className="content">
                      <p className="title">Cliff Period</p>
                      <p className="data">
                        {data.cliffPeriod} {data.cliffPeriodUnit}
                      </p>
                    </div>
                  </Grid>
                  <span className={clsx('separator', classes.invisible)} />
                  <Grid item xs={12} sm={3} className={classes.section}></Grid>
                </Grid>
              )}

              <Button
                color="secondary"
                fullWidth
                onClick={onEdit}
                variant="contained"
                className={classes.editBtn}
              >
                EDIT
              </Button>
            </Grid>
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
          {data.whitelistSale.enabled && offerToken && (
            <div className={classes.whitelistSaleSummary}>
              <Typography className={classes.label}>
                Whitelist Sale Summary
              </Typography>
              <PricingFormulaTable
                saleData={data.whitelistSale}
                offerToken={offerToken}
                purchaseToken={data.purchaseToken as IToken}
              />
            </div>
          )}

          {data.publicSale.enabled && offerToken && (
            <>
              <Typography className={classes.label}>
                Public Sale Summary
              </Typography>
              <PricingFormulaTable
                saleData={data.publicSale}
                offerToken={offerToken}
                purchaseToken={data.purchaseToken as IToken}
              />
            </>
          )}
        </Grid>
      </Grid>

      <Button
        className={classes.nextButton}
        color="primary"
        fullWidth
        onClick={toggleSellTokenModal}
        variant="contained"
      >
        SUBMIT
      </Button>

      <CreateTokenSaleModal
        isOpen={isSellTokenModalVisible}
        onClose={toggleSellTokenModal}
        data={data}
      />
    </>
  )
}
