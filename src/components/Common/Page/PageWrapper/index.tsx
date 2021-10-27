import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.primary500,
    padding: "0 32px",
  },
}));

interface IProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const PageWrapper = (props: IProps) => {
  const classes = useStyles();

  return <div className={classes.root}>{props.children}</div>;
};
