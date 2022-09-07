import { Button, Grid, makeStyles, Typography } from '@material-ui/core'
import { DetailedTokenSelect } from 'components/Modal/RewardModal/components/DetailedTokenSelect'
import { useEffect, useState } from 'react'
import { ICreateTokenSaleData } from 'types'
import { Description, InfoText } from 'utils/enums'
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
  labelWrapper: {
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
  tokenWarning: {
    color: theme.colors.warn2,
    fontSize: 14,
    marginBottom: 15,
  },
  amountWarning: {
    color: theme.colors.warn2,
    fontSize: 14,
    marginTop: 15,
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
  const [tokenAmountError, setTokenAmountError] = useState('')
  const [tokenSelectError, setTokenSelectError] = useState('')

  const isNextBtnDisabled = !(
    data.offerToken &&
    data.purchaseToken &&
    data.offerTokenAmount &&
    data.reserveOfferTokenAmount &&
    data.offerToken.address.toLowerCase() !==
      data.purchaseToken.address.toLowerCase() &&
    Number(data.offerTokenAmount) > 0
  )

  useEffect(() => {
    if (
      data.offerToken &&
      data.purchaseToken &&
      data.offerToken.address.toLowerCase() ===
        data.purchaseToken.address.toLowerCase()
    ) {
      setTokenSelectError('Offer token cannot be same as purchase token')
    } else {
      setTokenSelectError('')
    }
  }, [data.offerToken, data.purchaseToken])

  useEffect(() => {
    if (data.offerTokenAmount && Number(data.offerTokenAmount) === 0) {
      setTokenAmountError('Offer token amount must be greater than zero')
    } else {
      setTokenAmountError('')
    }
  }, [data.offerTokenAmount])

  return (
    <>
      <Grid container className={classes.selectInputsContainer}>
        <Grid item xs={12} md={6}>
          <div className={classes.labelWrapper}>
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
          <div className={classes.labelWrapper}>
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
        </Grid>
        {tokenSelectError && (
          <div className={classes.tokenWarning}>{tokenSelectError}</div>
        )}
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
          {tokenAmountError && (
            <div className={classes.amountWarning}>{tokenAmountError}</div>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <TokenAmountInput
            label="Reserve Purchase Token Raised"
            token={data.purchaseToken}
            value={data.reserveOfferTokenAmount}
            onChange={(value) => updateData({ reserveOfferTokenAmount: value })}
            infoText={InfoText.ReserveOfferTokenAmount}
            tokenDetailsPlaceholder={`Minimum amount of ${
              data.purchaseToken ? data.purchaseToken.symbol : 'purchase token'
            } raised for successful sale`}
          />
        </Grid>
      </Grid>
      <Button
        id="offeringStepBtn"
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
