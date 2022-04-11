import { makeStyles, Grid, Typography, Button } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { ICreateTokenSaleData } from 'types'
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

enum EVestingOpton {
  Yes = 'Yes',
  No = 'No',
}

type VestingOption = EVestingOpton[keyof EVestingOpton]

export const VestingStep: React.FC<IProps> = ({ data, updateData, onNext }) => {
  const [selectedVestingOption, setselectedVestingOption] = useState<
    VestingOption | undefined
  >()
  const classes = useStyles()

  const vestingWanted = selectedVestingOption === EVestingOpton.Yes

  useEffect(() => {
    if (!vestingWanted) {
      // clear previously inserted data if the user selects 'No' option
      updateData({
        vestingPeriod: '',
        vestingPeriodUnit: '',
        cliffPeriod: '',
        cliffPeriodUnit: '',
      })
    }
  }, [vestingWanted])

  const validVestingDataInserted = !(
    data.vestingPeriod &&
    data.vestingPeriodUnit &&
    data.cliffPeriod &&
    data.cliffPeriodUnit
  )

  const handleVestingOptionChange = (option: VestingOption) =>
    selectedVestingOption !== option && setselectedVestingOption(option)

  return (
    <>
      <Grid item xs={12} md={5} className={classes.formContainer}>
        <Grid item xs={12}>
          <Typography className={classes.label}>
            Do you want to add a vesting Period to your token sale?
          </Typography>
          <Radio
            items={Object.values(EVestingOpton)}
            onChange={(event) =>
              handleVestingOptionChange(event.target.value as VestingOption)
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Selector
            onSelectorChange={(e) =>
              updateData({ vestingPeriodUnit: e.target.value })
            }
            selectorValue={data.vestingPeriodUnit}
            label="Vesting Period"
            inputValue={data.vestingPeriod}
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
            selectorValue={data.cliffPeriodUnit}
            label="Cliff Period"
            inputValue={data.cliffPeriod}
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
        disabled={
          vestingWanted ? validVestingDataInserted : !selectedVestingOption
        }
      >
        Next
      </Button>
    </>
  )
}
