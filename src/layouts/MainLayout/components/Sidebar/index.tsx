import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme: any) => ({
  root: {
    backgroundColor: theme.colors.secondary,
    boxShadow: theme.colors.elevation1,
    position: "fixed",
    top: 0,
    bottom: 0,
    transition: "all 0.5s",
    [theme.breakpoints.down(theme.custom.smd)]: {
      left: 0,
      width: 0,
    },
    [theme.breakpoints.up(theme.custom.smd)]: {
      left: 0,
      width: theme.custom.tabletNavbarWidth,
    },
    [theme.breakpoints.up("md")]: {
      left: 0,
      width: theme.custom.desktopNavbarWidth,
    },
  },
}));

interface IProps {
  opened: boolean;
  onClose: () => void;
}

export const Sidebar = (props: IProps) => {
  const classes = useStyles();
  const { opened, onClose } = props;

  return <div className={classes.root}></div>;
};
