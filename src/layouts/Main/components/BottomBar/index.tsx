import { makeStyles } from '@material-ui/core'
import { MENU_ITEMS } from 'config/layout'
import { NavLink, useHistory, matchPath } from 'react-router-dom'
import colors from 'theme/colors'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.primary500,
    boxShadow: theme.colors.elevation1,
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    transition: 'all 0.5s',
    zIndex: 99,
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
      height: 56,
    },
  },
  content: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },

  item: {
    backgroundColor: theme.colors.primary500,
    height: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    textAlign: 'center',
    '& svg': {
      marginBottom: 4,
      color: theme.colors.primary100,
      width: 16,
      height: 16,
      '& g': { opacity: 0.6 },
    },

    '& span': {
      textTransform: 'uppercase',
      color: theme.colors.primary100,
      transition: 'all 0.4s',
      fontSize: 12,
    },

    '&:hover': {
      backgroundColor: theme.colors.primary,

      '& svg': {
        color: theme.colors.white,
        '& g': { opacity: 1 },
      },

      '& span': {
        color: theme.colors.white,
      },
    },
    '&.active': {
      backgroundColor: theme.colors.primary,

      '& svg': {
        color: theme.colors.white,
        '& g': { opacity: 1 },
      },

      '& span': {
        color: theme.colors.white,
      },
    },
  },
}))

export const BottomBar = () => {
  const classes = useStyles()
  const history = useHistory()

  return (
    <>
      <div className={classes.root}>
        <div className={classes.content}>
          {MENU_ITEMS.map((item) => {
            if (item.href === '/') return
            const Icon = item.icon
            const getIsActive = () =>
              !!matchPath(history.location.pathname, {
                path: item.href,
                exact: false,
              })

            return (
              <NavLink
                isActive={() => getIsActive()}
                to={item.href}
                key={item.href}
                className={classes.item}
              >
                <Icon
                  fill={
                    getIsActive()
                      ? colors[0].colors.white
                      : colors[0].colors.primary100
                  }
                />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      </div>
    </>
  )
}
