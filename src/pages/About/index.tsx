import { makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {},
  link: {
    textDecoration: 'none',
    color: theme.colors.primary100,
    '& span': {
      borderBottom: `1px solid ${theme.colors.primary200}`,
    },
  },
  title: {
    color: theme.colors.white,
    fontWeight: 600,
    fontSize: 32,
    lineHeight: '42px',
  },
  description: {
    marginTop: 24,
    color: theme.colors.white,
    fontSize: 18,
    lineHeight: '25px',
    width: '55%',
    maxWidth: 600,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}))

const About = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>About us</Typography>
      <Typography className={classes.description}>
        xToken is a team of 15 full-time and part-time contributors dedicated to
        building the comprehensive capital markets platform for Web3: xToken
        Terminal. The vision for Terminal is to build a capital markets and
        liquidity management platform designed for DeFi and NFT projects.
        Without drawing too much of a parallel to the old paradigm, we want to
        empower projects to be their own CFOs and investment bankers.
        <br />
        <br />
        Join us in{' '}
        <a
          className={classes.link}
          href="https://discord.gg/bYYDMSH"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Discord</span>
        </a>{' '}
        and check out our{' '}
        <a
          className={classes.link}
          href="https://docs.xtokenterminal.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>docs</span>
        </a>{' '}
        to learn more.
      </Typography>
    </div>
  )
}

export default About
