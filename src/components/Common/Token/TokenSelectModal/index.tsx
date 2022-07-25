import React, { useCallback, useState, useEffect } from 'react'
import {
  makeStyles,
  Modal,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
} from '@material-ui/core'
import { CloseOutlined } from '@material-ui/icons'
import SearchIcon from '@material-ui/icons/Search'

import { IToken } from 'types'
import { CommonTokens } from './CommonTokens'
import { TokensList } from './TokensList'
import { useDebounce } from 'hooks/useDebouce'

import { useAllTokens } from 'hooks/useAllTokens'
import { filterTokens } from 'utils/filter'

import { useConnectedWeb3Context } from 'contexts'
import { fetchUnknownToken } from 'utils/token'
import { useNetworkContext } from 'contexts/networkContext'
import { useServices } from 'helpers'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
    outline: 'none',
    userSelect: 'none',
    width: 700,
    maxWidth: '90vw',
    height: '80vh',
    backgroundColor: theme.colors.primary500,
    display: 'flex',
    flexDirection: 'column',
  },
  topSection: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
  title: {
    fontSize: 20,
    color: theme.colors.white,
    marginBottom: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    padding: 12,
    top: 0,
    right: 0,
    color: theme.colors.purple0,
    '&:hover': {
      background: 'none',
      color: 'white',
    },
  },
  search: {
    '& .MuiInput-root': {
      border: `1px solid ${theme.colors.purple0}`,
      borderRadius: 4,
      padding: theme.spacing(1),
      transition: 'all 0.2s ease',
      '&.Mui-focused': {
        border: `1px solid ${theme.colors.white}`,
        '& .searchIcon': {
          color: 'white',
        },
      },
    },
    '& .searchIcon': {
      color: theme.colors.eighth,
      transition: 'all 0.2s ease',
    },
    '& input::placeholder': {
      color: 'rgba(255, 255, 255, 0.2)',
    },
  },
  commonLabel: {
    color: theme.colors.primary100,
    fontWeight: 700,
    fontSize: 10,
    margin: theme.spacing(3, 0, 1, 0),
  },
}))

interface IProps {
  onClose: () => void
  onSelect: (_: IToken) => void
  includeETH?: boolean
  open: boolean
}

export const TokenSelectModal: React.FC<IProps> = ({
  onSelect,
  onClose,
  includeETH = false,
  open,
}) => {
  const cl = useStyles()
  const { library: provider } = useConnectedWeb3Context()
  const { chainId } = useNetworkContext()
  const { multicall } = useServices()

  const [searchQuery, setSearchQuery] = useState('')
  const onSearchQueryChange = useCallback((e) => {
    setSearchQuery(e.target.value)
    setIsLoading(true)
  }, [])

  const debouncedQuery = useDebounce(searchQuery, 500)
  const allTokens = useAllTokens(!!includeETH)
  const [tokensList, setTokensList] = useState<IToken[]>(allTokens)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      const unknownToken = await fetchUnknownToken(
        provider,
        chainId,
        debouncedQuery,
        multicall
      )
      if (unknownToken) {
        setTokensList([unknownToken])
      } else {
        const filteredTokensList = filterTokens(allTokens, debouncedQuery)
        setTokensList(filteredTokensList.length > 0 ? filteredTokensList : [])
      }
      setIsLoading(false)
    })()
  }, [debouncedQuery, chainId])

  const _onClose = () => {
    setSearchQuery('')
    onClose()
  }

  return (
    <Modal className={cl.modal} open={open} onClose={_onClose}>
      <div className={cl.content}>
        <div className={cl.topSection}>
          <Typography className={cl.title}>Select Token</Typography>
          <IconButton className={cl.closeButton} onClick={onClose}>
            <CloseOutlined />
          </IconButton>
          <div>
            <TextField
              className={cl.search}
              fullWidth
              autoFocus
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="searchIcon" />
                  </InputAdornment>
                ),
              }}
              variant="standard"
              color="primary"
              placeholder="Search by token name or paste address"
              value={searchQuery}
              onChange={onSearchQueryChange}
            />
            <Typography className={cl.commonLabel}>COMMON BASES</Typography>
            <CommonTokens onSelectToken={onSelect} includeETH={includeETH} />
          </div>
        </div>
        <TokensList
          onSelectToken={onSelect}
          tokens={tokensList}
          isLoading={isLoading}
        />
      </div>
    </Modal>
  )
}
