import { makeStyles } from '@material-ui/core'
import { transparentize } from 'polished'
import { IOfferingOverview, IToken } from 'types'
import { TableHeader } from '../TableHeader'
import { TableRow } from '../TableRow'

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
  item: IOfferingOverview
}

export const Table = ({ item }: IProps) => {
  const cl = useStyles()

  return (
    <div className={cl.content}>
      <TableHeader label={item.label} />
      <div>
        <TableRow item={item} />
      </div>
    </div>
  )
}
