import { makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {},
  discord: {
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
  },
}))

const About = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>About us</Typography>
      <Typography className={classes.description}>
        xToken is a team of 15 full-time and part-time contributors dedicated to
        building the comprehensive capital markets platform for Web3.
        <br />
        <br />
        Since we launched in July 2020, we've served thousands of DeFi users and
        partnered with some of the most dynamic protocols in the space. For most
        of our history, we were known for building native staking (e.g., xSNX,
        xBNT, xAAVE) and liquidity (xU3LP) strategies. We processed over $300
        million in primary volume across our funds, peaking at $150 million in
        TVL. During the time we spent building an asset management platform, we
        learned an incredible amount about the DeFi space and the critical needs
        of the projects operating within it.
        <br />
        <br />
        As of early 2022, we are focused on a new mission for the protocol,
        dubbed xToken 2.0. Drawing on our experience and perspective in the
        space, the entirety of the team's focus is directed at our new platform,
        xToken Terminal.
        <br />
        <br />
        The vision for Terminal is to build a capital markets and liquidity
        management platform designed for DeFi management teams. Without drawing
        too much of a parallel to the old paradigm, we want to empower projects
        to be their own CFOs and investment bankers. In the course of launching
        and growing a protocol, we've found that most projects rely on a common
        set of "primitives" -- financial operations designed to raise capital or
        bootstrap liquidity, among other intents. The most common of these is
        known as liquidity mining, a technique where a project will pay out
        rewards in one token to users who are willing to deposit liquidity in
        another token or pair of tokens.
        <br />
        <br />
        Our vision for Terminal is to give projects seamless and permissionless
        access to these primitives. By standardizing and enhancing these common
        financial methods -- as well as building some novel ones 👀 -- we
        believe Terminal can become the go-to capital markets platform for Web3.
        Join us in{' '}
        <a
          className={classes.discord}
          href="https://discord.gg/bYYDMSH"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Discord</span>
        </a>{' '}
        to learn more.
      </Typography>
    </div>
  )
}

export default About
