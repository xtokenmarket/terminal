import { makeStyles, Button } from '@material-ui/core'

import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import { matchPath, useHistory } from 'react-router'
import { useMemo } from 'react'
import { MENU_ITEMS } from 'config/layout'
import { useConnectedWeb3Context } from 'contexts'
import { shortenAddress } from 'utils'
import { NetworkSelector } from '../NetworkSelector'
import { ENetwork } from 'utils/enums'
import { useScrollYPosition } from 'helpers'
import clsx from 'clsx'
import colors from 'theme/colors'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    zIndex: 90,
    top: 0,
    right: 0,
    height: theme.custom.appHeaderHeight * 1.2,
    display: 'flex',
    left: 0,
    justifyContent: 'space-between',
    padding: '0 24px',
    backgroundColor: theme.colors.transparent,
    transition: 'all 0.4s',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      padding: '0 12px',
      height: theme.custom.appHeaderHeight * 0.8,
      backgroundColor: theme.colors.primary300,
    },
    [theme.breakpoints.up('sm')]: {
      height: theme.custom.appHeaderHeight,

      '&.blur-header': {
        backgroundColor: theme.colors.primary700,
      },
      left: `calc(${theme.custom.tabletNavbarWidth}px)`,
      padding: '0 36px',
    },
    [theme.breakpoints.up('lg')]: {
      left: `calc(${theme.custom.desktopNavbarWidth}px)`,
      padding: '0 48px',
    },
  },
  title: {
    color: theme.colors.purple0,
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: 16,
    },
    '& span': {
      color: theme.colors.white,
      '& span': { color: theme.colors.purple0 },
    },
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  logo: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
      '& img': { width: 32, height: 32 },
    },
  },
  right: {
    display: 'flex',
    alignItems: 'center',
  },
  connect: {
    background: theme.colors.primary,
    borderRadius: 4,
    height: 40,
    [theme.breakpoints.down(theme.custom.xsss)]: {
      height: 36,
    },
  },
  networkWrapper: {
    marginRight: 16,
    [theme.breakpoints.down(theme.custom.xsss)]: {
      height: 36,
    },
  },
}))

export const Header = () => {
  const classes = useStyles()
  const history = useHistory()
  const { account, setWalletConnectModalOpened, onDisconnect } =
    useConnectedWeb3Context()
  const yPosition = useScrollYPosition()

  const selectedMenuItem = useMemo(() => {
    const item = MENU_ITEMS.find(
      (item) =>
        !!matchPath(history.location.pathname, {
          path: item.href,
          exact: false,
        })
    )
    return item
  }, [history.location.pathname])

  const Icon = selectedMenuItem?.icon

  return (
    <div className={clsx(classes.root, yPosition >= 30 && 'blur-header')}>
      <div className={classes.logo}>
        <img alt="logo" src="/assets/logo.png" />
      </div>
      <div className={classes.title}>
        {Icon && <Icon fill={colors[0].colors.white} />}
        <span>
          xtoken <span>{selectedMenuItem?.label}</span>
        </span>
      </div>
      <div className={classes.right}>
        <NetworkSelector
          className={classes.networkWrapper}
          network={ENetwork.Ethereum}
        />
        <Button
          className={classes.connect}
          color="primary"
          variant="contained"
          onClick={
            account ? onDisconnect : () => setWalletConnectModalOpened(true)
          }
        >
          {account && <AccountBalanceWalletIcon />}
          {account ? shortenAddress(account) : 'CONNECT WALLET'}
        </Button>
      </div>
    </div>
  )
}
