import { makeStyles, Typography } from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip'
import clsx from 'clsx'
import { MENU_ITEMS, SOCIAL_ITEMS } from 'config/layout'
import { NavLink, useHistory, matchPath } from 'react-router-dom'
import { ReactComponent as OriginationIcon } from 'assets/svgs/origination.svg'
import colors from 'theme/colors'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.primary,
    boxShadow: theme.colors.elevation1,
    position: 'fixed',
    top: 0,
    bottom: 0,
    transition: 'all 0.5s',
    overflowY: 'auto',
    zIndex: 99,
    '&::-webkit-scrollbar': {
      width: 0,
    },
    [theme.breakpoints.down('xs')]: {
      width: 0,
      left: 0,
    },
    [theme.breakpoints.up('sm')]: {
      left: 0,
      width: theme.custom.tabletNavbarWidth,
      '&:hover': {
        width: theme.custom.desktopNavbarWidth,
      },
    },
    [theme.breakpoints.up('lg')]: {
      left: 0,
      width: theme.custom.desktopNavbarWidth,
    },
  },
  content: {
    height: '100%',
    minHeight: 650,
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
  },
  header: {
    padding: 4,
    margin: '20px 0',
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 36,
    marginRight: 24,
  },
  logoLabel: {
    color: theme.colors.white,
    fontWeight: 600,
  },
  body: { flex: 1, paddingTop: 32 },
  footer: {},
  item: {
    '& + &': {
      marginTop: 16,
    },
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',

    textDecoration: 'none',

    '& .menu-item-icon-wrapper': {
      borderRadius: 4,
      width: 40,
      minWidth: 40,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary500,
      color: theme.colors.purple0,
      transition: 'all 0.4s',
      '& svg': {
        width: 20,
        height: 20,
        '& g': { opacity: 0.6 },
      },
    },

    '& span': {
      textTransform: 'uppercase',
      marginLeft: 20,
      color: theme.colors.purple0,
      transition: 'all 0.4s',
    },

    '&:hover': {
      '& .menu-item-icon-wrapper': {
        backgroundColor: theme.colors.primary400,
        color: theme.colors.white,
        '& svg': {
          '& g': { opacity: 1 },
        },
      },
      '& span': {
        color: theme.colors.white,
      },
    },
    '&.active': {
      '& .menu-item-icon-wrapper': {
        backgroundColor: theme.colors.primary300,
        color: theme.colors.white,
        '& svg': {
          '& g': { opacity: 1 },
        },
      },
      '& span': {
        color: theme.colors.white,
      },
    },
  },
  tooltip: {
    backgroundColor: theme.colors.primary300,
    fontFamily: 'Gilmer',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 8,
  },
  tooltipArrow: {
    color: theme.colors.primary300,
  },
}))

export const Sidebar = () => {
  const classes = useStyles()
  const history = useHistory()

  return (
    <>
      <div className={classes.root}>
        <div onClick={(e) => e.stopPropagation()} className={classes.content}>
          <div className={classes.header}>
            <div className={classes.logoWrapper}>
              <img alt="logo" src="/assets/logo.png" className={classes.logo} />
              <Typography className={classes.logoLabel}>XTOKEN</Typography>
            </div>
          </div>
          <div className={classes.body}>
            {MENU_ITEMS.map(({ icon: Icon, href, enabled }) => {
              const getIsActive = () =>
                !!matchPath(history.location.pathname, {
                  path: href,
                  exact: false,
                })

              const content = (
                <div className="menu-item-icon-wrapper">
                  <Icon
                    fill={
                      getIsActive()
                        ? colors[0].colors.white
                        : colors[0].colors.primary100
                    }
                  />
                </div>
              )

              if (!enabled) {
                return (
                  <Tooltip
                    title="Coming Soon"
                    arrow
                    placement="top"
                    classes={{
                      arrow: classes.tooltipArrow,
                      tooltip: classes.tooltip,
                    }}
                    key={href}
                  >
                    <div className={classes.item}>{content}</div>
                  </Tooltip>
                )
              }

              return (
                <NavLink
                  isActive={getIsActive}
                  to={href}
                  key={href}
                  className={classes.item}
                >
                  {content}
                </NavLink>
              )
            })}
          </div>
          <div className={classes.footer}>
            {SOCIAL_ITEMS.map((item) => {
              const Icon = item.icon

              return (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={item.href}
                  key={item.href}
                  className={classes.item}
                >
                  <div className="menu-item-icon-wrapper">
                    <Icon fill="white" />
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
