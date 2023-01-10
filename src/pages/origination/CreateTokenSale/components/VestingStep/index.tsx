import { useEffect } from 'react'
import { makeStyles, Grid, Typography } from '@material-ui/core'
import { ICreateTokenSaleData, PeriodUnit } from 'types'
import { EPeriods, EVestingOption, InfoText } from 'utils/enums'
import { getDurationSec } from 'utils'

import { InfoPanel } from './InfoPanel'
import { NextStepButton } from '../NextStepButton'
import { Radio } from '../Radio'
import { Selector } from '../Selector'

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
  nextButton: {
    marginTop: 'auto',
  },
  warning: {
    color: theme.colors.warn2,
    fontSize: 14,
    marginTop: 10,
  },
}))

interface IProps {
  data: ICreateTokenSaleData
  updateData: (_: any) => void
  onNext: () => void
  onBack: () => void
}

export const VestingStep: React.FC<IProps> = ({
  data,
  updateData,
  onNext,
  onBack,
}) => {
  const classes = useStyles()
  const vestingWanted = data.vestingEnabled === EVestingOption.Yes
  const { vestingPeriod, vestingPeriodUnit, cliffPeriod, cliffPeriodUnit } =
    data

  useEffect(() => {
    if (!data.vestingEnabled) {
      // clear previously inserted data if the user selects 'No' option
      updateData({
        vestingPeriod: '',
        vestingPeriodUnit: EPeriods.Weeks,
        cliffPeriod: '',
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
    const cliffPeriodSec = getDurationSec(
      cliffPeriod,
      cliffPeriodUnit as string
    )
    const vestingPeriodSec = getDurationSec(
      vestingPeriod,
      vestingPeriodUnit as string
    )

    return vestingPeriod > 0 && !cliffPeriodSec.gt(vestingPeriodSec)
  }

  const validVestingDataInserted =
    vestingPeriod &&
    vestingPeriodUnit &&
    cliffPeriod &&
    cliffPeriodUnit &&
    validInsertedVestingConfig(
      Number(vestingPeriod),
      vestingPeriodUnit,
      Number(cliffPeriod),
      cliffPeriodUnit
    )

  const isVestingZero = data.vestingPeriod && Number(data.vestingPeriod) === 0

  const onChangeInput = (e: any, type: string) => {
    const value = e.target.value ? parseInt(e.target.value) : ''
    updateData({ [type]: value.toString() })
  }

  return (
    <>
      <Grid item xs={12} md={5} className={classes.formContainer}>
        <Grid item xs={12}>
          <Typography className={classes.label}>
            Do you want to add a vesting period to your token offering?
          </Typography>
          <Radio
            id={'isSetVesting'}
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
            id="vestingPeriod"
            onSelectorChange={(e) =>
              updateData({ vestingPeriodUnit: e.target.value })
            }
            selectorValue={`${data.vestingPeriodUnit}`}
            label="Vesting Period"
            infoText={InfoText.VestingPeriod}
            inputValue={`${data.vestingPeriod}`}
            onChangeInput={(e) => onChangeInput(e, 'vestingPeriod')}
            disabled={!vestingWanted}
          />
          {isVestingZero && (
            <div className={classes.warning}>
              Vesting period input cannot be zero
            </div>
          )}
        </Grid>
        <Grid item xs={12}>
          <Selector
            id="cliffPeriod"
            onSelectorChange={(e) =>
              updateData({ cliffPeriodUnit: e.target.value })
            }
            selectorValue={`${data.cliffPeriodUnit}`}
            label="Cliff Period"
            infoText={InfoText.CliffPeriod}
            inputValue={`${data.cliffPeriod}`}
            onChangeInput={(e) => onChangeInput(e, 'cliffPeriod')}
            disabled={!vestingWanted}
          />
        </Grid>
        {vestingWanted && (
          <InfoPanel
            className={classes.infoPanel}
            description="Cliff period must be less than or equal to vesting"
          />
        )}
      </Grid>
      <NextStepButton
        id="vestingStepBtn"
        onNextClick={onNext}
        onBackClick={onBack}
        disabled={
          !data.vestingEnabled || (vestingWanted && !validVestingDataInserted)
        }
      />
    </>
  )
}
