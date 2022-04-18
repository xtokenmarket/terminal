import { useEffect } from 'react'
import moment, { unitOfTime } from 'moment'
import { makeStyles, Grid, Typography, Button } from '@material-ui/core'
import { ICreateTokenSaleData, PeriodUnit } from 'types'
import { EPeriods, EVestingOption } from 'utils/enums'
import { Radio } from '../Radio'
import { Selector } from '../Selector'
import { InfoPanel } from './InfoPanel'

const useStyles = makeStyles((theme) => ({
  formContainer: {
    '&>:not(:last-child)': { marginBottom: 50 },
    marginBottom: 56,
  },
  label: {
    color: theme.colors.white,
    fontSize: 14,
    lineHeight: '16.8px',
    marginBottom: theme.spacing(2),
  },
  infoPanel: {
    marginTop: 56,
  },
}))

interface IProps {
  data: ICreateTokenSaleData
  updateData: (_: any) => void
  onNext: () => void
}

export const VestingStep: React.FC<IProps> = ({ data, updateData, onNext }) => {
  const classes = useStyles()
  const vestingWanted = data.vestingEnabled === EVestingOption.Yes
  const { vestingPeriod, vestingPeriodUnit, cliffPeriod, cliffPeriodUnit } =
    data

  useEffect(() => {
    if (!data.vestingEnabled) {
      // clear previously inserted data if the user selects 'No' option
      updateData({
        vestingPeriod: 0,
        vestingPeriodUnit: EPeriods.Weeks,
        cliffPeriod: 0,
        cliffPeriodUnit: EPeriods.Weeks,
      })
    }
  }, [data.vestingEnabled])

  const validInsertedVestingConfig = (
    vestingPeriod: number,
    vestingPeriodUnit: PeriodUnit,
    cliffPeriod: number,
    cliffPeriodUnit: PeriodUnit
  ) => {
    const vestingEndDate = moment().add(
      vestingPeriod,
      `${vestingPeriodUnit}`.toLowerCase() as unitOfTime.DurationConstructor
    )
    const cliffPeriodEndDate = moment().add(
      cliffPeriod,
      `${cliffPeriodUnit}`.toLowerCase() as unitOfTime.DurationConstructor
    )

    return (
      vestingPeriod > 0 && cliffPeriodEndDate.isSameOrBefore(vestingEndDate)
    )
  }

  const validVestingDataInserted =
    vestingPeriod &&
    vestingPeriodUnit &&
    cliffPeriod &&
    cliffPeriodUnit &&
    validInsertedVestingConfig(
      vestingPeriod,
      vestingPeriodUnit,
      cliffPeriod,
      cliffPeriodUnit
    )

  return (
    <>
      <Grid item xs={12} md={5} className={classes.formContainer}>
        <Grid item xs={12}>
          <Typography className={classes.label}>
            Do you want to add a vesting Period to your token sale?
          </Typography>
          <Radio
            items={Object.values(EVestingOption)}
            selectedItem={data.vestingEnabled ? `${data.vestingEnabled}` : ''}
            onChange={(value) =>
              updateData({
                vestingEnabled: value,
              })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Selector
            onSelectorChange={(e) =>
              updateData({ vestingPeriodUnit: e.target.value })
            }
            selectorValue={`${data.vestingPeriodUnit}`}
            label="Vesting Period"
            // TODO: add a non-placeholder text
            infoText="Placeholder text"
            inputValue={`${data.vestingPeriod}`}
            onChangeinput={(e) => {
              updateData({ vestingPeriod: e.target.value })
            }}
            disabled={!vestingWanted}
          />
        </Grid>
        <Grid item xs={12}>
          <Selector
            onSelectorChange={(e) =>
              updateData({ cliffPeriodUnit: e.target.value })
            }
            selectorValue={`${data.cliffPeriodUnit}`}
            label="Cliff Period"
            inputValue={`${data.cliffPeriod}`}
            onChangeinput={(e) => {
              updateData({ cliffPeriod: e.target.value })
            }}
            disabled={!vestingWanted}
          />
        </Grid>
        <InfoPanel
          className={classes.infoPanel}
          title="Fees"
          description="Cliff period must be less than or equal to vesting"
        />
      </Grid>

      <Button
        color="primary"
        fullWidth
        onClick={onNext}
        variant="contained"
        disabled={vestingWanted ? !validVestingDataInserted : false}
      >
        Next
      </Button>
    </>
  )
}
