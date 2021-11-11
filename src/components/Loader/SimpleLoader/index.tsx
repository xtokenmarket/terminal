import { makeStyles, CircularProgress } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles((theme: any) => ({
  root: { textAlign: "center", padding: 32 },
  loader: {
    color: theme.colors.white,
  },
}));

interface IProps {
  className?: string;
}

export const SimpleLoader = (props: IProps) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, props.className)}>
      <CircularProgress className={classes.loader} />
    </div>
  );
};
