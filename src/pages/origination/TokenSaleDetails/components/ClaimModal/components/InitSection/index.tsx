import { useEffect, useReducer } from 'react'
import {
  Button,
  CircularProgress,
  makeStyles,
  Typography,
} from '@material-ui/core'
import { useConnectedWeb3Context } from 'contexts'
import { useSnackbar } from 'notistack'
import { FungiblePoolService } from 'services'
import { TokenIcon } from 'components'
import { formatBigNumber } from 'utils'
import { IClaimData } from 'types'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 32,
  },
  button: { height: 48, marginBottom: 24 },
  progress: { color: theme.colors.white },
  estimation: {
    backgroundColor: theme.colors.primary400,
    padding: '24px 32px',
    marginBottom: 32,
  },
  label: {
    color: theme.colors.primary100,
    marginBottom: 8,
  },
  infoRow: {
    margin: '0 -4px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8,
  },
  tokenIcon: {
    width: 36,
    height: 36,
    border: `4px solid ${theme.colors.transparent}`,
    '&+&': {
      borderColor: theme.colors.primary500,
      position: 'relative',
      left: -12,
    },
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
  data?: IClaimData
  poolAddress: string
  onNext: () => void
  onClose: () => void
  setTxId: (id: string) => void
  isClaimToken: boolean
}

interface IState {
  isCompleted: boolean
  isClaiming: boolean
  poolAddress: string
}

export const InitSection = ({
  data,
  poolAddress,
  onNext,
  onClose,
  setTxId,
  isClaimToken,
}: IProps) => {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const { account, library: provider } = useConnectedWeb3Context()

  const [state, setState] = useReducer(
    (prevState: IState, newState: Partial<IState>) => ({
      ...prevState,
      ...newState,
    }),
    {
      isCompleted: false,
      isClaiming: false,
      poolAddress: '',
    }
  )

  const fungibleOriginationPool = new FungiblePoolService(
    provider,
    account,
    poolAddress
  )

  useEffect(() => {
    if (state.isCompleted) {
      onNext()
    }
  }, [state.isCompleted, onNext])

  const onClaim = async () => {
    try {
      setState({ isClaiming: true })

      const txId = await fungibleOriginationPool[
        !isClaimToken ? 'claimPurchaseToken' : 'claimTokens'
      ]()

      const finalTxId = await fungibleOriginationPool.waitUntilClaim(
        txId,
        isClaimToken
      )

      setTxId(finalTxId)

      setState({
        isClaiming: false,
        isCompleted: true,
      })
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Transaction execution failed', {
        variant: 'error',
        autoHideDuration: 10000,
      })
      setState({ isClaiming: false })
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.estimation}>
        <Typography className={classes.label}>CLAIMABLE TOKENS</Typography>
        {data?.purchaseToken && (
          <div className={classes.infoRow}>
            <TokenIcon
              token={data?.purchaseToken}
              className={classes.tokenIcon}
            />
            &nbsp;&nbsp;
            <Typography className={classes.amount}>
              {formatBigNumber(
                data?.purchaseTokenAmount || 0,
                data?.purchaseToken.decimals
              )}{' '}
              {data?.purchaseToken.symbol}
            </Typography>
          </div>
        )}
        {data?.offerToken && (
          <div className={classes.infoRow}>
            <TokenIcon token={data?.offerToken} className={classes.tokenIcon} />
            &nbsp;&nbsp;
            <Typography className={classes.amount}>
              {formatBigNumber(
                data?.offerTokenAmount || 0,
                data?.offerToken.decimals
              )}{' '}
              {data?.offerToken.symbol}
            </Typography>
          </div>
        )}
      </div>
      <Button
        className={classes.button}
        color="primary"
        fullWidth
        onClick={() => onClaim()}
        variant="contained"
      >
        {state.isClaiming ? (
          <CircularProgress className={classes.progress} size={30} />
        ) : (
          'CLAIM TOKENS'
        )}
      </Button>
      <Button
        className={classes.button}
        color="secondary"
        disabled={state.isClaiming}
        fullWidth
        onClick={onClose}
        variant="contained"
      >
        CANCEL
      </Button>
    </div>
  )
}
