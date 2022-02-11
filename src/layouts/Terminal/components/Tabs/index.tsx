import { makeStyles } from '@material-ui/core'
import { NavLink } from 'react-router-dom'
import { useHistory, matchPath } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',

    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      backgroundColor: theme.colors.primary500,
    },
  },
  item: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 24px',
    textDecoration: 'none',
    backgroundColor: theme.colors.primary500,
    color: theme.colors.purple0,
    height: '100%',
    transition: 'all 0.4s',
    boxShadow: theme.colors.elevation3,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    '&+&': {
      marginLeft: 4,
    },
    '&:hover': { color: theme.colors.white, boxShadow: 'none' },
    '&.active': {
      color: theme.colors.white,
      boxShadow: 'none',
    },
    [theme.breakpoints.down('xs')]: {
      boxShadow: 'none',
      borderBottom: '2px solid transparent',
      '&:hover': { borderColor: theme.colors.secondary },
      '&.active': {
        borderColor: theme.colors.secondary,
      },
    },
  },
}))

const tabs = [
  { id: 'discover', href: '/terminal/discover', label: 'Discover' },
  { id: 'my-pool', href: '/terminal/my-pool', label: 'My Pools' },
  { id: 'about', href: '/terminal/about', label: 'About' },
]

export const Tabs = () => {
  const classes = useStyles()
  const history = useHistory()

  return (
    <div className={classes.root}>
      {tabs.map((tab) => (
        <NavLink
          to={tab.href}
          key={tab.id}
          className={classes.item}
          isActive={() =>
            !!matchPath(history.location.pathname, {
              exact: true,
              path: tab.href,
            })
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  )
}
