import { Button, makeStyles, Typography } from "@material-ui/core";
import { transparentize } from "polished";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  noteWrapper: {
    padding: 16,
    backgroundColor: transparentize(0.7, theme.colors.primary200),
    border: `2px solid ${theme.colors.primary200}`,
    borderRadius: 4,
    display: "flex",
    [theme.breakpoints.down(theme.custom.xss)]: {
      flexDirection: "column",
    },
  },
  noteIcon: {
    backgroundColor: theme.colors.primary200,
    width: 40,
    height: 40,
    marginRight: 16,
    borderRadius: 4,
    display: "flex",
    color: theme.colors.white,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 40,
    [theme.breakpoints.down(theme.custom.xss)]: {
      marginTop: 0,
      alignSelf: "center",
      marginBottom: 12,
    },
    "& img": {
      width: 24,
      height: 24,
    },
  },
  noteTitle: { fontSize: 16, color: theme.colors.white, fontWeight: 600 },
  noteDescription: { color: theme.colors.white, marginTop: 3, fontSize: 14 },
}));

interface IProps {
  title: string;
  description: string;
  className?: string;
}

export const WarningInfo = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.noteWrapper, props.className)}>
      <div className={classes.noteIcon}>
        <img alt="info" src="/assets/icons/info.svg" />
      </div>
      <div>
        <Typography className={classes.noteTitle}>{props.title}</Typography>
        <Typography className={classes.noteDescription}>
          {props.description}
        </Typography>
      </div>
    </div>
  );
};
