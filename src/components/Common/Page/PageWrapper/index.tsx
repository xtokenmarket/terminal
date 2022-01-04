import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.primary500,
    borderRadius: 4,
    padding: theme.spacing(0, 4),
    [theme.breakpoints.down("xs")]: {
      backgroundColor: theme.colors.transparent,
      padding: 0,
    },
  },
}));

interface IProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const PageWrapper = (props: IProps) => {
  const classes = useStyles();

  return <div className={classes.root}>{props.children}</div>;
};
