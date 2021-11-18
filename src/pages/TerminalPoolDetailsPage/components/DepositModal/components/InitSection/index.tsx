import { Button, makeStyles, Typography } from "@material-ui/core";
import { transparentize } from "polished";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 32,
  },
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
  button: { height: 48, marginTop: 24 },
}));

interface IProps {
  onNext: () => void;
}

export const InitSection = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.noteWrapper}>
        <div className={classes.noteIcon}>
          <ReportProblemOutlinedIcon />
        </div>
        <div>
          <Typography className={classes.noteTitle}>
            Trade at your own risk!
          </Typography>
          <Typography className={classes.noteDescription}>
            xToken Terminal is a permissionless platform. Please do proper due
            diligence on the token and project before providing liquidity to a
            pool.
          </Typography>
        </div>
      </div>
      <Button
        className={classes.button}
        color="primary"
        fullWidth
        onClick={props.onNext}
        variant="contained"
      >
        CONTINUE
      </Button>
    </div>
  );
};
