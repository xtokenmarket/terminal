import { BigNumber } from '@ethersproject/bignumber'
import {
  makeStyles,
  TextField,
  Typography,
  CircularProgress,
} from '@material-ui/core'
import clsx from 'clsx'
import { TokenIcon } from 'components'
import { ethers } from 'ethers'
import { useTokenBalance } from 'helpers'
import _ from 'lodash'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import useCommonStyles from 'style/common'
import { IToken } from 'types'
import { formatBigNumber } from 'utils'
import { knownTokens } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { ChainId, CHAIN_NAMES } from 'config/constants'

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 16,
    position: 'relative',
    paddingTop: 10,
  },
  input: {
    '& .Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.colors.white,
        borderWidth: 1,
      },
    },
    '& .Mui-disabled': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.colors.primary100,
      },
    },
  },
  inputBox: { paddingRight: 60, fontWeight: 700 },
  inputBoxDisabled: {
    paddingRight: 60,
    fontWeight: 700,
    color: theme.colors.primary100,
  },
  inputLabel: { color: `${theme.colors.white} !important` },
  inputLabelDisabled: { color: `${theme.colors.primary100} !important` },
  notchedOutline: {
    borderColor: theme.colors.primary200,
  },
  token: {
    position: 'absolute',
    right: 16,
    top: -6,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  tokenIcon: { width: 32, height: 32, borderRadius: '50%' },
  tokenLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: theme.colors.primary100,
    marginTop: 4,
  },
  balance: {
    fontSize: 12,
    color: theme.colors.primary100,
    marginTop: 8,
    textDecoration: 'underline',
    cursor: 'pointer',
    '& span': { fontWeight: 700 },
    '&.disabled': { cursor: 'default' },
  },
  bottomRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buyToken: {
    textDecoration: 'underline',
    cursor: 'pointer',
    color: theme.colors.primary100,
    fontSize: 12,
    marginTop: 8,
  },
  loading: {
    color: theme.colors.white,
    position: 'absolute',
    top: '-4px',
  },
}))

interface ITokenSwapCTA {
  token: IToken
}

const TokenSwapCTA = ({ token }: ITokenSwapCTA) => {
  const classes = useStyles()
  const { networkId } = useConnectedWeb3Context()

  const onTokenBuyClick = (token: IToken) => {
    const chainId: ChainId = networkId || 1
    const uniChainName =
      CHAIN_NAMES[chainId].toLowerCase() === 'ethereum'
        ? 'mainnet'
        : CHAIN_NAMES[chainId].toLowerCase()
    const tokenAddress =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      knownTokens[token.symbol]?.addresses?.[chainId] || token.address
    const swapUrl = `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${tokenAddress}&chain=${uniChainName}`

    const newWindow = window.open(swapUrl, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  if (token.symbol.toLowerCase() === 'weth') {
    return (
      <span className={classes.buyToken} onClick={() => onTokenBuyClick(token)}>
        Wrap ETH
      </span>
    )
  }

  return (
    <span className={classes.buyToken} onClick={() => onTokenBuyClick(token)}>
      Swap for {token.symbol}
    </span>
  )
}

type Variant = 'normal' | 'rewardToken'

interface IProps {
  className?: string
  isDisabled?: boolean
  label?: string
  loading?: boolean
  onChange: (_: BigNumber, balance: BigNumber, token: IToken) => void
  rewardFeePercent?: number
  setLoadingStart?: () => void
  showAvailableBalance?: boolean
  showSwapCTA?: boolean
  token: IToken
  value: BigNumber
  variant?: Variant
}

export const TokenBalanceInput: React.FC<IProps> = ({
  className,
  isDisabled = false,
  label,
  loading,
  onChange,
  rewardFeePercent,
  setLoadingStart,
  showAvailableBalance = true,
  showSwapCTA = true,
  token,
  value,
  variant = 'normal',
}) => {
  const classes = useStyles()
  const commonClasses = useCommonStyles()
  const { balance } = useTokenBalance(token.address)

  const isBalanceDisabled = balance.isZero() || isDisabled

  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (!ethers.utils.parseUnits(amount || '0', token.decimals).eq(value)) {
      if (value.isZero()) {
        setAmount('')
      } else {
        setAmount(ethers.utils.formatUnits(value || '0', token.decimals))
      }
    }
  }, [value])

  const onChangeDebounced = useCallback(
    _.debounce((value: string, tokenBalance: BigNumber) => {
      if (!isNaN(Number(value))) {
        onChange(
          ethers.utils.parseUnits(value || '0', token.decimals),
          tokenBalance,
          token
        )
      }
    }, 1000),
    []
  )

  const onInputBalance = (e: ChangeEvent<HTMLInputElement>) => {
    const decimals = e.target.value.includes('.')
      ? e.target.value.split('.')[1]
      : ''

    if (
      loading ||
      decimals.length > token.decimals ||
      Number(e.target.value) < 0
    )
      return
    setLoadingStart && setLoadingStart()
    setAmount(e.target.value)
    onChangeDebounced(e.target.value, balance)
  }

  const onClickAvailable = () => {
    if (balance.isZero()) return
    onChange(balance, balance, token)
  }

  return (
    <div className={clsx(classes.root, className)}>
      <TextField
        id={isDisabled ? '' : 'investInput'}
        InputLabelProps={{
          className: isDisabled
            ? classes.inputLabelDisabled
            : classes.inputLabel,
        }}
        InputProps={{
          classes: {
            notchedOutline: classes.notchedOutline,
            input: clsx(
              commonClasses.hideInputArrow,
              isDisabled ? classes.inputLabelDisabled : classes.inputBox
            ),
          },
        }}
        className={classes.input}
        value={loading ? '' : amount}
        onChange={onInputBalance}
        variant="outlined"
        fullWidth
        type="number"
        label={label || `${token.symbol.toUpperCase()} amount`}
        disabled={isDisabled}
      />
      <div className={classes.token}>
        {loading && (
          <CircularProgress
            className={classes.loading}
            color="primary"
            size={40}
            thickness={4}
          />
        )}

        <TokenIcon token={token} className={classes.tokenIcon} />
        <span className={classes.tokenLabel}>{token.symbol}</span>
      </div>
      <div className={classes.bottomRow}>
        {showAvailableBalance && (
          <Typography
            className={clsx(
              classes.balance,
              isBalanceDisabled ? 'disabled' : ''
            )}
            onClick={isBalanceDisabled ? undefined : onClickAvailable}
          >
            Available -{' '}
            <b>
              {formatBigNumber(balance, token.decimals, 4)} {token.symbol}
            </b>
          </Typography>
        )}
        {variant === 'rewardToken' && rewardFeePercent && (
          <Typography className={classes.balance}>
            Total rewards (incl. {rewardFeePercent * 100}% fee) -{' '}
            <b>
              {Number(amount) * (1 + rewardFeePercent)} {token.name}
            </b>
          </Typography>
        )}
        {showSwapCTA && <TokenSwapCTA token={token} />}
      </div>
    </div>
  )
}
