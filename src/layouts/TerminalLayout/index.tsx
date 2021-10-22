import { makeStyles } from "@material-ui/core";
import { Tabs } from "./components";

const useStyles = makeStyles((theme: any) => ({
  root: {},
  tabs: {
    height: 40,
  },
  content: {
    backgroundColor: theme.colors.sixth,
    borderRadius: 4,
    padding: 24,
  },
}));

interface IProps {
  children?: React.ReactNode[] | React.ReactNode;
}

export const TerminalLayout = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.tabs}>
        <Tabs />
      </div>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};
