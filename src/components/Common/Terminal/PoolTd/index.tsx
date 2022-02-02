import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles((theme: any) => ({
  root: {
    '&.pool': { width: '10%' },
    '&.allocation': { flex: 1 },
    '&.tvl': { width: '10%' },
    '&.vesting': { width: '10%' },
    '&.program': { width: '18%' },
    '&.ending': { width: '15%' },
    '&.apr': { width: '10%' },
    '&+&': { paddingLeft: 16 },
    '&:last-child': {
      textAlign: 'right',
    },
  },
}))

interface IProps {
  type: 'pool' | 'tvl' | 'vesting' | 'program' | 'ending' | 'apr' | 'allocation'
  children: React.ReactNode | React.ReactNode[]
}

export const PoolTd: React.FC<IProps> = ({
  type,
  children
}) => {
  const cl = useStyles()

  return <div className={clsx(cl.root, type)}>{children}</div>
}
