import { BigNumber } from "@ethersproject/bignumber";
import { makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";
import { TokenIcon } from "components";
import { ETHER_DECIMAL } from "config/constants";
import { IDepositState } from "pages/TerminalPoolDetailsPage/components";
import { ITerminalPool } from "types";
import { formatBigNumber, getTimeDurationStr } from "utils";
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
  isEstimation?: boolean;
  earned: BigNumber[];
}

export const OutputEstimation = (props: IProps) => {
  const classes = useStyles();
  const { poolData, earned } = props;
  const isEstimation =
    props.isEstimation !== undefined ? props.isEstimation : true;

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.estimation}>
        <Typography className={classes.label}>
          {isEstimation ? "AVAILABLE TO VEST" : "YOU VESTED"}
        </Typography>
        {poolData.rewardTokens.map((rewardToken, index) => {
          return (
            <div className={classes.infoRow} key={rewardToken.address}>
              <div>
                <TokenIcon token={rewardToken} className={classes.tokenIcon} />
              </div>
              &nbsp;&nbsp;
              <Typography className={classes.amount}>
                {formatBigNumber(
                  earned[index] || ZERO,
                  rewardToken.decimals,
                  4
                )}
                &nbsp;
                <span>~ $13.009</span>
              </Typography>
            </div>
          );
        })}
        {isEstimation && (
          <>
            <Typography className={classes.label}>VESTING PERIOD</Typography>
            <Typography className={classes.amount}>
              {getTimeDurationStr(poolData.rewardsDuration.toNumber())}
            </Typography>
          </>
        )}
      </div>
    </div>
  );
};
