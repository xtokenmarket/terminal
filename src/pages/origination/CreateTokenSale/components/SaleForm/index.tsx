import React from 'react'
import {
  Description,
  InfoText,
  EPricingFormula,
  ETokenSalePhase,
  EPeriods,
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
import { InputDescription } from '../InputDescription'
import { Input } from '../Input'
import { Radio } from '../Radio'
import { QuestionTooltip } from '../QuestionTooltip'
import { Selector } from '../Selector'
import clsx from 'clsx'
import { IToken, PeriodUnit, SaleData } from 'types'
import { HOURS_IN_4_WEEKS } from 'config/constants'
import { NextStepButton } from '../NextStepButton'

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
    marginTop: 70,
  },
  sectionDisabled: {
    opacity: 0.5,
    pointerEvents: 'none',
    userSelect: 'none',
  },
  pricingFormula: {
    marginBottom: 52,
  },
  warning: {
    display: 'flex',
    width: '100%',
    color: theme.colors.warn2,
    fontSize: '14px',
    marginTop: '10px',
  },
  inverseMarkedText: {
    color: theme.colors.white,
    fontSize: 12,
    marginTop: 15,
  },
}))

interface IProps {
  tokenSalePhase: ETokenSalePhase
  purchaseToken?: IToken
  offerToken?: IToken
  saleData: SaleData
  updateSaleData: (_: Partial<SaleData>) => void
  onSubmit: () => void
  submitDisabled: boolean
  onBack: () => void
}

export const SaleForm = ({
  tokenSalePhase,
  purchaseToken,
  offerToken,
  saleData,
  updateSaleData,
  onSubmit,
  submitDisabled,
  onBack,
}: IProps) => {
  const classes = useStyles()
  const {
    pricingFormula,
    startingPrice,
    endingPrice,
    offeringPeriod,
    offeringPeriodUnit,
    enabled,
  } = saleData

  const saleDisplayName =
    tokenSalePhase === ETokenSalePhase.Whitelist ? 'Allowlist' : 'Public Sale'
  const handlePricingFormulaChange = (
    newPricingFormula: EPricingFormula[keyof EPricingFormula]
  ) => {
    if (newPricingFormula === pricingFormula) {
      return
    }

    if (newPricingFormula === EPricingFormula.Standard) {
      updateSaleData({
        startingPrice: '',
        endingPrice: '',
        pricingFormula: newPricingFormula,
      })
    } else {
      updateSaleData({ pricingFormula: newPricingFormula as EPricingFormula })
    }
  }

  const isShowOfferingPeriodError =
    (Number(offeringPeriod) > 4 && offeringPeriodUnit === EPeriods.Weeks) ||
    (Number(offeringPeriod) > 28 && offeringPeriodUnit === EPeriods.Days) ||
    (Number(offeringPeriod) > HOURS_IN_4_WEEKS &&
      offeringPeriodUnit === EPeriods.Hours) ||
    (Number(offeringPeriod) > HOURS_IN_4_WEEKS * 60 &&
      offeringPeriodUnit === EPeriods.Minutes)

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={6}>
          <FormControl component="fieldset">
            <div className={clsx(classes.label, classes.labelWarpper)}>
              {`Will your offering have ${
                saleDisplayName === 'Allowlist' ? 'an' : 'a'
              } ${saleDisplayName.toLowerCase()} period?`}
            </div>
            <RadioGroup
              id={`isSet${tokenSalePhase}`}
              name="sale-period"
              value={enabled?.toString()}
              onChange={(event) =>
                updateSaleData({
                  enabled: event.target.value === 'true',
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
              !enabled && classes.sectionDisabled
            )}
          >
            <div className={classes.labelWarpper}>
              <Typography className={classes.label}>
                {`${saleDisplayName} offering period`}
              </Typography>
              <QuestionTooltip
                title={InfoText.OfferingPeriod}
                className={classes.tooltipQuestion}
              />
            </div>

            <Selector
              id="offeringPeriod"
              saleDisplayName={saleDisplayName}
              onSelectorChange={(e) =>
                updateSaleData({
                  offeringPeriodUnit: e.target.value as PeriodUnit,
                })
              }
              selectorValue={`${offeringPeriodUnit}`}
              inputValue={`${offeringPeriod}`}
              onChangeinput={(e) => {
                const newValue = parseInt(e.target.value)
                updateSaleData({ offeringPeriod: newValue.toString() })
              }}
            />
            {isShowOfferingPeriodError && (
              <div className={classes.warning}>
                Offering period must be less than or equal to 4 weeks
              </div>
            )}
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          className={clsx(!enabled && classes.sectionDisabled)}
        >
          <Radio
            id="formula"
            label="Choose the pricing formula for this offering"
            infoText={Object.values([
              InfoText.Standard,
              InfoText.Ascending,
              InfoText.Descending,
            ])}
            items={Object.values(EPricingFormula)}
            selectedItem={pricingFormula}
            onChange={handlePricingFormulaChange}
            className={classes.pricingFormula}
          />
          {pricingFormula && (
            <>
              {pricingFormula === EPricingFormula.Standard ? (
                <div className={classes.inputContainer}>
                  <Input
                    id="standardPrice"
                    label={`Price per token - ${purchaseToken?.symbol} per 1 ${offerToken?.symbol}`}
                    value={startingPrice}
                    onChange={(event) => {
                      const price = event.target.value
                      updateSaleData({
                        startingPrice: price,
                        endingPrice: price,
                      })
                    }}
                  />
                  {Number(startingPrice) > 0 && (
                    <div className={classes.inverseMarkedText}>
                      {' '}
                      1 {purchaseToken?.symbol} per {1 / Number(startingPrice)}{' '}
                      {offerToken?.symbol}{' '}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className={classes.inputContainer}>
                    <Input
                      id="startingPrice"
                      label={`Starting Price - ${purchaseToken?.symbol} per ${offerToken?.symbol}`}
                      value={startingPrice}
                      onChange={(event) =>
                        updateSaleData({
                          startingPrice: event.target.value,
                        })
                      }
                    />
                    <InputDescription className={classes.inputDescription}>
                      {Description.StartingPrice}
                    </InputDescription>
                  </div>
                  <div className={classes.inputContainer}>
                    <Input
                      id="endingPrice"
                      label={`Ending Price - ${purchaseToken?.symbol} per ${offerToken?.symbol}`}
                      value={endingPrice}
                      onChange={(event) =>
                        updateSaleData({ endingPrice: event.target.value })
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

      <NextStepButton
        id={
          tokenSalePhase === ETokenSalePhase.Whitelist
            ? 'whitelistSaleBtn'
            : 'publicSaleBtn'
        }
        onNextClick={onSubmit}
        onBackClick={onBack}
        disabled={submitDisabled || isShowOfferingPeriodError}
      />
    </>
  )
}
