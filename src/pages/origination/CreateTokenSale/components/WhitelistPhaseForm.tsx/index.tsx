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
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.colors.white,
    fontSize: 14,
  },
  radio: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(7),
  },
  radioItem: {
    '&.MuiRadio-root': {
      color: theme.colors.white,
      padding: 0,
      paddingLeft: 6,
      paddingRight: 6,
    },
  },
  formControlItem: {
    color: theme.colors.white,
    marginBottom: theme.spacing(2),
    fontSize: 14,
  },
  inputDescription: {
    marginTop: theme.spacing(1),
  },
  inputContainer: {
    marginBottom: 40,
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
    marginBottom: theme.spacing(2),
  },
  tooltipQuestion: {
    marginLeft: 10,
  },
  offeringPeriod: {
    marginTop: 82,
  },
  sectionDisabled: {
    opacity: 0.5,
    pointerEvents: 'none',
    userSelect: 'none',
  },
  pricingFormula: {
    marginBottom: 40,
  },
}))

interface IProps {
  tokenSalePhase: ETokenSalePhase
  data: ICreateTokenSaleData
  updateData: (_: any) => void
  onNext: () => void
}

export const WhitelistPhaseForm: React.FC<IProps> = ({
  tokenSalePhase,
  data,
  updateData,
  onNext,
}) => {
  const classes = useStyles()
  const { whitelistSaleEnabled } = data

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

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={6}>
          <FormControl component="fieldset">
            <div className={clsx(classes.label, classes.labelWarpper)}>
              Will your Offering have a whitelist period?
            </div>
            <RadioGroup
              name="sale-period"
              value={data.whitelistSaleEnabled?.toString()}
              onChange={(event) =>
                updateData({
                  whitelistSaleEnabled: event.target.value === 'true',
                })
              }
            >
              <FormControlLabel
                className={classes.formControlItem}
                value="true"
                control={<RadioItem className={classes.radioItem} />}
                label="Yes"
              />
              <FormControlLabel
                className={classes.formControlItem}
                value="false"
                control={<RadioItem className={classes.radioItem} />}
                label="No"
              />
            </RadioGroup>
          </FormControl>
          <Grid
            item
            xs={12}
            md={7}
            className={clsx(
              classes.offeringPeriod,
              !whitelistSaleEnabled && classes.sectionDisabled
            )}
          >
            <div className={classes.labelWarpper}>
              <Typography className={classes.label}>
                Whitelist sale offering period
              </Typography>
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
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          className={clsx(!whitelistSaleEnabled && classes.sectionDisabled)}
        >
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
            className={classes.pricingFormula}
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
