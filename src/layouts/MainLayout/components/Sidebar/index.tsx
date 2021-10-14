import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { MENU_ITEMS, SOCIAL_ITEMS } from "config/layout";
import { NavLink, useHistory, matchPath } from "react-router-dom";

const useStyles = makeStyles((theme: any) => ({
  root: {
    backgroundColor: theme.colors.secondary,
    boxShadow: theme.colors.elevation1,
    position: "fixed",
    top: 0,
    bottom: 0,
    transition: "all 0.5s",
    overflowY: "auto",
    zIndex: 99,
    "&::-webkit-scrollbar": {
      width: 0,
    },
    [theme.breakpoints.down(theme.custom.smd)]: {
      left: 0,
      width: 0,
      "&.visible": {
        width: theme.custom.desktopNavbarWidth,
      },
    },
    [theme.breakpoints.up(theme.custom.smd)]: {
      left: 0,
      width: theme.custom.tabletNavbarWidth,
      "&:hover": {
        width: theme.custom.desktopNavbarWidth,
      },
    },
    [theme.breakpoints.up("lg")]: {
      left: 0,
      width: theme.custom.desktopNavbarWidth,
    },
  },
  backDrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: "none",
    [theme.breakpoints.down(theme.custom.smd)]: {
      "&.visible": {
        display: "block",
      },
    },
  },
  content: {
    height: "100%",
    minHeight: 650,
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
    padding: 20,
  },
  header: {
    padding: 4,
    margin: "20px 0",
  },
  logoWrapper: {
    display: "flex",
    alignItems: "center",
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
    "& + &": {
      marginTop: 16,
    },
    display: "flex",
    alignItems: "center",

    textDecoration: "none",

    "& .menu-item-icon-wrapper": {
      borderRadius: 4,
      width: 40,
      minWidth: 40,
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
      color: theme.colors.fourth,
      transition: "all 0.4s",
      "& svg": {
        width: 20,
        height: 20,
        "& g": { opacity: 0.6 },
      },
    },

    "& span": {
      textTransform: "uppercase",
      marginLeft: 20,
      color: theme.colors.fourth,
      transition: "all 0.4s",
    },

    "&:hover": {
      "& .menu-item-icon-wrapper": {
        backgroundColor: theme.colors.third,
        color: theme.colors.white,
        "& svg": {
          "& g": { opacity: 1 },
        },
      },
      "& span": {
        color: theme.colors.white,
      },
    },
  },
}));

interface IProps {
  opened: boolean;
  onClose: () => void;
}

export const Sidebar = (props: IProps) => {
  const classes = useStyles();
  const { opened, onClose } = props;
  const history = useHistory();

  return (
    <>
      <div className={clsx(classes.root, opened ? "visible" : "")}>
        <div onClick={(e) => e.stopPropagation()} className={classes.content}>
          <div className={classes.header}>
            <div className={classes.logoWrapper}>
              <img alt="logo" src="/assets/logo.png" className={classes.logo} />
              <Typography className={classes.logoLabel}>XTOKEN</Typography>
            </div>
          </div>
          <div className={classes.body}>
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  isActive={() =>
                    !!matchPath(history.location.pathname, { path: item.href })
                  }
                  to={item.href}
                  key={item.href}
                  className={classes.item}
                  onClick={onClose}
                >
                  <div className="menu-item-icon-wrapper">
                    <Icon />
                  </div>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
          <div className={classes.footer}>
            {SOCIAL_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={item.href}
                  key={item.href}
                  className={classes.item}
                  onClick={onClose}
                >
                  <div className="menu-item-icon-wrapper">
                    <Icon />
                  </div>
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <div
        className={clsx(classes.backDrop, opened ? "visible" : "")}
        onClick={onClose}
      ></div>
    </>
  );
};
