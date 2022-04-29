import { makeStyles, Typography } from '@material-ui/core'
import { transparentize } from 'polished'
import {
  IOfferingOverview,
  IToken,
  IWhitelistSale,
  OriginationDetailItem,
} from 'types'
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
    marginTop: 15,
  },
  label: {
    fontWeight: 700,
    lineHeight: '19.2px',
    marginBottom: 3,
    color: theme.colors.white,
    marginTop: 24,
  },
}))

interface IProps {
  item: OriginationDetailItem
  label: string
}

export const Table = ({ item, label }: IProps) => {
  const cl = useStyles()

  return (
    <>
      <Typography className={cl.label}>{label}</Typography>
      <div className={cl.content}>
        <TableHeader label={item.label} />
        <div>
          <TableRow item={item} />
        </div>
      </div>
    </>
  )
}
