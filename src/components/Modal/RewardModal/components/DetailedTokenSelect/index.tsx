import { makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { TokenIcon, TokenSelectModal } from 'components'
import { useState } from 'react'
import { IToken } from 'types'

const useStyles = makeStyles((theme) => ({
  root: {
    height: 80,
    display: 'flex',
    backgroundColor: theme.colors.primary400,
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: 4,
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
    transition: 'all 0.4s',
    '&:hover': {
      backgroundColor: theme.colors.primary200,
    },
    '&.disabled': {
      cursor: 'default',
    },
  },
  tokenIcon: {
    width: 48,
    height: 48,
    marginRight: theme.spacing(2),
  },
  tokenSymbol: {
    fontWeight: 600,
    fontSize: 22,
    lineHeight: '26.4px',
  },
  tokenName: {
    fontSize: 14,
    color: theme.colors.primary100,
  },
  text: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    color: theme.colors.white,
  },
  downArrow: {},
}))

interface IDetailedTokenSelect {
  className?: string
  isDisabled?: boolean
  token?: IToken
  hasPlaceholderTokenIcon?: boolean
  includeETH?: boolean
  onChange: (_: IToken) => void
}

export const DetailedTokenSelect = ({
  token,
  hasPlaceholderTokenIcon = true,
  isDisabled = false,
  includeETH = false,
  onChange,
  className,
}: IDetailedTokenSelect) => {
  const classes = useStyles()
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <div>
      <TokenSelectModal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={(token) => {
          onChange(token)
          setModalVisible(false)
        }}
        includeETH={includeETH}
      />
      <div
        className={clsx(classes.root, className)}
        onClick={() => (!isDisabled ? setModalVisible(true) : undefined)}
        id={includeETH ? 'selectToken1' : 'selectToken0'}
      >
        {token ? (
          <TokenIcon token={token} className={classes.tokenIcon} />
        ) : (
          hasPlaceholderTokenIcon && (
            <TokenIcon token={token} className={classes.tokenIcon} />
          )
        )}
        <div className={classes.text}>
          {token ? (
            <>
              <Typography className={classes.tokenSymbol}>
                {token.symbol}
              </Typography>
              {token.name && (
                <Typography className={classes.tokenName}>
                  {token.name}
                </Typography>
              )}
            </>
          ) : (
            'Select token'
          )}
        </div>
        {!isDisabled && (
          <img
            alt="down"
            className={classes.downArrow}
            src="/assets/icons/down-arrow.svg"
          />
        )}
      </div>
    </div>
  )
}
