import { makeStyles } from "@material-ui/core";
import { SimpleLoader } from "components";
import { useTerminalPool } from "helpers";

const useStyles = makeStyles((theme: any) => ({
  root: {
    backgroundColor: theme.colors.primary400,
    borderRadius: 4,

    "&+&": {
      marginTop: 8,
    },
  },
  content: { display: "flex" },
  item: {
    color: theme.colors.fourth,
    fontSize: 11,
    display: "flex",
    alignItems: "center",
  },
}));

interface IProps {
  poolAddress: string;
  className?: string;
}

export const PoolTableItem = (props: IProps) => {
  const classes = useStyles();
  const { poolAddress } = props;
  const { pool: poolData, loading } = useTerminalPool(poolAddress);

  const renderContent = () => {
    if (!poolData) {
      return null;
    }
    console.log("===data=", poolData);
    return <div className={classes.content}></div>;
  };

  return (
    <div className={classes.root}>
      {!poolData && loading ? <SimpleLoader /> : null}
      {poolData ? renderContent() : null}
    </div>
  );
};
