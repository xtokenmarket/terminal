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

type VestingOption = 'Yes' | 'No'

const vestingOptions: VestingOption[] = ['Yes', 'No']

export const VestingStep: React.FC<IProps> = ({ data, updateData, onNext }) => {
  const [vestingSelected, setVestingSelected] = useState(false)
  const classes = useStyles()

  useEffect(() => {
    if (!vestingSelected) {
      updateData({
        vestingPeriod: '',
        cliffPeriod: '',
      })
    }
  }, [vestingSelected])

  const handleVestingOptionChange = (option: VestingOption) => {
    const selectedVestingStatus = option === 'Yes'

    if (selectedVestingStatus !== vestingSelected) {
      setVestingSelected(selectedVestingStatus)
    }
  }

  return (
    <>
      <Grid item xs={12} md={5} className={classes.formContainer}>
        <Grid item xs={12}>
          <Typography className={classes.label}>
            Do you want to add a vesting Period to your token sale?
          </Typography>
          <Radio
            items={vestingOptions}
            onChange={(event) =>
              handleVestingOptionChange(event.target.value as VestingOption)
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Selector
            onSelectorChange={(e) =>
              updateData({ vestingPeriod: e.target.value })
            }
            selectorValue={data.vestingPeriod}
            label="Vesting Period"
            inputValue={data.vestingPeriod}
            onChangeinput={(e) => {
              updateData({ vestingPeriod: e.target.value })
            }}
            disabled={!vestingSelected}
          />
        </Grid>
        <Grid item xs={12}>
          <Selector
            onSelectorChange={(e) =>
              updateData({ cliffPeriod: e.target.value })
            }
            selectorValue={data.cliffPeriod}
            label="Cliff Period"
            inputValue={data.cliffPeriod}
            onChangeinput={(e) => {
              updateData({ cliffPeriod: e.target.value })
            }}
            disabled={!vestingSelected}
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
        disabled={true}
      >
        Next
      </Button>
    </>
  )
}
