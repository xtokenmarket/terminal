import { Button, Grid, makeStyles } from '@material-ui/core'
import { ICreateTokenSaleData } from 'types'
import { InputDescription } from '../InputDescription'
import { Description, InfoText, EPricingFormula } from 'utils/enums'
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

  const validPricingDetailsSet = () => {
    switch (data.pricingFormula) {
      case EPricingFormula.Ascending:
        return Number(data.startingPrice) < Number(data.endingPrice)
      case EPricingFormula.Descending:
        return Number(data.startingPrice) > Number(data.endingPrice)
      case EPricingFormula.Standard:
        return Number(data.startingPrice) === Number(data.endingPrice)
      default:
        return false
    }
  }

  const handlePricingFormulaChange = (
    newPricingFormula: EPricingFormula[keyof EPricingFormula]
  ) => {
    if (
      data.pricingFormula !== newPricingFormula &&
      newPricingFormula === EPricingFormula.Standard
    ) {
      const price = data.startingPrice ? data.startingPrice : data.endingPrice

      return updateData({
        pricingFormula: newPricingFormula,
        startingPrice: price,
        endingPrice: price,
      })
    }

    updateData({ pricingFormula: newPricingFormula })
  }

  const handleStartingPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const startingPriceValue = e.target.value

    if (data.pricingFormula === EPricingFormula.Standard) {
      return updateData({
        startingPrice: startingPriceValue,
        endingPrice: startingPriceValue,
      })
    }
    updateData({ startingPrice: startingPriceValue })
  }

  const handleEndingPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const endingPriceValue = e.target.value

    if (data.pricingFormula === EPricingFormula.Standard) {
      return updateData({
        startingPrice: endingPriceValue,
        endingPrice: endingPriceValue,
      })
    }

    updateData({ endingPrice: endingPriceValue })
  }

  const isNextBtnDisabled = !(
    data.pricingFormula &&
    data.startingPrice &&
    data.endingPrice &&
    validPricingDetailsSet()
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
        items={Object.values(EPricingFormula)}
        selectedItem={data.pricingFormula}
        onChange={handlePricingFormulaChange}
      />
      <Grid container>
        <Grid item xs={12} md={6}>
          <div className={classes.inputContainer}>
            <Input
              label={`Starting Price - ${data.purchaseToken?.symbol} per ${data.offerToken?.symbol}`}
              value={data.startingPrice}
              onChange={handleStartingPriceChange}
            />

            <InputDescription className={classes.inputDescription}>
              {Description.StartingPrice}
            </InputDescription>
          </div>
          <div className={classes.inputContainer}>
            <Input
              label={`Ending Price - ${data.purchaseToken?.symbol} per ${data.offerToken?.symbol}`}
              value={data.endingPrice}
              onChange={handleEndingPriceChange}
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
