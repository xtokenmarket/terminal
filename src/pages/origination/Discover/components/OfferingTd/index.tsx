import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  root: {
    '&.offerToken': { width: '14%' },
    '&.offeringName': { width: '21%' },
    '&.remainingOffering': { width: '18%' },
    '&.pricePerToken': { width: '14%' },
    '&.amountRaised': { width: '14%' },
    '&.timeRemaining': { width: '14%' },
    '&.vestingPeriod': { width: '11%' },
    '&+&': { paddingLeft: 16 },
    '&:last-child': {
      textAlign: 'right',
    },
  },
}))

interface IProps {
  type:
    | 'offerToken'
    | 'offeringName'
    | 'remainingOffering'
    | 'pricePerToken'
    | 'amountRaised'
    | 'timeRemaining'
    | 'vestingPeriod'
  children: React.ReactNode | React.ReactNode[]
}

export const OfferingTd = ({ type, children }: IProps) => {
  const cl = useStyles()

  return <div className={clsx(cl.root, type)}>{children}</div>
}
