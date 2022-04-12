import { Button, Grid, makeStyles, Typography } from '@material-ui/core'
import { TokenSelect } from 'components'
import { ICreateTokenSaleData } from 'types'
import { Input } from '../Input'
import { Selector } from '../Selector'

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.colors.white,
    marginBottom: 18,
    fontFamily: 'Gilmer',
    fontWeight: 700,
    fontSize: 14,
  },
}))

interface IProps {
  data: ICreateTokenSaleData
  updateData: (_: any) => void
  onNext: () => void
}

export const OfferingStep: React.FC<IProps> = ({
  data,
  updateData,
  onNext,
}) => {
  const classes = useStyles()

  const onClickNext = () => {
    onNext()
  }

  const isNextBtnDisabled = !(
    data.offerToken &&
    data.purchaseToken &&
    data.offerTokenAmount &&
    data.reserveOfferTokenAmount &&
    data.offeringPeriod &&
    data.offeringPeriodUnit
  )

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography className={classes.label}>Offer Token</Typography>
          <TokenSelect
            token={data.offerToken}
            onChange={(offerToken) => updateData({ offerToken })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography className={classes.label}>Purchase Token</Typography>
          <TokenSelect
            token={data.purchaseToken}
            onChange={(purchaseToken) => updateData({ purchaseToken })}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} direction="column">
        <Grid item xs={12} md={6}>
          <Input
            label="Offer Token Amount"
            value={data.offerTokenAmount}
            onChange={(e) => updateData({ offerTokenAmount: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            label={'Reserve Offer Token Amount'}
            value={data.reserveOfferTokenAmount}
            onChange={(e) =>
              updateData({ reserveOfferTokenAmount: e.target.value })
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography className={classes.label}>Offering Period</Typography>

          <Selector
            onSelectorChange={(e) =>
              updateData({ offeringPeriodUnit: e.target.value })
            }
            selectorValue={data.offeringPeriodUnit}
            inputValue={data.offeringPeriod}
            onChangeinput={(e) => {
              updateData({ offeringPeriod: e.target.value })
            }}
          />
        </Grid>
      </Grid>

      <Button
        color="primary"
        fullWidth
        onClick={onClickNext}
        variant="contained"
        disabled={isNextBtnDisabled}
      >
        Next
      </Button>
    </>
  )
}