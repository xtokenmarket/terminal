import {
  Description,
  InfoText,
  EPricingFormula,
  ETokenSalePhase,
} from 'utils/enums'
import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  makeStyles,
  RadioGroup,
  Typography,
} from '@material-ui/core'
import RadioItem from '@material-ui/core/Radio'
import { ICreateTokenSaleData } from 'types'
import { InputDescription } from '../InputDescription'
import { Input } from '../Input'
import { Radio } from '../Radio'
import { QuestionTooltip } from '../QuestionTooltip'
import { Selector } from '../Selector'

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
  saleTypeToggle: {
    display: 'flex',
  },
  labelWarpper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 18,
  },
  tooltipQuestion: {
    marginLeft: 10,
  },
}))

interface IProps {
  tokenSalePhase: ETokenSalePhase
  data: ICreateTokenSaleData
  updateData: (_: any) => void
  onNext: () => void
}

export const PublicSaleForm: React.FC<IProps> = ({
  tokenSalePhase,
  data,
  updateData,
  onNext,
}) => {
  const classes = useStyles()
  const salePhaseEnabled =
    tokenSalePhase === ETokenSalePhase.Whitelist
      ? data.whitelistSaleEnabled
      : data.publicSaleEnabled

  const validPricingDetailsSet = () => {
    switch (data.pricingFormula) {
      case EPricingFormula.Ascending:
        return Number(data.publicStartingPrice) < Number(data.publicEndingPrice)
      case EPricingFormula.Descending:
        return Number(data.publicStartingPrice) > Number(data.publicEndingPrice)
      case EPricingFormula.Standard:
        return (
          Number(data.publicStartingPrice) === Number(data.publicEndingPrice)
        )
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
        publicStartingPrice: '',
        publicEndingPrice: '',
        pricingFormula: newPricingFormula,
      })
    } else {
      updateData({ pricingFormula: newPricingFormula })
    }
  }

  const isNextBtnDisabled = !(
    data.pricingFormula &&
    data.publicStartingPrice &&
    data.publicEndingPrice &&
    validPricingDetailsSet()
  )

  const handleSaleEnabledToggle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (tokenSalePhase === ETokenSalePhase.Whitelist) {
      updateData({
        whitelistSaleEnabled: event.target.value,
      })
    } else {
      updateData({
        publicSaleEnabled: event.target.value,
      })
    }
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={6}>
          <FormControl component="fieldset">
            <RadioGroup
              name="sale-period"
              value={salePhaseEnabled}
              onChange={handleSaleEnabledToggle}
            >
              <FormControlLabel
                value="true"
                control={<RadioItem />}
                label="Yes"
              />
              <FormControlLabel
                value="false"
                control={<RadioItem />}
                label="No"
              />
            </RadioGroup>
          </FormControl>
          <>
            <div className={classes.labelWarpper}>
              <Typography className={classes.label}>Offering Period</Typography>
              <QuestionTooltip
                title={InfoText.OfferingPeriod}
                className={classes.tooltipQuestion}
              />
            </div>

            <Selector
              onSelectorChange={(e) =>
                updateData({ publicOfferingPeriodUnit: e.target.value })
              }
              selectorValue={`${data.publicOfferingPeriodUnit}`}
              inputValue={`${data.publicOfferingPeriod}`}
              onChangeinput={(e) => {
                updateData({ publicOfferingPeriod: e.target.value })
              }}
            />
          </>
        </Grid>
        <Grid item xs={12} md={6}>
          <Radio
            label="Choose the Pricing formula for this offering"
            infoText={Object.values([
              InfoText.Standard,
              InfoText.Ascending,
              InfoText.Descending,
            ])}
            items={Object.values(EPricingFormula)}
            selectedItem={data.pricingFormula}
            onChange={handlePricingFormulaChange}
          />
          {data.pricingFormula && (
            <>
              {data.pricingFormula === EPricingFormula.Standard ? (
                <div className={classes.inputContainer}>
                  <Input
                    label={`Price per token - ${data.purchaseToken?.symbol} per ${data.offerToken?.symbol}`}
                    value={data.publicStartingPrice}
                    onChange={(event) => {
                      const price = event.target.value
                      updateData({
                        publicStartingPrice: price,
                        publicEndingPrice: price,
                      })
                    }}
                  />
                </div>
              ) : (
                <>
                  <div className={classes.inputContainer}>
                    <Input
                      label={`Starting Price - ${data.purchaseToken?.symbol} per ${data.offerToken?.symbol}`}
                      value={data.publicStartingPrice}
                      onChange={(event) =>
                        updateData({
                          publicStartingPrice: event.target.value,
                        })
                      }
                    />
                    <InputDescription className={classes.inputDescription}>
                      {Description.StartingPrice}
                    </InputDescription>
                  </div>
                  <div className={classes.inputContainer}>
                    <Input
                      label={`Ending Price - ${data.purchaseToken?.symbol} per ${data.offerToken?.symbol}`}
                      value={data.publicEndingPrice}
                      onChange={(event) =>
                        updateData({ publicEndingPrice: event.target.value })
                      }
                    />
                    <InputDescription className={classes.inputDescription}>
                      {Description.EndingPrice}
                    </InputDescription>
                  </div>
                </>
              )}
            </>
          )}
        </Grid>
      </Grid>

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
