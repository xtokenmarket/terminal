import { makeStyles, Grid, Typography, Button } from '@material-ui/core'
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
  const classes = useStyles()

  return (
    <>
      <Grid container xs={12} md={5} className={classes.formContainer}>
        <Grid item xs={12}>
          <Typography className={classes.label}>
            Do you want to add a vesting Period to your token sale?
          </Typography>
          <Radio
            items={vestingOptions}
            onChange={(event) => {
              updateData({ pricingFormula: event.target.value })
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.label}>Vestiing Period</Typography>
          <Selector
            onSelectorChange={(e) =>
              updateData({ vestiingPeriod: e.target.value })
            }
            selectorValue={data.vestiingPeriod}
            inputValue={data.vestiingPeriod}
            onChangeinput={(e) => {
              updateData({ vestiingPeriod: e.target.value })
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.label}>Cliff Period</Typography>
          <Selector
            onSelectorChange={(e) =>
              updateData({ cliffPeriod: e.target.value })
            }
            selectorValue={data.cliffPeriod}
            inputValue={data.offeringPeriod}
            onChangeinput={(e) => {
              updateData({ cliffPeriod: e.target.value })
            }}
          />
        </Grid>
        <InfoPanel
          className={classes.infoPanel}
          title={'Fees'}
          description={'Cliff period must be less than or equal to vesting'}
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
