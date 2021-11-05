import { makeStyles, Button, Select, MenuItem } from "@material-ui/core";
import clsx from "clsx";
import { ENetwork } from "utils/enums";

const useStyles = makeStyles((theme) => ({
  root: {
    "& svg": {
      color: theme.colors.eighth,
    },
  },
  item: {
    display: "flex",
    alignItems: "center",
    "& img": {
      width: 24,
      height: 24,
      marginRight: 6,
    },
  },
  input: {
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.colors.primary600,
    paddingLeft: 8,
    paddingTop: 8,
    paddingBottom: 8,
    "& img": {
      width: 24,
      height: 24,
      marginRight: 6,
    },
    [theme.breakpoints.down("xs")]: {
      backgroundColor: theme.colors.primary,
      "& span": {
        display: "none",
      },
    },
  },
  paper: { backgroundColor: theme.colors.fifth },
  list: { backgroundColor: theme.colors.fifth, color: theme.colors.white },
}));

interface IProps {
  className?: string;
  network: ENetwork;
}

export const NetworkSelector = (props: IProps) => {
  const classes = useStyles();

  return (
    <Select
      value={props.network}
      className={clsx(classes.root, props.className)}
      disableUnderline
      classes={{
        root: classes.input,
      }}
      MenuProps={{
        PaperProps: {
          className: classes.paper,
        },
        classes: {
          list: classes.list,
        },
      }}
    >
      {Object.values(ENetwork).map((network) => {
        return (
          <MenuItem value={network} key={network} className={classes.item}>
            <img alt="img" src={`/assets/networks/${network}.svg`} />
            <span>{network}</span>
          </MenuItem>
        );
      })}
    </Select>
  );
};
