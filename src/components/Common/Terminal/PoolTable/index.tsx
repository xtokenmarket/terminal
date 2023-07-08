import { makeStyles } from '@material-ui/core'
import { transparentize } from 'polished'
import { IToken } from 'types'
import { PoolTableHeader, PoolTableItem } from '..'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: 10,
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      backgroundColor: transparentize(0.6, theme.colors.primary),
      height: 12,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.colors.primary,
    },
  },
  content: {
    minWidth: 1000,
  },
}))

interface IProps {
  pools: any[]
  search: string
}

export const PoolTable: React.FC<IProps> = ({ pools, search }) => {
  const cl = useStyles()

  let filteredPools = pools
  if (search) {
    const searchText = search.toLowerCase()
    filteredPools = pools.filter((pool: any) => {
      return (
        pool.token0.address.toLowerCase().startsWith(searchText) ||
        pool.token1.address?.toLowerCase().startsWith(searchText) ||
        pool.token0.name.toLowerCase().includes(searchText) ||
        pool.token1.name?.toLowerCase().includes(searchText) ||
        pool.token0.symbol.toLowerCase().startsWith(searchText) ||
        pool.token1.symbol?.toLowerCase().startsWith(searchText) ||
        pool.rewardTokens.some(
          (rewardToken: IToken) =>
            rewardToken.address.toLowerCase().startsWith(searchText) ||
            rewardToken.name.toLowerCase().includes(searchText) ||
            rewardToken.symbol.toLowerCase().startsWith(searchText)
        )
      )
    })
  }

  return (
    <div className={cl.root}>
      <div className={cl.content}>
        <PoolTableHeader />
        <div>
          {filteredPools.map((pool, index) => (
            <PoolTableItem key={`${pool.address}-${index}`} pool={pool} />
          ))}
        </div>
      </div>
    </div>
  )
}
