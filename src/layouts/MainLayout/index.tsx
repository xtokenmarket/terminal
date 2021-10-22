import { makeStyles } from "@material-ui/core";

import { useState } from "react";

import { Sidebar, Header } from "./components";

const useStyles = makeStyles((theme: any) => ({
  root: {
    backgroundImage: "url(/assets/imgs/bg.svg)",
  },
  content: {
    padding: "0 24px",
    paddingTop: theme.custom.appHeaderHeight * 1.2,
    paddingBottom: 16,
    [theme.breakpoints.up("sm")]: { paddingTop: theme.custom.appHeaderHeight },
    [theme.breakpoints.up(theme.custom.smd)]: {
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

interface IState {
  sidebarOpened: boolean;
}

export const MainLayout = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ sidebarOpened: false });

  const setSidebarOpened = (sidebarOpened: boolean) =>
    setState((prev) => ({ ...prev, sidebarOpened }));

  return (
    <div className={classes.root}>
      <Sidebar
        opened={state.sidebarOpened}
        onClose={() => setSidebarOpened(false)}
      />
      <Header
        opened={state.sidebarOpened}
        onOpen={() => setSidebarOpened(true)}
      />
      <div className={classes.content}>
        <div className={classes.childrenWrapper}>{props.children}</div>
      </div>
    </div>
  );
};
