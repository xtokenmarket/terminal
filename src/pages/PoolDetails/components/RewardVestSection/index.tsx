import { Button, Grid, makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  block: {
    background: theme.colors.primary400,
    padding: 24,
    [theme.breakpoints.down('sm')]: {
      marginTop: 10,
      width: '100%',
      padding: '24px 8px',
    },
  },
  title: {
    color: theme.colors.primary100,
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 15,
    marginRight: 3,
  },
  symbol: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 700,
  },
  value: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 400,
  },
  lightPurpletext: {
    color: theme.colors.primary100,
    fontSize: 12,
    fontWeight: 400,
  },
  whiteText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 400,
    merginRight: 10,
  },
  wrapper: {
    display: 'flex',
    flex: 1,
  },
  vestingWrapper: {
    display: 'flex',
    flex: 1,
    minHeight: 35,
    alignItems: 'center',
  },
  itemWrapper: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 35,
  },
  button: {
    flex: 1,
    height: 20,
    margin: '0 3px',
    fontSize: 12,
  },
  icon: {
    widows: 14,
    height: 14,
    marginRight: 10,
  },
  symbolWrapper: {
    display: 'flex',
    flex: 2,
  },
  valueWrapper: {
    display: 'flex',
    flex: 5,
    marginLeft: 10,
  },
  rewardValueWrapper: {
    display: 'flex',
    flex: 8,
    [theme.breakpoints.down('sm')]: {
      flex: 3,
    },
  },
  buttonWrapper: {
    display: 'flex',
    flex: 1,
  },
  titleWrapper: {
    display: 'flex',
  },
}))

interface RewardVestingItem {
  icon: string
  symbol: string
  value: string
  rate: string
}

interface RemainingPeriod {
  period: string
  time: string
}

interface IProps {
  data: {
    remainingPeriod: RemainingPeriod[]
    vesting: RewardVestingItem[]
    rewards: RewardVestingItem[]
  }
}

export const RewardVestSection: React.FC<IProps> = ({
  data,
}) => {
  const cl = useStyles()
  const { remainingPeriod, vesting, rewards } = data

  const renderRewardsItem = ({ icon, symbol, value, rate }: RewardVestingItem) => {
    return (
      <div key={symbol} className={cl.itemWrapper}>
        <div className={cl.symbolWrapper}>
          <img className={cl.icon} alt="token" src={icon} />
          <Typography className={cl.symbol}>
            {symbol}
          </Typography>
        </div>
        <div className={cl.rewardValueWrapper}>
          <Typography className={cl.value}>
            {value}
          </Typography>
          <Typography className={cl.lightPurpletext}>
            {`~ $ ${rate}`}
          </Typography>
        </div>

        <div className={cl.buttonWrapper}>
          <Button
            className={cl.button}
            color="secondary"
            variant="contained"
          >
            CLAIM
          </Button>
          <Button
            className={cl.button}
            color="secondary"
            variant="contained"
          >
            VEST
          </Button>
        </div>
      </div>
    )
  }

  const renderVestingItems = ({ icon, symbol, value, rate }: RewardVestingItem) => {
    return (
      <div className={cl.vestingWrapper}>
        <div className={cl.symbolWrapper}>
          <img className={cl.icon} alt="token" src={icon} />
          <Typography className={cl.symbol}>
            {symbol}
          </Typography>
        </div>
        <div className={cl.valueWrapper}>
          <Typography className={cl.value}>
            {value}
          </Typography>
          <Typography className={cl.lightPurpletext}>
            {`~ $ ${rate}`}
          </Typography>
        </div>
      </div>
    )
  }

  const renderRemainingItems = ({ period, time }: RemainingPeriod) => {
    return (
      <div className={cl.vestingWrapper}>
        <Typography className={cl.whiteText}>{period}</Typography>
        <Typography className={cl.lightPurpletext}>{time}</Typography>
      </div>
    )
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <div className={cl.block}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography className={cl.title}>
                TOTAL VESTING
              </Typography>
              {vesting.map(renderVestingItems)}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography className={cl.title}>
                {'Remaining period'.toUpperCase()}
              </Typography>
              {remainingPeriod.map(renderRemainingItems)}
            </Grid>
          </Grid>
        </div>
      </Grid>
      <Grid item xs={12} md={6}>
        <div className={cl.block}>
          <div className={cl.titleWrapper}>
            <Typography className={cl.title}>
              CLAIMABLE REWARDS
            </Typography>
            <img
              className={cl.icon}
              alt="token"
              src={'/assets/imgs/star.svg'}
            />
          </div>
          {rewards.map(renderRewardsItem)}
        </div>
      </Grid>
    </Grid>
  )
}
