import { Button, Grid, Typography, makeStyles } from '@material-ui/core'
import { useState } from 'react'
import { ICreateTokenSaleData } from 'types'
import { IpricingFormula } from 'utils/enums'
import { PricingFormulaTable } from '../PricingFormulaTable'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
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
      fontWeight: 700,
    },

    '& .data': {
      color: theme.colors.white,
      margin: 0,
      fontSize: 22,
      fontWeight: 800,
    },

    '& .description': {
      color: theme.colors.white,
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
}))
interface IProps {
  data: ICreateTokenSaleData
  updateData: (_: any) => void
  onEdit: () => void
}

export const ConfirmStep: React.FC<IProps> = ({ data, updateData, onEdit }) => {
  // TODO: tempData for testing. Can be removed later
  data = {
    cliffPeriod: '4',
    cliffPeriodUnit: 'Weeks',
    endingPrice: '136',
    isAddVestingPeriod: undefined,
    offerToken: {
      name: 'Xtoken',
      symbol: 'XTK',
      address: '0xc70b7ed718e1de0ed7d92f2b47f8b649d76add33',
      decimals: 18,
      image: '/assets/tokens/unknown.png',
    },
    offerTokenAmount: '43001',
    offeringPeriod: '2',
    offeringPeriodUnit: 'Weeks',
    pricingFormula: IpricingFormula.Ascending,
    purchaseToken: {
      name: 'DAI',
      symbol: 'DAI',
      decimals: 18,
      address: '0x90410304D88E333710703aF6Ed6A14d5ef74575F',
      image: '/assets/tokens/dai.png',
    },
    reserveOfferTokenAmount: '43000',
    startingPrice: '134',
    vestingPeriod: '4',
    vestingPeriodUnit: 'Weeks',
  }

  const classes = useStyles()
  const [isSellTokenModalVisible, setIsSellTokenModalVisible] = useState(false)

  const toggleSellTokenModal = () =>
    setIsSellTokenModalVisible((prevState) => !prevState)

  return (
    <div className={classes.root}>
      <div>
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
                    <p className="description">Best for most pairs.</p>
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
            <Typography className={classes.label}>Rewards</Typography>
            <PricingFormulaTable data={data} />
          </Grid>
        </Grid>
      </div>

      <Button
        color="primary"
        fullWidth
        onClick={toggleSellTokenModal}
        variant="contained"
      >
        SUBMIT
      </Button>
    </div>
  )
}
