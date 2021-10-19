import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { makeStyles } from "@mui/styles";
import { matchPath, useHistory } from "react-router";
import { useMemo } from "react";
import { MENU_ITEMS } from "config/layout";
import { useConnectedWeb3Context } from "contexts";
import { Button } from "@mui/material";
import { shortenAddress } from "utils";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

const useStyles = makeStyles((theme: any) => ({
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
    backgroundColor: theme.colors.primary,
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
    background: `${theme.colors.secondary} !important`,
    borderRadius: 4,
  },
  networkWrapper: {
    marginRight: 16,
    height: 36,
    display: "flex",
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: theme.colors.fifth,
    padding: 8,
    color: theme.colors.fourth,
    "& img": {
      marginRight: 6,
      width: 24,
      height: 24,
    },
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
  const { account, networkId, setWalletConnectModalOpened, onDisconnect } =
    useConnectedWeb3Context();

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
    <div className={classes.root}>
      <div className={classes.title}>
        {Icon && <Icon />}
        <span>
          xtoken.<span>{selectedMenuItem?.label}</span>
        </span>
      </div>
      <div className={classes.right}>
        {account && (
          <div className={classes.networkWrapper}>
            <img src="/assets/tokens/ethereum.svg" /> <span>Ethereum</span>
          </div>
        )}
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
