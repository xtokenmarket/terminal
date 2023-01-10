import React from 'react'
import { makeStyles } from '@material-ui/core'
import { commonBaseTokenSymbols, getToken } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { IToken } from 'types'

const useStyles = makeStyles((theme) => ({
  commonTokens: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    margin: '0 -4px',
  },
  token: {
    border: `1px solid ${theme.colors.primary200}`,
    display: 'flex',
    alignItems: 'center',
    padding: 4,
    paddingRight: 12,
    borderRadius: 17,
    margin: 4,
    cursor: 'pointer',
    transition: 'all 0.4s',
    '&:hover': {
      border: `1px solid ${theme.colors.primary100}`,
      backgroundColor: theme.colors.primary400,
    },
    '& img': {
      width: 24,
      height: 24,
      borderRadius: '50%',
      marginRight: 8,
    },
    '& span': {
      color: theme.colors.white,
      fontSize: 14,
      fontWeight: 700,
    },
  },
}))

interface IProps {
  onSelectToken: (_: IToken) => void
  includeETH: boolean
}

export const CommonTokens: React.FC<IProps> = ({
  onSelectToken,
  includeETH,
}) => {
  const cl = useStyles()
  const { networkId } = useConnectedWeb3Context()

  const filteredSymbols = commonBaseTokenSymbols.filter((token) =>
    includeETH ? true : token !== 'eth'
  )

  return (
    <div className={cl.commonTokens}>
      {filteredSymbols.map((tokenId) => {
        const token = getToken(tokenId as any, networkId)
        return (
          <span
            className={cl.token}
            key={token.address}
            onClick={() => onSelectToken(token)}
          >
            <img alt="img" src={token.image || ''} />
            <span>{token.symbol}</span>
          </span>
        )
      })}
    </div>
  )
}
