import { makeStyles } from "@material-ui/core";

import { useState } from "react";

import { Sidebar, Header } from "./components";

const useStyles = makeStyles((theme: any) => ({
  root: {
    backgroundImage: "url(/assets/imgs/bg.png)",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right",
    backgroundSize: "contain",
  },
  content: {
    padding: "0 24px",
    paddingTop: theme.custom.appHeaderHeight * 1.2,
    paddingBottom: 16,
    // [theme.breakpoints.up("sm")]: { paddingTop: theme.custom.appHeaderHeight },
    [theme.breakpoints.up("sm")]: {
      paddingRight: 36,
      paddingLeft: `calc(${theme.custom.tabletNavbarWidth}px + 36px)`,
    },
    [theme.breakpoints.up("lg")]: {
      paddingRight: 48,
      paddingLeft: `calc(${theme.custom.desktopNavbarWidth}px + 48px)`,
    },
  },
  childrenWrapper: {
    padding: "6px 0",
  },
}));

interface IProps {
  children?: React.ReactNode[] | React.ReactNode;
}

export const MainLayout = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Sidebar />
      <Header />
      <div className={classes.content}>
        <div className={classes.childrenWrapper}>{props.children}</div>
      </div>
    </div>
  );
};
