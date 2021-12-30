import { BigNumber } from "@ethersproject/bignumber";
import { makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";
import { TokenIcon } from "components";
import { ETHER_DECIMAL } from "config/constants";
import { IRewardState } from "pages/PoolDetails/components";
import { ITerminalPool } from "types";
import { formatBigNumber } from "utils";
import { ZERO } from "utils/number";

const useStyles = makeStyles((theme) => ({
  root: {},
  estimation: {
    backgroundColor: theme.colors.primary400,
    padding: "24px 32px",
  },
  label: {
    color: theme.colors.primary100,
    marginBottom: 8,
    fontSize: 12,
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
  rewardState: IRewardState;
  amounts: BigNumber[];
}

export const OutputEstimation = (props: IProps) => {
  const classes = useStyles();
  const { poolData, rewardState, amounts } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.estimation}>
        <Typography className={classes.label}>REWARDS PERIOD</Typography>
        <Typography className={classes.amount}>
          {rewardState.period} weeks
        </Typography>
        <br />
        <Typography className={classes.label}>REWARDS AMOUNTS</Typography>
        {poolData.rewardTokens.map((rewardToken, index) => {
          return (
            <div className={classes.infoRow} key={rewardToken.address}>
              <div>
                <TokenIcon token={rewardToken} className={classes.tokenIcon} />
              </div>
              &nbsp;&nbsp;
              <Typography className={classes.amount}>
                {formatBigNumber(amounts[index], rewardToken.decimals, 4)}
                &nbsp;
                <span>~ $13.009</span>
              </Typography>
            </div>
          );
        })}
      </div>
    </div>
  );
};
