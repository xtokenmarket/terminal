import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

interface IProps {
  onNext: () => void;
}

export const ConfirmSection = (props: IProps) => {
  const classes = useStyles();

  return <div className={classes.root}></div>;
};
