import { Button, Grid, makeStyles, Typography } from '@material-ui/core'
import { TokenSelect } from 'components'
import { ICreateTokenSaleData } from 'types'
import { Description, InfoText } from 'utils/enums'
import { Input } from '../Input'
import { QuestionTooltip } from '../QuestionTooltip'
import { Selector } from '../Selector'

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.colors.white,
    fontFamily: 'Gilmer',
    fontWeight: 700,
    fontSize: 14,
  },
  tooltipQuestion: {
    marginLeft: 10,
  },
  labelWarpper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 18,
  },
  button: {
    marginTop: 20,
  },
  description: {
    color: theme.colors.primary100,
    fontSize: 12,
    marginTop: 5,
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
          <div className={classes.labelWarpper}>
            <Typography className={classes.label}>Offer Token</Typography>
            <QuestionTooltip
              title={InfoText.OfferToken}
              className={classes.tooltipQuestion}
            />
          </div>
          <TokenSelect
            token={data.offerToken}
            onChange={(offerToken) => updateData({ offerToken })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.labelWarpper}>
            <Typography className={classes.label}>Purchase Token</Typography>
            <QuestionTooltip
              title={InfoText.PurchaseToken}
              className={classes.tooltipQuestion}
            />
          </div>
          <TokenSelect
            token={data.purchaseToken}
            onChange={(purchaseToken) => updateData({ purchaseToken })}
          />
          <Typography className={classes.description}>
            {Description.PurchaseToken}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3} direction="column">
        <Grid item xs={12} md={6}>
          <Input
            label="Offer Token Amount"
            value={data.offerTokenAmount}
            onChange={(e) => updateData({ offerTokenAmount: e.target.value })}
            infoText={InfoText.OfferTokenAmount}
          />
          <Typography className={classes.description}>
            {Description.OfferTokenAmount}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            label={'Reserve Offer Token Amount'}
            value={data.reserveOfferTokenAmount}
            onChange={(e) =>
              updateData({ reserveOfferTokenAmount: e.target.value })
            }
            infoText={InfoText.ReserveOfferTokenAmount}
          />
          <Typography className={classes.description}>
            {Description.ReserveOfferTokenAmount}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <div className={classes.labelWarpper}>
            <Typography className={classes.label}>Offering Period</Typography>
            <QuestionTooltip
              title={InfoText.OfferingPeriod}
              className={classes.tooltipQuestion}
            />
          </div>

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
        className={classes.button}
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
