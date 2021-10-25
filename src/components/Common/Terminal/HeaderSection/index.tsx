import {
  makeStyles,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  InputAdornment,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    marginBottom: 36,
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
  right: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      flex: "unset",
      width: "100%",
    },
    [theme.breakpoints.down("xs")]: {
      flexWrap: "wrap",
    },
  },
  tmp: { flex: 1 },
  button: {
    height: 40,
    backgroundColor: theme.colors.secondary1,
    "& span": {
      fontSize: 14,
      color: theme.colors.black1,
      fontWeight: 600,
    },
  },
  input: {
    width: "100%",
    border: `1px solid ${theme.colors.fourth} `,
    borderRadius: 4,
    padding: "8px 12px ",
    "& input": {
      color: theme.colors.white,
    },
    flex: 1,
    marginRight: 16,
    [theme.breakpoints.down("md")]: {
      flex: "unset",
      width: "100%",
      marginBottom: 16,
      marginRight: 0,
    },
  },
  checkLabel: {
    marginLeft: 0,
    color: theme.colors.fourth,
    "& span": { fontSize: 14 },
  },
  checkIcon: { padding: 4 },
  searchIcon: { color: theme.colors.eighth },
}));

interface IProps {}

export const HeaderSection = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TextField
        className={classes.input}
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className={classes.searchIcon} />
            </InputAdornment>
          ),
        }}
        variant="standard"
        color="primary"
        placeholder="Search by token name, symbol, or address"
      />
      <div className={classes.right}>
        <FormControlLabel
          className={classes.checkLabel}
          control={<Checkbox />}
          label="Staked Only"
        />
        <FormControlLabel
          className={classes.checkLabel}
          control={<Checkbox className={classes.checkIcon} />}
          label="Staked Ended"
        />
        <div className={classes.tmp} />
        <Button variant="contained" color="primary" className={classes.button}>
          CREATE POOL
        </Button>
      </div>
    </div>
  );
};
