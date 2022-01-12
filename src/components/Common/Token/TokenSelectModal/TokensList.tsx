import React from 'react'
import { makeStyles, Typography, CircularProgress } from '@material-ui/core'
import { IToken } from 'types'

const useStyles = makeStyles((theme) => ({
  tokensList: {
    backgroundColor: theme.colors.seventh,
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
  token: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.4s',
    padding: theme.spacing(2),
    '&:hover': {
      backgroundColor: theme.colors.primary500,
    },
  },
  image: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    marginRight: theme.spacing(2),
  },
  symbol: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 700,
    margin: 0,
    lineHeight: '14px',
  },
  name: {
    color: theme.colors.primary100,
    fontSize: 12,
    fontWeight: 700,
  },
  noResultsText: {
    color: theme.colors.white,
    textAlign: 'center',
  },
  spinnerBg: {
    backgroundColor: theme.colors.seventh,
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    color: theme.colors.primary100,
    alignSelf: 'center',
    justifySelf: 'center',
    marginTop: theme.spacing(6),
  },
}))

interface IProps {
  onSelectToken: (_: IToken) => void
  tokens: IToken[]
  isLoading: boolean
}

export const TokensList: React.FC<IProps> = ({
  onSelectToken,
  tokens,
  isLoading,
}) => {
  const cl = useStyles()
  if (isLoading) {
    return (
      <div className={cl.tokensList}>
        <CircularProgress size={100} className={cl.spinner} />
      </div>
    )
  }
  if (tokens.length === 0) {
    return (
      <div className={cl.tokensList}>
        <Typography variant="h5" className={cl.noResultsText}>
          No results found.
        </Typography>
      </div>
    )
  }
  return (
    <div className={cl.tokensList}>
      {tokens.map((token) => {
        return (
          <div
            className={cl.token}
            key={token.address}
            onClick={() => onSelectToken(token)}
          >
            <img className={cl.image} alt="img" src={token.image || ''} />
            <div>
              <p className={cl.symbol}>{token.symbol}</p>
              <span className={cl.name}>{token.name}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
