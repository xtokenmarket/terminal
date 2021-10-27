import { makeStyles } from "@material-ui/core";
import { useTerminalPool } from "helpers";

const useStyles = makeStyles((theme: any) => ({
  root: {
    backgroundColor: theme.colors.primary400,
    borderRadius: 4,
    padding: 12,
    "&+&": {
      marginTop: 8,
    },
  },
}));

interface IProps {
  poolAddress: string;
  className?: string;
}

export const PoolTableItem = (props: IProps) => {
  const classes = useStyles();
  const { poolAddress } = props;
  const {} = useTerminalPool(poolAddress);

  return <div className={classes.root}></div>;
};
