import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  root: {
    '&.offerToken': { width: '25%' },
    '&.remainingOffering': { width: '14%' },
    '&.maxOffering': { width: '14%' },
    '&.pricePerToken': { width: '14%' },
    '&.timeRemaining': { width: '14%' },
    '&.vestingPeriod': { width: '14%' },
    '&.vestingCliff': { width: '11%' },
    '&+&': { paddingLeft: 16 },
    '&:last-child': {
      textAlign: 'right',
    },
  },
}))

interface IProps {
  type:
    | 'offerToken'
    | 'maxOffering'
    | 'remainingOffering'
    | 'pricePerToken'
    | 'timeRemaining'
    | 'vestingPeriod'
    | 'vestingCliff'
  children: React.ReactNode | React.ReactNode[]
}

export const OfferingTd = ({ type, children }: IProps) => {
  const cl = useStyles()

  return <div className={clsx(cl.root, type)}>{children}</div>
}
