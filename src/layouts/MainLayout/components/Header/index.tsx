import { makeStyles, Button } from "@material-ui/core";

import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import { matchPath, useHistory } from "react-router";
import { useMemo } from "react";
import { MENU_ITEMS } from "config/layout";
import { useConnectedWeb3Context } from "contexts";
import { shortenAddress } from "utils";
import MenuIcon from "@material-ui/icons/Menu";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import { NetworkSelector } from "../NetworkSelector";
import { ENetwork } from "utils/enums";
import { useScrollYPosition } from "helpers";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    zIndex: 90,
    top: 0,
    right: 0,
    height: theme.custom.appHeaderHeight * 1.2,
    display: "flex",
    flexDirection: "column",
    left: 0,
    justifyContent: "center",
    padding: "0 24px",
    backgroundColor: theme.colors.transparent,
    transition: "all 0.4s",
    "&.blur-header": {
      backgroundColor: theme.colors.primary,
    },
    [theme.breakpoints.up("sm")]: {
      height: theme.custom.appHeaderHeight,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    [theme.breakpoints.up(theme.custom.smd)]: {
      left: `calc(${theme.custom.tabletNavbarWidth}px)`,
      padding: "0 36px",
    },
    [theme.breakpoints.up("lg")]: {
      left: `calc(${theme.custom.desktopNavbarWidth}px)`,
      padding: "0 48px",
    },
  },
  title: {
    color: theme.colors.fourth,
    display: "flex",
    alignItems: "center",
    "& svg": {
      marginRight: 16,
    },
    "& span": {
      color: theme.colors.white,
      "& span": { color: theme.colors.fourth },
    },
  },
  right: {
    display: "flex",
    alignItems: "center",
    marginTop: 12,

    [theme.breakpoints.up("sm")]: {
      marginTop: 0,
    },
  },
  connect: {
    background: theme.colors.secondary,
    borderRadius: 4,
    height: 40,
  },
  networkWrapper: {
    marginRight: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "fixed",
    zIndex: 90,
    top: 24,
    right: 24,
    outline: "none",
    color: theme.colors.white,
    background: "none",
    boxShadow: "none",
    border: `1px solid ${theme.colors.secondary}`,
    transition: "all 0.4s",
    "&:hover": { opacity: 0.7 },
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));

interface IProps {
  opened: boolean;
  onOpen: () => void;
}

export const Header = (props: IProps) => {
  const { opened, onOpen } = props;
  const classes = useStyles();
  const history = useHistory();
  const { account, setWalletConnectModalOpened, onDisconnect } =
    useConnectedWeb3Context();
  const yPosition = useScrollYPosition();

  const selectedMenuItem = useMemo(() => {
    const item = MENU_ITEMS.find(
      (item) =>
        !!matchPath(history.location.pathname, {
          path: item.href,
          exact: false,
        })
    );
    return item;
  }, [history.location.pathname]);

  const Icon = selectedMenuItem?.icon;

  return (
    <div className={clsx(classes.root, yPosition >= 30 && "blur-header")}>
      <div className={classes.title}>
        {Icon && <Icon />}
        <span>
          xtoken.<span>{selectedMenuItem?.label}</span>
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
          {account ? shortenAddress(account) : "Connect Account"}
        </Button>
      </div>
      <button className={classes.menuIcon} onClick={onOpen}>
        {opened ? <MenuOpenIcon /> : <MenuIcon />}
      </button>
    </div>
  );
};
