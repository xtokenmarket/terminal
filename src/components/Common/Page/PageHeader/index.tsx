import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "26px 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderBottom: `1px solid ${theme.colors.primary200}`,
  },
  backWrapper: {
    display: "flex",
    position: "absolute",
    left: 0,
    cursor: "pointer",
    transition: "all 0.4s",
    "&:hover": {
      opacity: 0.7,
    },
  },
  backIcon: {},
  backText: {
    color: theme.colors.primary100,
    marginLeft: 16,
  },
  title: {
    fontSize: 18,
    color: theme.colors.white,
    fontWeight: 700,
  },
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
        <span
          className={classes.backWrapper}
          onClick={props.onBack || (() => {})}
        >
          <img
            alt="icon"
            src="/assets/icons/back.svg"
            className={classes.backIcon}
          />
          <span className={classes.backText}>Back</span>
        </span>
      ) : null}
      {props.headerTitle ? (
        <Typography className={classes.title}>{props.headerTitle}</Typography>
      ) : null}
      {props.headerComponent ? <>{props.headerComponent}</> : null}
    </div>
  );
};
