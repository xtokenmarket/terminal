import { CheckBox } from "@mui/icons-material";
import { FormControlLabel, Input, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme: any) => ({
  root: {
    display: "flex",
    alignItems: "center",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    border: `1px solid ${theme.colors.fourth} !important`,
    borderRadius: 4,
    marginBottom: `16px !important`,
    padding: "8px 12px !important",
    "& input": {
      color: `${theme.colors.white} !important`,
    },
    [theme.breakpoints.up("sm")]: {
      width: "50%",
      marginBottom: `0 !important`,
      marginRight: `32px !important`,
    },
  },
  checkLabel: {
    marginLeft: "0 !important",
    color: theme.colors.fourth,
    "& + &": {
      marginLeft: "16px !important",
    },
  },
}));

interface IProps {}

export const HeaderSection = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TextField
        className={classes.input}
        InputProps={{ disableUnderline: true }}
        variant="standard"
        color="primary"
        placeholder="Search by token name, symbol, or address"
      />
      <FormControlLabel
        className={classes.checkLabel}
        control={<CheckBox />}
        label="Staked Only"
      />
      <FormControlLabel
        className={classes.checkLabel}
        control={<CheckBox />}
        label="Staked Ended"
      />
    </div>
  );
};
