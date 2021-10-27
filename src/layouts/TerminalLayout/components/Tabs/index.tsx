import { makeStyles } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { useHistory, matchPath } from "react-router-dom";

const useStyles = makeStyles((theme: any) => ({
  root: {
    height: "100%",
    display: "flex",
    alignItems: "center",
  },
  item: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 24px",
    textDecoration: "none",
    backgroundColor: theme.colors.primary500,
    color: theme.colors.fourth,
    height: "100%",
    transition: "all 0.4s",
    boxShadow: theme.colors.elevation3,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    "&+&": {
      marginLeft: 4,
    },
    "&:hover": { color: theme.colors.white, boxShadow: "none" },
    "&.active": {
      color: theme.colors.white,
      boxShadow: "none",
    },
  },
}));

const tabs = [
  { id: "discover", href: "/terminal/discover", label: "Discover" },
  { id: "my-pool", href: "/terminal/my-pool", label: "My Pool" },
  { id: "about", href: "/terminal/about", label: "About" },
];

export const Tabs = () => {
  const classes = useStyles();
  const history = useHistory();

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
  );
};
