import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "26px 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  backWrapper: {},
  backIcon: {},
  backText: {},
  title: {},
}));

interface IProps {
  headerComponent?: React.ReactNode | React.ReactNode[];
  headerTitle?: string;
  backVisible?: boolean;
  onBack?: () => void;
}

export const PageHeader = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {props.backVisible ? (
        <button
          className={classes.backWrapper}
          onClick={props.onBack || (() => {})}
        >
          <img
            alt="icon"
            src="/assets/icons/back.svg"
            className={classes.backIcon}
          />
          <span className={classes.backText}>Back</span>
        </button>
      ) : null}
      {props.headerTitle ? (
        <Typography className={classes.title}>{props.headerTitle}</Typography>
      ) : null}
      {props.headerComponent ? <>{props.headerComponent}</> : null}
    </div>
  );
};
