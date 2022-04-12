import { Button, Grid, makeStyles, Typography } from '@material-ui/core'
import { ICreateTokenSaleData } from 'types'
import { IpricingFormula } from 'utils/enums'
import { Input } from '../Input'
import { Radio } from '../Radio'

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.colors.white,
    marginBottom: theme.spacing(2),
  },
  radio: { marginBottom: 34 },
}))

interface IProps {
  data: ICreateTokenSaleData
  updateData: (_: any) => void
  onNext: () => void
}

export const AuctionStep: React.FC<IProps> = ({ data, updateData, onNext }) => {
  const classes = useStyles()

  const isNextBtnDisabled = !(
    data.pricingFormula &&
    data.startingPrice &&
    data.endingPrice
  )

  const onClickNext = () => {
    onNext()
  }

  return (
    <>
      <Typography className={classes.label}>
        Choose the Pricing formula for this offering
      </Typography>
      <Radio
        className={classes.radio}
        items={Object.values(IpricingFormula)}
        onChange={(value) => {
          updateData({ pricingFormula: value })
        }}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Input
            label={`Starting Price - ${data.purchaseToken?.symbol} per ${data.offerToken?.symbol}`}
            value={data.startingPrice}
            onChange={(e) => updateData({ startingPrice: e.target.value })}
          />
          <Input
            label={`Ending Price - ${data.purchaseToken?.symbol} per ${data.offerToken?.symbol}`}
            value={data.endingPrice}
            onChange={(e) => updateData({ endingPrice: e.target.value })}
          />
        </Grid>
      </Grid>

      <Button
        color="primary"
        fullWidth
        onClick={onClickNext}
        variant="contained"
        disabled={isNextBtnDisabled}
      >
        Next
      </Button>
    </>
  )
}