import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles((theme: any) => ({
  root: {
    '&.offerToken': { width: '12%' },
    '&.remainingOffering': { width: '12%' },
    '&.maxOffering': { width: '12%' },
    '&.pricePerToken': { flex: 1 },
    '&.timeRemaining': { width: '12%' },
    '&.vestingPeriod': { width: '12%' },
    '&.vestingCliff': { width: '12%' },
    '&.network': { width: '12%' },
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
    | 'network'
  children: React.ReactNode | React.ReactNode[]
}

export const PoolTd: React.FC<IProps> = ({ type, children }) => {
  const cl = useStyles()

  return <div className={clsx(cl.root, type)}>{children}</div>
}
