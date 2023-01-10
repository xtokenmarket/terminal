import {
  Button,
  CircularProgress,
  makeStyles,
  Typography,
} from '@material-ui/core'
import clsx from 'clsx'
import { IToken } from 'types'
import { TokenIcon } from 'components'
import { formatBigNumber, getTotalTokenPrice, numberWithCommas } from 'utils'
import { BigNumber } from 'ethers'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    '&+&': {
      paddingTop: 32,
      '&::before': {
        position: 'absolute',
        top: -15,
        left: 15,
        width: 2,
        bottom: 32,
        backgroundColor: theme.colors.primary200,
        content: `""`,
      },
    },
  },
  content: { flex: 1 },
  title: {
    fontSize: 14,
    color: theme.colors.white,
    marginBottom: 10,
  },
  infoWrapper: { display: 'flex', alignItems: 'center' },
  button: {
    height: 48,
    minWidth: 132,
    '&.pending': {
      color: theme.colors.white,
    },
  },
  progress: { color: theme.colors.white },
  tokenIcon: {
    width: 32,
    height: 32,
  },
  amount: {
    fontSize: 24,
    fontWeight: 600,
    color: theme.colors.white,
    '& span': {
      fontSize: 14,
      fontWeight: 600,
      color: theme.colors.primary100,
    },
  },
}))

interface IProps {
  title: string
  actionLabel: string
  actionDone: boolean
  actionPending: boolean
  onConfirm: () => Promise<void>
  token: IToken
  amount: BigNumber
}

export const TokenInfo = (props: IProps) => {
  const classes = useStyles()
  const {
    title,
    token,
    actionLabel,
    actionDone,
    actionPending,
    onConfirm,
    amount,
  } = props

  return (
    <div className={clsx(classes.root)}>
      <div className={classes.content}>
        <Typography className={classes.title}>{title}</Typography>
        <div className={classes.infoWrapper}>
          <div>
            <TokenIcon token={token} className={classes.tokenIcon} />
          </div>
          &nbsp;&nbsp;
          <Typography className={classes.amount}>
            {numberWithCommas(formatBigNumber(amount, token.decimals, 4))}{' '}
            {token.symbol}
          </Typography>
        </div>
      </div>
      <Button
        id={actionPending || actionDone ? '' : 'initiateSaleApprove'}
        color="primary"
        disabled={actionPending || actionDone}
        variant="contained"
        className={clsx(
          classes.button,
          (actionPending || actionDone) && 'pending'
        )}
        onClick={onConfirm}
      >
        {actionPending ? 'Pending' : actionLabel}
        {actionPending && (
          <>
            &nbsp;
            <CircularProgress className={classes.progress} size={10} />
          </>
        )}
      </Button>
    </div>
  )
}
