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
    maxWidth: 1000,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '90%',
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
    [theme.breakpoints.down('xs')]: {
      padding: '20px 20px',
    },
    minHeight: 251.5,
    position: 'relative',
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
    bottom: 30,
    right: 45,
    position: 'absolute',
    [theme.breakpoints.down('xs')]: {
      bottom: 20,
      right: 20,
    },
  },
  bottomWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  topDescription: {
    fontSize: 16,
    color: theme.colors.white,
    marginBottom: 42,
    width: '85%',
    lineHeight: 1.6,
    letterSpacing: 1.5,
    [theme.breakpoints.down('xs')]: {
      width: '90%',
      marginTop: 20,
      lineHeight: 1.5,
    },
  },
  header: {
    color: theme.colors.secondary,
    fontSize: 32,
    marginBottom: 8,
    letterSpacing: 1.5,
  },
}))

const getItem = () => {
  const descriptions = [
    'Configure and deploy an incentivized liquidity program with a concentrated price range and other custom parameters for any token pair.',
    `Launch a token program with dynamic pricing, custom duration, vesting parameters and reserve conditions.`,
    'Abstract the financial and minting logic of your NFT launch, offloading auction mechanics, whitelist logic and much more to our infrastructure. ',
    'Borrow any asset against your native token, with no need for price oracles of any kind.',
    'Attract long term, efficient liquidity in our novel hybrid of liquidity mining and bonding. ',
  ]
  let homeItems = MENU_ITEMS.filter((_, index) => index !== 0)
  homeItems = homeItems.map((x, index) => {
    return { ...x, description: descriptions[index] }
  })
  return homeItems as Items[]
}

const Home = () => {
  const classes = useStyles()

  const formatLabel = (label: string) => {
    return `${label.charAt(0).toUpperCase()}${label.slice(1)}`
  }

  return (
    <div className={classes.root}>
      <Typography className={classes.header}>
        Permissionless Investment Bank
      </Typography>
      <Typography className={classes.topDescription}>
        xToken Terminal provides projects and individuals with seamless access
        to fundamental on-chain primitives
      </Typography>
      <div>
        <Grid container spacing={5}>
          {getItem().map(
            ({ id, icon: Icon, href, enabled, label, description }) => {
              return (
                <Grid item xs={12} md={6} key={id}>
                  <div className={classes.card}>
                    <div className={classes.titleWrapper}>
                      <div className={classes.icon}>
                        <Icon fill={colors[0].colors.white} />
                      </div>
                      <Typography className={classes.title}>
                        {label.split(' ').length > 1
                          ? `${label
                              .split(' ')
                              .map((x) => formatLabel(x))
                              .join(' ')}`
                          : formatLabel(label)}
                      </Typography>
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
                            EXPLORE
                          </Button>
                        </NavLink>
                      ) : (
                        <Button
                          color="primary"
                          disabled={!enabled}
                          variant="contained"
                          className={classes.button}
                        >
                          EXPLORE
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

export default Home
