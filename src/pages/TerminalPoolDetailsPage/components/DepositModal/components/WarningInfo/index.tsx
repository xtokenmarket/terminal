import { Button, makeStyles, Typography } from "@material-ui/core";
import { transparentize } from "polished";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  noteWrapper: {
    padding: 24,
    backgroundColor: transparentize(0.65, theme.colors.warn2),
    border: `2px solid ${theme.colors.warn1}`,
    borderRadius: 4,
    display: "flex",
    [theme.breakpoints.down(theme.custom.xss)]: {
      flexDirection: "column",
    },
  },
  noteIcon: {
    backgroundColor: theme.colors.warn1,
    width: 40,
    height: 40,
    marginRight: 24,
    borderRadius: 4,
    display: "flex",
    color: theme.colors.white,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 40,
    marginTop: 12,
    [theme.breakpoints.down(theme.custom.xss)]: {
      marginTop: 0,
      alignSelf: "center",
    },
  },
  noteTitle: { fontSize: 22, color: theme.colors.white, fontWeight: 600 },
  noteDescription: { color: theme.colors.white, marginTop: 8 },
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
        <ReportProblemOutlinedIcon />
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
