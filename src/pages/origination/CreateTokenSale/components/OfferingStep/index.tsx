import { Grid, makeStyles, Typography } from '@material-ui/core'
import { TokenSelect } from 'components'
import { ICreateTokenSaleData } from 'types'
import { Input } from '../Input'

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.colors.white,
    marginBottom: 18,
    fontFamily: 'Gilmer',
    fontWeight: 700,
    fontSize: 14,
  },
}))

interface IProps {
  data: ICreateTokenSaleData
  updateData: (_: any) => void
  onNext: () => void
}

export const OfferingStep: React.FC<IProps> = ({
  data,
  updateData,
  onNext,
}) => {
  const classes = useStyles()

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography className={classes.label}>Offer Token</Typography>
          <TokenSelect
            token={data.offerToken}
            onChange={(offerToken) => updateData({ offerToken })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography className={classes.label}>Purchase Token</Typography>
          <TokenSelect
            token={data.purchaseToken}
            onChange={(purchaseToken) => updateData({ purchaseToken })}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} direction="column">
        <Grid item xs={12} md={6}>
          <Typography className={classes.label}>Offer Token Amount</Typography>
          <Input
            value={data.offerTokenAmount}
            onChange={(e) => updateData({ offerTokenAmount: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography className={classes.label}>
            Reserve Offer Token Amount
          </Typography>
          <Input
            value={data.reserveOfferTokenAmount}
            onChange={(e) =>
              updateData({ reserveOfferTokenAmount: e.target.value })
            }
          />
        </Grid>
      </Grid>
    </>
  )
}
