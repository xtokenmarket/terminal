import clsx from 'clsx'
import React from 'react'
import {
  Description,
  EPricingFormula,
  ETokenSalePhase,
  InfoText,
  EOfferingPeriods,
} from 'utils/enums'
import {
  FormControl,
  FormControlLabel,
  Grid,
  makeStyles,
  RadioGroup,
  Typography,
} from '@material-ui/core'
import RadioItem from '@material-ui/core/Radio'
import { IToken, PeriodUnit, SaleData } from 'types'

import { Input } from '../Input'
import { InputDescription } from '../InputDescription'
import { NextStepButton } from '../NextStepButton'
import { QuestionTooltip } from '../QuestionTooltip'
import { Radio } from '../Radio'
import { Selector } from '../Selector'

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
    '& + &': {
      marginTop: 20,
    },
  },
  nextButton: {
    marginTop: 'auto',
  },
  saleTypeToggle: {
    display: 'flex',
  },
  labelWrapper: {
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
  offerWarning: {
    display: 'flex',
    width: '100%',
    color: theme.colors.warn2,
    fontSize: '14px',
    marginTop: '10px',
  },
  priceWarning: {
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
  error?: string
  offerToken?: IToken
  onBack: () => void
  onSubmit: () => void
  purchaseToken?: IToken
  saleData: SaleData
  submitDisabled: boolean
  tokenSalePhase: ETokenSalePhase
  updateSaleData: (_: Partial<SaleData>) => void
}

export const SaleForm = ({
  error,
  offerToken,
  onBack,
  onSubmit,
  purchaseToken,
  saleData,
  submitDisabled,
  tokenSalePhase,
  updateSaleData,
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

  const isOfferingPeriodInvalid =
    (offeringPeriod && Number(offeringPeriod) === 0) ||
    (Number(offeringPeriod) > 1 &&
      offeringPeriodUnit === EOfferingPeriods.Year) ||
    (Number(offeringPeriod) > 12 &&
      offeringPeriodUnit === EOfferingPeriods.Month) ||
    (Number(offeringPeriod) > 52 &&
      offeringPeriodUnit === EOfferingPeriods.Weeks) ||
    (Number(offeringPeriod) > 365 &&
      offeringPeriodUnit === EOfferingPeriods.Days) ||
    // TODO: Remove for production
    (Number(offeringPeriod) > 8760 &&
      offeringPeriodUnit === EOfferingPeriods.Hours) ||
    (Number(offeringPeriod) > 525600 &&
      offeringPeriodUnit === EOfferingPeriods.Minutes)

  let invalidPricingError = ''
  if (pricingFormula) {
    if (startingPrice && Number(startingPrice) === 0) {
      invalidPricingError = 'Starting price must be greater than zero'
    } else if (pricingFormula !== EPricingFormula.Standard) {
      if (endingPrice && Number(endingPrice) === 0) {
        invalidPricingError = 'Ending price must be greater than zero'
      } else if (
        pricingFormula === EPricingFormula.Ascending &&
        Number(startingPrice) > Number(endingPrice)
      ) {
        invalidPricingError = 'Starting price must be less than ending price'
      } else if (
        pricingFormula === EPricingFormula.Descending &&
        Number(startingPrice) < Number(endingPrice)
      ) {
        invalidPricingError = 'Starting price must be greater than ending price'
      }
    }
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={6}>
          <FormControl component="fieldset">
            <div className={clsx(classes.label, classes.labelWrapper)}>
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
            <div className={classes.labelWrapper}>
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
              onChangeInput={(e) => {
                const newValue = parseInt(e.target.value)
                updateSaleData({ offeringPeriod: newValue.toString() })
              }}
            />
            {isOfferingPeriodInvalid && (
              <div className={classes.offerWarning}>
                Invalid offering period
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
                  {invalidPricingError && (
                    <div className={classes.priceWarning}>
                      {invalidPricingError}
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
                  {invalidPricingError && (
                    <div className={classes.priceWarning}>
                      {invalidPricingError}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </Grid>
      </Grid>

      <NextStepButton
        disabled={submitDisabled || isOfferingPeriodInvalid}
        error={error}
        id={
          tokenSalePhase === ETokenSalePhase.Whitelist
            ? 'whitelistSaleBtn'
            : 'publicSaleBtn'
        }
        onNextClick={onSubmit}
        onBackClick={onBack}
      />
    </>
  )
}
