import { Button, Grid, makeStyles, Typography } from '@material-ui/core'
import { TokenSelect } from 'components'
import { DetailedTokenSelect } from 'components/Modal/RewardModal/components/DetailedTokenSelect'
import { ICreateTokenSaleData } from 'types'
import { Description, InfoText } from 'utils/enums'
import { Input } from '../Input'
import { InputDescription } from '../InputDescription'
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
  description: {
    marginTop: theme.spacing(1),
  },
  selectInputsContainer: {
    [theme.breakpoints.up('md')]: {
      '&>:not(:last-child)': {
        paddingRight: theme.spacing(4),
      },
    },
  },
  tokenInputsContainer: {
    paddingBottom: theme.spacing(7),
    '&>:not(:last-child)': {
      marginBottom: 22,
    },
    [theme.breakpoints.up('md')]: {
      '& > *': {
        paddingRight: theme.spacing(4),
      },
    },
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
      <Grid container className={classes.selectInputsContainer}>
        <Grid item xs={12} md={6}>
          <div className={classes.labelWarpper}>
            <Typography className={classes.label}>Offer Token</Typography>
            <QuestionTooltip
              title={InfoText.OfferToken}
              className={classes.tooltipQuestion}
            />
          </div>
          <DetailedTokenSelect
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
          <DetailedTokenSelect
            token={data.purchaseToken}
            hasPlaceholderTokenIcon={false}
            onChange={(purchaseToken) => updateData({ purchaseToken })}
          />
          <InputDescription underlined={false}>
            {Description.PurchaseToken}
          </InputDescription>
        </Grid>
      </Grid>
      <Grid
        container
        direction="column"
        className={classes.tokenInputsContainer}
      >
        <Grid item xs={12} md={6}>
          <Input
            label="Offer Token Amount"
            value={data.offerTokenAmount}
            onChange={(e) => updateData({ offerTokenAmount: e.target.value })}
            infoText={InfoText.OfferTokenAmount}
          />
          <InputDescription className={classes.description}>
            {Description.OfferTokenAmount}
          </InputDescription>
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
          <InputDescription className={classes.description}>
            {Description.ReserveOfferTokenAmount}
          </InputDescription>
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
            selectorValue={`${data.offeringPeriodUnit}`}
            inputValue={`${data.offeringPeriod}`}
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
