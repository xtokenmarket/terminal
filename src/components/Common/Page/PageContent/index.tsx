import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "26px 0",
    position: "relative",
  },
}));

interface IProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const PageContent = (props: IProps) => {
  const classes = useStyles();

  return <div className={classes.root}>{props.children}</div>;
};
