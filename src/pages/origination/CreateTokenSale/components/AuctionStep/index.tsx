import { Button, Grid, makeStyles } from '@material-ui/core'
import { ICreateTokenSaleData } from 'types'
import { InputDescription } from '../InputDescription'
import { Description, InfoText, IpricingFormula } from 'utils/enums'
import { Input } from '../Input'
import { Radio } from '../Radio'

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.colors.white,
    marginBottom: theme.spacing(2),
  },
  radio: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(7),
  },
  inputDescription: {
    marginTop: theme.spacing(1),
  },
  inputContainer: {
    marginBottom: 61,
  },
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

  return (
    <>
      <Radio
        label="Choose the Pricing formula for this offering"
        infoText={Object.values([
          InfoText.Standard,
          InfoText.Ascending,
          InfoText.Descending,
        ])}
        className={classes.radio}
        items={Object.values(IpricingFormula)}
        selectedItem={data.pricingFormula}
        onChange={(value) => updateData({ pricingFormula: value })}
      />
      <Grid container>
        <Grid item xs={12} md={6}>
          <div className={classes.inputContainer}>
            <Input
              label={`Starting Price - ${data.purchaseToken?.symbol} per ${data.offerToken?.symbol}`}
              value={data.startingPrice}
              onChange={(e) => updateData({ startingPrice: e.target.value })}
            />

            <InputDescription className={classes.inputDescription}>
              {Description.StartingPrice}
            </InputDescription>
          </div>
          <div className={classes.inputContainer}>
            <Input
              label={`Ending Price - ${data.purchaseToken?.symbol} per ${data.offerToken?.symbol}`}
              value={data.endingPrice}
              onChange={(e) => updateData({ endingPrice: e.target.value })}
            />
            <InputDescription className={classes.inputDescription}>
              {Description.EndingPrice}
            </InputDescription>
          </div>
        </Grid>
      </Grid>

      <Button
        color="primary"
        fullWidth
        onClick={onNext}
        variant="contained"
        disabled={isNextBtnDisabled}
      >
        Next
      </Button>
    </>
  )
}
