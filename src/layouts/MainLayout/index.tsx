import { makeStyles } from "@mui/styles";
import { useState } from "react";

import { Sidebar, Header } from "./components";

const useStyles = makeStyles((theme: any) => ({
  root: {},
  content: {
    padding: "0 24px",
    paddingTop: theme.custom.appHeaderHeight,
    [theme.breakpoints.up(theme.custom.smd)]: {
      paddingRight: 36,
      paddingLeft: `calc(${theme.custom.tabletNavbarWidth}px + 48px)`,
    },
    [theme.breakpoints.up("md")]: {
      paddingRight: 48,
      paddingLeft: `calc(${theme.custom.desktopNavbarWidth}px + 48px)`,
    },
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
      <Header />
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};
