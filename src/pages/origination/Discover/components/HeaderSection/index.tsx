import { makeStyles } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { useConnectedWeb3Context } from 'contexts'
import { NavLink } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4),
  },
  input: {
    width: '100%',
    border: `1px solid ${theme.colors.purple0} `,
    borderRadius: 4,
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1, 2),
    '& input': {
      color: theme.colors.white,
    },
  },
  bottomSection: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  createBtn: {
    padding: '8px 20px',
    backgroundColor: theme.colors.secondary,
    fontSize: 14,
    color: theme.colors.primary700,
    fontWeight: 600,
    textDecoration: 'none',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(1, 0, 0, 2),
    },
  },
  checkLabel: {
    margin: 4,
    color: theme.colors.purple0,
    '& span': {
      fontSize: 14,
    },
  },
  searchIcon: {
    color: theme.colors.eighth,
  },
}))

export const HeaderSection = () => {
  const cl = useStyles()
  const { account } = useConnectedWeb3Context()
  const isConnected = !!account

  return (
    <div className={cl.root}>
      <div className={cl.bottomSection}>
        {isConnected && (
          <NavLink to="/origination/new-token-program" className={cl.createBtn}>
            <AddIcon />
            &nbsp; CREATE
          </NavLink>
        )}
      </div>
    </div>
  )
}
