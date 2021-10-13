import { CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme: any) => ({
  root: { textAlign: "center", padding: 32 },
  loader: {
    color: theme.colors.primary,
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
