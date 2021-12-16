import { makeStyles } from "@material-ui/core";
import { useConnectedWeb3Context } from "contexts";
import { getEtherscanUri } from "config/networks";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: theme.colors.primary100,
    "& span": {
      marginRight: 8,
      borderBottom: `1px solid ${theme.colors.primary200}`,
      fontSize: 14,
    },
  },
}));

export const ViewTransaction = (props: { txId: string }) => {
  const classes = useStyles();
  const { networkId } = useConnectedWeb3Context();
  const etherscanUri = getEtherscanUri(networkId);
  return (
    <a
      href={`${etherscanUri}tx/${props.txId}`}
      className={classes.root}
      target="_blank"
      rel="noreferrer"
    >
      <span>View transaction</span>
      <img alt="expand" src="/assets/icons/expand.png" />
    </a>
  );
};
