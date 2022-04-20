import { makeStyles, Typography } from '@material-ui/core'
import { OfferingTd } from '../table'
import { NavLink } from 'react-router-dom'

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
  // TODO: fix typing
  offering: any
}

export const OfferingTableItem = ({ offering }: IProps) => {
  const {
    maxOffering,
    remainingOffering,
    pricePerToken,
    timeRemaining,
    vestingPeriod,
    vestingCliff,
  } = offering

  const cl = useStyles()

  const renderContent = () => (
    <NavLink className={cl.content} to={`/mining/pools/`}>
      <OfferingTd type="offerToken">
        <div className={cl.item}>
          <img
            alt="offerToken"
            className={cl.tokenIcon}
            src={offering.offerToken.image}
          />
        </div>
      </OfferingTd>

      <OfferingTd type="maxOffering">
        <div className={cl.item}>
          <Typography className={cl.label}>{maxOffering}</Typography>
        </div>
      </OfferingTd>
      <OfferingTd type="remainingOffering">
        <div className={cl.item}>
          <Typography className={cl.label}>{remainingOffering}</Typography>
        </div>
      </OfferingTd>
      <OfferingTd type="pricePerToken">
        <div className={cl.itemAlignRight}>
          <Typography className={cl.label}>{pricePerToken}</Typography>
        </div>
      </OfferingTd>
      <OfferingTd type="timeRemaining">
        <div className={cl.itemAlignRight}>
          <Typography className={cl.label}>{timeRemaining}</Typography>
        </div>
      </OfferingTd>
      <OfferingTd type="vestingPeriod">
        <div className={cl.itemAlignRight}>
          <Typography className={cl.label}>{vestingPeriod}</Typography>
        </div>
      </OfferingTd>
      <OfferingTd type="vestingCliff">
        <div className={cl.itemAlignRight}>
          <Typography className={cl.label}>{vestingCliff}</Typography>
        </div>
      </OfferingTd>
    </NavLink>
  )

  return (
    <div className={cl.root}>
      {/* {loading ? <SimpleLoader className={cl.loader} /> : renderContent()} */}
      {renderContent()}
    </div>
  )
}
