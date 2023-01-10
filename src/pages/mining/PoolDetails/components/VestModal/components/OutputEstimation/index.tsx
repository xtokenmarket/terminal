import { BigNumber } from '@ethersproject/bignumber'
import { makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { TokenIcon } from 'components'
import { ETHER_DECIMAL } from 'config/constants'
import { IDepositState } from 'pages/mining/PoolDetails/components/index'
import { ITerminalPool } from 'types'
import { formatBigNumber, getTimeDurationStr } from 'utils'
import { ZERO } from 'utils/number'

const useStyles = makeStyles((theme) => ({
  root: {},
  estimation: {
    backgroundColor: theme.colors.primary400,
    padding: '24px 32px',
  },
  label: {
    color: theme.colors.primary100,
    marginBottom: 8,
  },
  infoRow: {
    margin: '0 -4px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8,
  },
  tokenIcon: {
    width: 36,
    height: 36,
    border: `4px solid ${theme.colors.transparent}`,
    '&+&': {
      borderColor: theme.colors.primary500,
      position: 'relative',
      left: -12,
    },
  },
  amount: {
    fontSize: 24,
    fontWeight: 600,
    color: theme.colors.white,
    '& span': {
      fontSize: 14,
      fontWeight: 600,
      color: theme.colors.primary100,
    },
  },
}))

interface IProps {
  className?: string
  poolData: ITerminalPool
  isEstimation?: boolean
  earned: BigNumber[]
}

export const OutputEstimation: React.FC<IProps> = ({
  poolData,
  earned,
  isEstimation,
  className,
}) => {
  const cl = useStyles()

  return (
    <div className={clsx(cl.root, className)}>
      <div className={cl.estimation}>
        <Typography className={cl.label}>
          {isEstimation ? 'AVAILABLE TO VEST' : 'YOU VESTED'}
        </Typography>
        {poolData.rewardState.tokens.map((rewardToken, index) => {
          return (
            <div className={cl.infoRow} key={rewardToken.address}>
              <div>
                <TokenIcon token={rewardToken} className={cl.tokenIcon} />
              </div>
              &nbsp;&nbsp;
              <Typography className={cl.amount}>
                {formatBigNumber(
                  earned[index] || ZERO,
                  rewardToken.decimals,
                  4
                )}
                &nbsp;
                {/* <span>~ $13.009</span> */}
              </Typography>
            </div>
          )
        })}
        {isEstimation && (
          <>
            <Typography className={cl.label}>VESTING PERIOD</Typography>
            <Typography className={cl.amount}>
              {getTimeDurationStr(Number(poolData.rewardState.duration))}
            </Typography>
          </>
        )}
      </div>
    </div>
  )
}
