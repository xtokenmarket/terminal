import { Description, InfoText, EPricingFormula } from 'utils/enums'
import { Button, Grid, makeStyles } from '@material-ui/core'
import { ICreateTokenSaleData } from 'types'
import { InputDescription } from '../InputDescription'
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
  nextButton: {
    marginTop: 'auto',
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
    if (newPricingFormula === data.pricingFormula) {
      return
    }

    if (newPricingFormula === EPricingFormula.Standard) {
      updateData({
        startingPrice: '',
        endingPrice: '',
        pricingFormula: newPricingFormula,
      })
    } else {
      updateData({ pricingFormula: newPricingFormula })
    }
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
      {data.pricingFormula && (
        <Grid container>
          <Grid item xs={12} md={6}>
            {data.pricingFormula === EPricingFormula.Standard ? (
              <div className={classes.inputContainer}>
                <Input
                  label={`Price per token - ${data.purchaseToken?.symbol} per ${data.offerToken?.symbol}`}
                  value={data.startingPrice}
                  onChange={(event) => {
                    const price = event.target.value
                    updateData({ startingPrice: price, endingPrice: price })
                  }}
                />
              </div>
            ) : (
              <>
                <div className={classes.inputContainer}>
                  <Input
                    label={`Starting Price - ${data.purchaseToken?.symbol} per ${data.offerToken?.symbol}`}
                    value={data.startingPrice}
                    onChange={(event) =>
                      updateData({ startingPrice: event.target.value })
                    }
                  />
                  <InputDescription className={classes.inputDescription}>
                    {Description.StartingPrice}
                  </InputDescription>
                </div>
                <div className={classes.inputContainer}>
                  <Input
                    label={`Ending Price - ${data.purchaseToken?.symbol} per ${data.offerToken?.symbol}`}
                    value={data.endingPrice}
                    onChange={(event) =>
                      updateData({ endingPrice: event.target.value })
                    }
                  />
                  <InputDescription className={classes.inputDescription}>
                    {Description.EndingPrice}
                  </InputDescription>
                </div>
              </>
            )}
          </Grid>
        </Grid>
      )}

      <Button
        className={classes.nextButton}
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
