import { Button, Grid, makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  block: {
    background: theme.colors.primary400,
    padding: 24,
    [theme.breakpoints.down('sm')]: {
      // marginTop: 10,
      width: '100%',
    },
  },
  title: {
    color: theme.colors.primary100,
    fontSize: 10,
    fontWeight: 700,
    flex: 1,
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
  },
  wrapper: {
    display: 'flex',
    flex: 1,
  },
  itemWrapper: {
    display: 'flex',
    marginTop: 10,
  },
  button: {
    width: 90,
    flex: 1,
    height: 20,
    margin: '0 3px',
    fontSize: 12,
  },
}))

interface Item {
  icon: string
  symbol: string
  value: string
  rate: string
  period?: string
  time?: string
}

interface IProps {
  items: Item[]
  titles: string[]
}

export const RewardVestSection = (props: IProps) => {
  const classes = useStyles()
  const { items, titles } = props

  const renderItem = (item: Item) => {
    return (
      <div key={item.symbol} className={classes.itemWrapper}>
        <div className={classes.wrapper}>
          <div>
            <div>{item.icon}</div>
            <Typography className={classes.symbol}>{item.symbol}</Typography>
          </div>
          <Typography className={classes.value}>{item.value}</Typography>
          <Typography
            className={classes.lightPurpletext}
          >{`~ $ ${item.rate}`}</Typography>
        </div>
        {item.period ? (
          <div className={classes.wrapper}>
            <Typography className={classes.whiteText}>{item.period}</Typography>
            <Typography className={classes.lightPurpletext}>
              {item.time}
            </Typography>
          </div>
        ) : (
          <div>
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
        )}
      </div>
    )
  }

  return (
    <Grid item xs={12} md={6}>
      <div className={classes.block}>
        <div className={classes.itemWrapper}>
          <Typography className={classes.title}>
            {titles[0].toUpperCase()}
          </Typography>
          {titles[1] && (
            <Typography className={classes.title}>
              {titles[1].toUpperCase()}
            </Typography>
          )}
        </div>

        {items.map((item: Item) => {
          return renderItem(item)
        })}
      </div>
    </Grid>
  )
}
