import { Button, Grid, makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  block: {
    background: theme.colors.primary400,
    padding: 24,
    [theme.breakpoints.down('sm')]: {
      marginTop: 10,
      width: '100%',
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
    marginBottom: 10,
  },
  itemWrapper: {
    display: 'flex',
    marginTop: 10,
    alignItems: 'center',
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

interface Item {
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
  data: Data
}

interface Data {
  remainingPeriod: RemainingPeriod[]
  vesting: Item[]
  rewards: Item[]
}

export const RewardVestSection = (props: IProps) => {
  const classes = useStyles()
  const { remainingPeriod, vesting, rewards } = props.data

  const renderRewardsItem = (item: Item) => {
    return (
      <div key={item.symbol} className={classes.itemWrapper}>
        <div className={classes.symbolWrapper}>
          <img className={classes.icon} alt="token" src={item.icon} />
          <Typography className={classes.symbol}>{item.symbol}</Typography>
        </div>
        <div className={classes.rewardValueWrapper}>
          <Typography className={classes.value}>{item.value}</Typography>
          <Typography
            className={classes.lightPurpletext}
          >{`~ $ ${item.rate}`}</Typography>
        </div>

        <div className={classes.buttonWrapper}>
          <Button
            className={classes.button}
            color="secondary"
            variant="contained"
          >
            CLAIM
          </Button>
          <Button
            className={classes.button}
            color="secondary"
            variant="contained"
          >
            VEST
          </Button>
        </div>
      </div>
    )
  }

  const renderVestingItems = (item: Item) => {
    return (
      <div className={classes.vestingWrapper}>
        <div className={classes.symbolWrapper}>
          <img className={classes.icon} alt="token" src={item.icon} />
          <Typography className={classes.symbol}>{item.symbol}</Typography>
        </div>
        <div className={classes.valueWrapper}>
          <Typography className={classes.value}>{item.value}</Typography>
          <Typography
            className={classes.lightPurpletext}
          >{`~ $ ${item.rate}`}</Typography>
        </div>
      </div>
    )
  }

  const renderRemainingItems = (item: RemainingPeriod) => {
    return (
      <div className={classes.vestingWrapper}>
        <Typography className={classes.whiteText}>{item.period}</Typography>
        <Typography className={classes.lightPurpletext}>{item.time}</Typography>
      </div>
    )
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <div className={classes.block}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography className={classes.title}>
                {'Total Vesting'.toUpperCase()}
              </Typography>
              {vesting.map((vest) => {
                return renderVestingItems(vest)
              })}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography className={classes.title}>
                {'Remaining period'.toUpperCase()}
              </Typography>
              {remainingPeriod.map((remainingPeriod) => {
                return renderRemainingItems(remainingPeriod)
              })}
            </Grid>
          </Grid>
        </div>
      </Grid>
      <Grid item xs={12} md={6}>
        <div className={classes.block}>
          <div className={classes.titleWrapper}>
            <Typography className={classes.title}>
              {'Claimable Rewards'.toUpperCase()}
            </Typography>
            <img
              className={classes.icon}
              alt="token"
              src={'/assets/imgs/star.svg'}
            />
          </div>
          {rewards.map((item: Item) => {
            return renderRewardsItem(item)
          })}
        </div>
      </Grid>
    </Grid>
  )
}
