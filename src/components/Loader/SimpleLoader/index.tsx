import { makeStyles, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme: any) => ({
  root: { textAlign: "center", padding: 32 },
  loader: {
    color: theme.colors.white,
  },
}));

export const SimpleLoader = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress className={classes.loader} />
    </div>
  );
};
