import React from 'react'
import { makeStyles } from '@material-ui/core'
import { getToken, tokenSymbols } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { IToken } from 'types'

const useStyles = makeStyles((theme) => ({
  tokensList: {
    backgroundColor: theme.colors.seventh,
    padding: theme.spacing(3),
    width: '100%',
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
}))

interface IProps {
  onSelectToken: (_: IToken) => void
}

export const TokensList: React.FC<IProps> = ({ onSelectToken }) => {
  const cl = useStyles()
  const { networkId } = useConnectedWeb3Context()
  return (
    <div className={cl.tokensList}>
      {tokenSymbols.map((tokenId) => {
        const token = getToken(tokenId as any, networkId)
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
