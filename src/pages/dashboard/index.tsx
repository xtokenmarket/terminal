import { Button, Grid, makeStyles, Typography } from '@material-ui/core'
import { MENU_ITEMS } from 'config/layout'
import { FunctionComponent, SVGProps } from 'react'
import { NavLink } from 'react-router-dom'
import colors from 'theme/colors'

type Items = {
  id: string
  label: string
  icon: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  >
  href: string
  enabled: boolean
  description: string
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
    width: '80%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  link: {
    textDecoration: 'none',
  },
  title: {
    color: theme.colors.white,
    fontWeight: 600,
    fontSize: 28,
    lineHeight: '42px',
  },
  description: {
    color: theme.colors.white,
    fontSize: 14,
    lineHeight: '23px',
  },
  card: {
    background: '#2e1e6d',
    borderRadius: 6,
    padding: '30px 45px',
    color: theme.colors.white,
    border: '1px solid #5f6395',
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    borderRadius: 4,
    width: 30,
    minWidth: 30,
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary300,
    color: theme.colors.white,
    marginRight: '17px',
    '& svg': {
      width: 16,
      height: 16,
    },
  },
  button: {
    minWidth: 100,
    marginTop: 15,
  },
  bottomWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  topDescription: {
    color: theme.colors.white,
    margin: '0 0 25px 0',
    width: '70%',
    lineHeight: 2,
  },
}))

const getItem = () => {
  const descriptions = [
    'Configure and deploy an incentivized liquidity program with a concentrated price range and other custom parameters for any taken pair.',
    'Launch a token offering with dynamic pricing, custom duration and vesting parameters and reserve conditions.',
    'Attract long term, efficient liquidity in our novel hybrid of liquidity mining and bonding. ',
    'Borrow any asset against your native token, with no need for price oracles of any kind.',
  ]
  let dashboardItems = MENU_ITEMS.filter((_, index) => index !== 0)
  dashboardItems = dashboardItems.map((x, index) => {
    return { ...x, description: descriptions[index] }
  })
  return dashboardItems as Items[]
}

const Dashboard = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography className={classes.topDescription}>
        The Xtoken terminal helps you gain access to our platform's apps for
        building capital markets and liquidity managements.
      </Typography>
      <div>
        <Grid container spacing={5}>
          {getItem().map(
            ({ icon: Icon, href, enabled, label, description }) => {
              return (
                <Grid item xs={12} md={6}>
                  <div className={classes.card}>
                    <div className={classes.titleWrapper}>
                      <div className={classes.icon}>
                        <Icon fill={colors[0].colors.white} />
                      </div>
                      <Typography className={classes.title}>{`${label
                        .charAt(0)
                        .toUpperCase()}${label.slice(1)}`}</Typography>
                    </div>
                    <Typography className={classes.description}>
                      {description}
                    </Typography>

                    <div className={classes.bottomWrapper}>
                      {enabled ? (
                        <NavLink to={href} key={href} className={classes.link}>
                          <Button
                            color="primary"
                            disabled={!enabled}
                            variant="contained"
                            className={classes.button}
                          >
                            ENTER
                          </Button>
                        </NavLink>
                      ) : (
                        <Button
                          color="primary"
                          disabled={!enabled}
                          variant="contained"
                          className={classes.button}
                        >
                          ENTER
                        </Button>
                      )}
                    </div>
                  </div>
                </Grid>
              )
            }
          )}
        </Grid>
      </div>
    </div>
  )
}

export default Dashboard
