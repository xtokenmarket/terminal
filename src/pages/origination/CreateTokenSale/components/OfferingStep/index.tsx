import { Button, Grid, makeStyles, Typography } from '@material-ui/core'
import { DetailedTokenSelect } from 'components/Modal/RewardModal/components/DetailedTokenSelect'
import { ICreateTokenSaleData } from 'types'
import { Description, InfoText } from 'utils/enums'
import { InputDescription } from '../InputDescription'
import { QuestionTooltip } from '../QuestionTooltip'
import { TokenAmountInput } from '../TokenAmountInput'

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.colors.white,
    fontFamily: 'Gilmer',
    fontWeight: 664,
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
    '&>:not(:last-child)': {
      marginBottom: 22,
    },
    [theme.breakpoints.up('md')]: {
      '& > *': {
        paddingRight: theme.spacing(4),
      },
    },
  },
  textDecoration: {
    textDecoration: `underline ${theme.colors.primary200}`,
    textUnderlineOffset: '5px',
  },
  nextButton: {
    marginTop: 'auto',
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
  const isNextBtnDisabled = !(
    data.offerToken &&
    data.purchaseToken &&
    data.offerTokenAmount &&
    data.reserveOfferTokenAmount &&
    data.offerToken.address !== data.purchaseToken.address &&
    Number(data.offerTokenAmount) >= Number(data.reserveOfferTokenAmount)
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
            includeETH={true}
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
          <TokenAmountInput
            label="Offer Token Amount"
            token={data.offerToken}
            value={data.offerTokenAmount}
            onChange={(value) => updateData({ offerTokenAmount: value })}
            infoText={InfoText.OfferTokenAmount}
            tokenDetailsPlaceholder={Description.OfferTokenAmount}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TokenAmountInput
            label="Reserve Offer Token Amount"
            token={data.offerToken}
            value={data.reserveOfferTokenAmount}
            onChange={(value) => updateData({ reserveOfferTokenAmount: value })}
            infoText={InfoText.ReserveOfferTokenAmount}
            tokenDetailsPlaceholder={Description.ReserveOfferTokenAmount}
          />
        </Grid>
      </Grid>

      <Button
        className={classes.nextButton}
        color="primary"
        fullWidth
        onClick={onNext}
        variant="contained"
        disabled={isNextBtnDisabled}
      >
        Next
      </Button>
    </>
  )
}
