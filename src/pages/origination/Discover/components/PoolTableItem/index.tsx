import { makeStyles, Typography } from '@material-ui/core'
import { PoolTd } from '../table'
import { SimpleLoader } from 'components'
import { NavLink } from 'react-router-dom'
import { NetworkIcon } from 'utils/enums'
import { DEFAULT_NETWORK } from 'config/constants'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.primary400,
    borderRadius: 4,

    '&+&': {
      marginTop: 8,
    },
  },
  loader: {
    padding: '20px 0',
  },
  content: {
    cursor: 'pointer',
    padding: 16,
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    textDecoration: 'none',
    '&::before': {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      zIndex: 1,
      transition: 'all 0.4s',
      content: `""`,
    },
    '&:hover': {
      '&::before': {
        backgroundColor: theme.colors.secondary,
      },
    },
  },
  item: {
    color: theme.colors.purple0,
    fontSize: 11,
    display: 'flex',
    alignItems: 'center',
  },
  itemAlignRight: {
    color: theme.colors.purple0,
    fontSize: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tokenIcon: {
    width: 48,
    height: 48,
    border: `6px solid ${theme.colors.primary400}`,
    position: 'relative',
    borderRadius: '50%',
    '&+&': { left: -16 },
  },
  allocation: {
    display: 'flex',
  },
  label: {
    color: theme.colors.white,
    textTransform: 'capitalize',
  },
  apr: {
    backgroundColor: theme.colors.primary200,
    color: theme.colors.white,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    fontSize: 12,
    fontWeight: 700,
    padding: '0 16px',
    borderRadius: 20,
  },
  networkIcon: {
    borderRadius: '50%',
  },
  allocationItem: {
    display: 'flex',
    flexDirection: 'column',
    color: theme.colors.white,
    fontWeight: 700,
    '& span': {
      fontWeight: 400,
      color: theme.colors.primary100,
      fontSize: 14,
    },
  },
}))

interface IProps {
  pool: any
  className?: string
}

// TODO: can be deleted later
const pool = {
  offerToken: {
    address: '0x016750ac630f711882812f24dba6c95b9d35856d',
    decimals: 6,
    image: '/assets/tokens/usdt.png',
    name: 'Tether USD',
    symbol: 'USDT',
  },
  purchaseToken: {
    address: '0x90410304D88E333710703aF6Ed6A14d5ef74575F',
    decimals: 18,
    image: '/assets/tokens/dai.png',
    name: 'DAI',
    symbol: 'DAI',
  },
  maxOffering: '1500000',
  remainingOffering: '497303',
  pricePerToken: '1.25',
  timeRemaining: '6D 19H 30M',
  vestingPeriod: '1 Year',
  vestingCliff: '3 Months',
}

export const PoolTableItem: React.FC<IProps> = () => {
  const cl = useStyles()

  const renderContent = () => {
    const network = DEFAULT_NETWORK

    return (
      <NavLink className={cl.content} to={`/mining/pools/`}>
        <PoolTd type="offerToken">
          <div className={cl.item}>
            <img
              alt="offerToken"
              className={cl.tokenIcon}
              src={pool.offerToken.image}
            />
          </div>
        </PoolTd>

        <PoolTd type="maxOffering">
          <div className={cl.item}>
            <Typography className={cl.label}>{pool.maxOffering}</Typography>
          </div>
        </PoolTd>
        <PoolTd type="remainingOffering">
          <div className={cl.item}>
            <Typography className={cl.label}>
              {pool.remainingOffering}
            </Typography>
          </div>
        </PoolTd>
        <PoolTd type="pricePerToken">
          <div className={cl.itemAlignRight}>
            <Typography className={cl.label}>{pool.pricePerToken}</Typography>
          </div>
        </PoolTd>
        <PoolTd type="timeRemaining">
          <div className={cl.itemAlignRight}>
            <Typography className={cl.label}>{pool.timeRemaining}</Typography>
          </div>
        </PoolTd>
        <PoolTd type="vestingPeriod">
          <div className={cl.itemAlignRight}>
            <Typography className={cl.label}>{pool.vestingPeriod}</Typography>
          </div>
        </PoolTd>
        <PoolTd type="vestingCliff">
          <div className={cl.itemAlignRight}>
            <Typography className={cl.label}>{pool.vestingCliff}</Typography>
          </div>
        </PoolTd>

        <PoolTd type="network">
          <div className={cl.itemAlignRight}>
            <img
              className={cl.networkIcon}
              alt="img"
              src={`/assets/networks/${NetworkIcon[network]}.svg`}
            />
          </div>
        </PoolTd>
      </NavLink>
    )
  }

  return (
    <div className={cl.root}>
      {/* {loading ? <SimpleLoader className={cl.loader} /> : renderContent()} */}
      {renderContent()}
    </div>
  )
}
