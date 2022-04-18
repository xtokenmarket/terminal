import { useState } from 'react'
import { Button, Grid, Typography, makeStyles } from '@material-ui/core'
import { ICreateTokenSaleData } from 'types'
import { CreateTokenSaleModal } from '../CreateTokenSaleModal'
import { PricingFormulaTable } from '../PricingFormulaTable'

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.colors.white,
    marginBottom: theme.spacing(2),
  },
  editWrapper: {
    borderRadius: 4,
    backgroundColor: theme.colors.primary400,
    padding: theme.spacing(2),
  },
  logos: {
    display: 'flex',
    lineHeight: '48px',
    verticalAlign: 'middle',
  },
  tokenIcon: {
    width: 48,
    height: 48,
    border: `6px solid ${theme.colors.primary400}`,
    position: 'relative',
    borderRadius: '50%',
    '&+&': {
      left: -16,
    },
  },
  tokenSymbols: {
    color: theme.colors.white,
    fontSize: 22,
    fontWeight: 700,
    lineHeight: '48px',
  },
  detailsWrapper: {
    margin: theme.spacing(4, 0),
  },
  section: {
    '& .title': {
      color: theme.colors.primary100,
      margin: 0,
      fontSize: 14,
      fontWeight: 500,
      marginBottom: 5,
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

    '&+&': {
      [theme.breakpoints.up('sm')]: {
        borderLeft: `1px solid ${theme.colors.primary200}`,
        left: -16,
      },
    },
  },
  button: {
    marginTop: 20,
  },
}))

interface IProps {
  data: ICreateTokenSaleData
  updateData: (_: any) => void
  onEdit: () => void
}

export const ConfirmStep: React.FC<IProps> = ({ data, onEdit }) => {
  const classes = useStyles()
  const [isSellTokenModalVisible, setIsSellTokenModalVisible] = useState(false)

  const toggleSellTokenModal = () =>
    setIsSellTokenModalVisible((prevState) => !prevState)

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <div className={classes.editWrapper}>
            <Grid item xs={12}>
              <div className={classes.logos}>
                {[data.offerToken?.image, data.purchaseToken?.image].map(
                  (img) => (
                    <img className={classes.tokenIcon} src={img} key={img} />
                  )
                )}
                <Typography className={classes.tokenSymbols}>
                  {`${data.offerToken?.symbol.toUpperCase()}/${data.purchaseToken?.symbol.toUpperCase()}`}
                </Typography>
              </div>
              <Grid container spacing={3} className={classes.detailsWrapper}>
                <Grid item xs={12} sm={4} className={classes.section}>
                  <p className="title">Offer token amount</p>
                  <p className="data">{data.offerTokenAmount}</p>
                  <p className="description">{`${data.purchaseToken?.symbol} per ${data.offerToken?.symbol}`}</p>
                </Grid>
                <Grid item xs={12} sm={4} className={classes.section}>
                  <p className="title">Reserve offer token amount</p>
                  <p className="data">{data.reserveOfferTokenAmount}</p>
                  <p className="description">{`${data.purchaseToken?.symbol} per ${data.offerToken?.symbol}`}</p>
                </Grid>
                <Grid item xs={12} sm={4} className={classes.section}>
                  <p className="title">Offering Period</p>
                  <p className="data">
                    {data.offeringPeriod} {data.offeringPeriodUnit}
                  </p>
                </Grid>
              </Grid>

              <Button
                color="secondary"
                fullWidth
                onClick={onEdit}
                variant="contained"
              >
                EDIT
              </Button>
            </Grid>
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography className={classes.label}>
            Standard Pricing Formula
          </Typography>
          <PricingFormulaTable data={data} />
        </Grid>
      </Grid>

      <Button
        className={classes.button}
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
