import {
  makeStyles,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@material-ui/core";

import clsx from "clsx";

const useStyles = makeStyles((theme: any) => ({
  root: {
    display: "flex",
    alignItems: "center",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    border: `1px solid ${theme.colors.fourth} `,
    borderRadius: 4,
    marginBottom: 16,
    padding: "8px 12px ",
    "& input": {
      color: theme.colors.white,
    },
    [theme.breakpoints.up("sm")]: {
      width: "50%",
      marginBottom: 0,
      marginRight: 32,
    },
  },
  checkLabel: {
    marginLeft: 0,
    color: theme.colors.fourth,
    "& + &": {
      marginLeft: 16,
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
        control={<Checkbox />}
        label="Staked Only"
      />
      <FormControlLabel
        className={classes.checkLabel}
        control={<Checkbox />}
        label="Staked Ended"
      />
    </div>
  );
};
