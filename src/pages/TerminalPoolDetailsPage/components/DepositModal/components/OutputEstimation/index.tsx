import { makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";
import { TokenIcon } from "components";
import { ETHER_DECIMAL } from "config/constants";
import { IDepositState } from "pages/TerminalPoolDetailsPage/components";
import { ITerminalPool } from "types";
import { formatBigNumber } from "utils";

const useStyles = makeStyles((theme) => ({
  root: {},
  estimation: {
    backgroundColor: theme.colors.primary400,
    padding: "24px 32px",
  },
  label: {
    color: theme.colors.primary100,
    marginBottom: 8,
  },
  infoRow: {
    margin: "0 -4px",
    display: "flex",
    alignItems: "center",
    marginBottom: 8,
  },
  tokenIcon: {
    width: 36,
    height: 36,
    border: `4px solid ${theme.colors.transparent}`,
    "&+&": {
      borderColor: theme.colors.primary500,
      position: "relative",
      left: -12,
    },
  },
  amount: {
    fontSize: 24,
    fontWeight: 600,
    color: theme.colors.white,
    "& span": {
      fontSize: 14,
      fontWeight: 600,
      color: theme.colors.primary100,
    },
  },
}));

interface IProps {
  className?: string;
  poolData: ITerminalPool;
  depositState: IDepositState;
}

export const OutputEstimation = (props: IProps) => {
  const classes = useStyles();
  const { poolData, depositState } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.estimation}>
        <Typography className={classes.label}>
          {poolData.token0.symbol}/{poolData.token1.symbol} LP YOU WILL RECEIVE
        </Typography>
        <div className={classes.infoRow}>
          <div>
            <TokenIcon token={poolData.token0} className={classes.tokenIcon} />
            <TokenIcon token={poolData.token1} className={classes.tokenIcon} />
          </div>
          &nbsp;&nbsp;
          <Typography className={classes.amount}>
            {formatBigNumber(depositState.lpEstimation, ETHER_DECIMAL, 4)}&nbsp;
            <span>~ $13.009</span>
          </Typography>
        </div>
        <Typography className={classes.label}>YOU WILL DEPOSIT</Typography>
        <div className={classes.infoRow}>
          <TokenIcon token={poolData.token0} className={classes.tokenIcon} />
          &nbsp;&nbsp;
          <Typography className={classes.amount}>
            {formatBigNumber(
              depositState.amount0Estimation,
              poolData.token0.decimals,
              4
            )}
            &nbsp;
            <span>~ $13.009</span>
          </Typography>
        </div>
        <div className={classes.infoRow}>
          <TokenIcon token={poolData.token1} className={classes.tokenIcon} />
          &nbsp;&nbsp;
          <Typography className={classes.amount}>
            {formatBigNumber(
              depositState.amount1Estimation,
              poolData.token1.decimals,
              4
            )}
            &nbsp;
            <span>~ $13.009</span>
          </Typography>
        </div>
        <Typography className={classes.label}>SHARE OF POOL</Typography>
        <div>
          <Typography className={classes.amount}>
            {depositState.totalLiquidity.isZero()
              ? "-"
              : `${
                  depositState.lpEstimation
                    .mul(1000000)
                    .div(depositState.totalLiquidity)
                    .toNumber() / 10000
                }%`}
          </Typography>
        </div>
      </div>
    </div>
  );
};
