import { makeStyles } from '@material-ui/core'
import { transparentize } from 'polished'
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
  addresses: string[]
}

export const PoolTable: React.FC<IProps> = ({
  addresses
}) => {
  const cl = useStyles()

  return (
    <div className={cl.root}>
      <div className={cl.content}>
        <PoolTableHeader />
        <div>
          {addresses.map((address) => (
            <PoolTableItem poolAddress={address} key={address} />
          ))}
        </div>
      </div>
    </div>
  )
}
