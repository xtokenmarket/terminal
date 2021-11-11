import {
  makeStyles,
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import { NavLink } from "react-router-dom";

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
    margin: "0 -4px",
    [theme.breakpoints.down("md")]: {
      flex: "unset",
      width: "100%",
    },
    [theme.breakpoints.down("xs")]: {
      flexWrap: "wrap",
    },
  },
  tmp: { flex: 1 },
  link: {
    height: 40,
    backgroundColor: theme.colors.secondary,
    margin: 4,
    fontSize: 14,
    color: theme.colors.primary700,
    fontWeight: 600,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 4,
    justifyContent: "center",
    padding: "0 20px",
  },
  input: {
    width: "100%",
    border: `1px solid ${theme.colors.purple0} `,
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
    margin: 4,
    color: theme.colors.purple0,
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
        <NavLink to="/terminal/new-pool" className={classes.link}>
          <AddIcon />
          &nbsp; CREATE
        </NavLink>
      </div>
    </div>
  );
};
