import { makeStyles } from '@material-ui/core'
import { transparentize } from 'polished'
import { ITokenOffer } from 'types'
import { OfferingTableHeader, OfferingTableRow } from '../table'

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
  // offerings: ITokenOffer[]
  offerings: string[]
}

export const OfferingTable = ({ offerings }: IProps) => {
  const cl = useStyles()

  return (
<<<<<<< HEAD
    <div className={cl.content}>
      <OfferingTableHeader />
      <div>
        {offerings.map((offering, index) => (
          <OfferingTableRow key={`${offering}-${index}`} offering={offering} />
        ))}
=======
    <div className={cl.root}>
      <div className={cl.content}>
        <OfferingTableHeader />
        <div>
          {offerings.map((offering, index) => (
            <OfferingTableRow
              key={`${offering.offerToken.address}-${offering.purchaseToken.address}-${index}`}
              offering={offering}
            />
          ))}
        </div>
>>>>>>> 0bd293b (Discover table style improvements)
      </div>
    </div>
  )
}
