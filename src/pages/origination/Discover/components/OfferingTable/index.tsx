import { makeStyles } from '@material-ui/core'
import { transparentize } from 'polished'
import { ITokenOffer } from 'types'
import { OfferingTableHeader, OfferingTableRow } from '../table'

const useStyles = makeStyles((theme) => ({
  content: {
    paddingBottom: 10,
    minWidth: 1000,
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      backgroundColor: transparentize(0.6, theme.colors.primary),
      height: 12,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.colors.primary,
    },
  },
}))

interface IProps {
  offerings: ITokenOffer[]
}

export const OfferingTable = ({ offerings }: IProps) => {
  const cl = useStyles()

  return (
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
    </div>
  )
}
