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
import { isAddress } from 'ethers/lib/utils'
import { Contract } from 'ethers'

import Abi from 'abis'
import { useConnectedWeb3Context } from 'contexts'
import { isContract } from 'utils/tools'
import { fetchUnknownToken } from 'utils/token'

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
  open: boolean
}

export const TokenSelectModal: React.FC<IProps> = ({
  onSelect,
  onClose,
  open,
}) => {
  const cl = useStyles()
  const { library: provider } = useConnectedWeb3Context()

  const [searchQuery, setSearchQuery] = useState('')
  const onSearchQueryChange = useCallback((e) => {
    setSearchQuery(e.target.value)
    setIsLoading(true)
  }, [])

  const debouncedQuery = useDebounce(searchQuery, 500)
  const allTokens = useAllTokens()
  const [tokensList, setTokensList] = useState<IToken[]>(allTokens)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    (async () => {
      const unknownToken = await fetchUnknownToken(provider, debouncedQuery)
      if (unknownToken) {
        setTokensList([unknownToken])
      } else {
        const filteredTokensList = filterTokens(allTokens, debouncedQuery)
        setTokensList(filteredTokensList.length > 0 ? filteredTokensList : [])
      }
      setIsLoading(false)
    })()
  }, [debouncedQuery])

  return (
    <Modal className={cl.modal} open={open} onClose={onClose}>
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
            <CommonTokens onSelectToken={onSelect} />
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
