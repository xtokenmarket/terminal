import { BigNumber } from "@ethersproject/bignumber";
import { Button, makeStyles, Typography } from "@material-ui/core";
import { useConnectedWeb3Context } from "contexts";
import { useIsMountedRef, useServices } from "helpers";
import { IWithdrawState } from "pages/TerminalPoolDetailsPage/components";
import { useEffect, useState } from "react";
import { ERC20Service, xAssetCLRService } from "services";
import { ITerminalPool } from "types";
import { ZERO } from "utils/number";
import { ActionStepRow, ViewTransaction, WarningInfo } from "..";

const useStyles = makeStyles((theme) => ({
  root: { backgroundColor: theme.colors.primary500 },
  header: {
    padding: 32,
    position: "relative",
    paddingBottom: 16,
  },
  title: {
    color: theme.colors.white,
    fontWeight: 600,
    fontSize: 22,
    marginBottom: 8,
  },
  description: {
    marginBottom: 24,
    color: theme.colors.white,
  },
  content: {
    padding: 32,
    paddingTop: 0,
  },
  warning: {
    padding: "16px !important",
    "& div": {
      "&:first-child": {
        marginTop: 0,
        marginRight: 16,
      },
      "& p": {
        fontSize: 14,
        marginTop: 3,
        "&:first-child": { fontSize: 16, marginTop: 0 },
      },
    },
  },
  actions: {
    marginTop: 32,
  },
  tokenIcon: {
    width: 24,
    height: 24,
    borderRadius: "50%",
  },
}));

interface IProps {
  onNext: () => void;
  withdrawState: IWithdrawState;
  poolData: ITerminalPool;
  updateState: (e: any) => void;
}

interface IState {
  withdrawDone: boolean;
  withdrawing: boolean;
  withdrawTx: string;
  step: number;
}

export const WithdrawSection = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    withdrawDone: false,
    withdrawing: false,
    withdrawTx: "",
    step: 1,
  });
  const { onNext, withdrawState, poolData, updateState } = props;
  const { multicall, lmService } = useServices();
  const { account, networkId, library: provider } = useConnectedWeb3Context();

  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    if (state.withdrawDone) {
      setTimeout(() => {
        onNext();
      }, 2000);
    }
  }, [state.withdrawDone]);

  const onWithdraw = async () => {
    if (!account || !provider) {
      return;
    }
    try {
      setState((prev) => ({
        ...prev,
        withdrawing: true,
      }));

      const txId = await lmService[
        withdrawState.withdrawOnly
          ? "removeLiquidity"
          : "removeLiquidityAndClaimReward"
      ](poolData.address, withdrawState.lpInput);
      const finalTxId = await lmService.waitUntilRemoveLiquidity(
        poolData.address,
        withdrawState.lpInput,
        account,
        txId
      );

      const data = await lmService.parseRemoveLiquidityTx(finalTxId);
      const xAssetCLR = new xAssetCLRService(
        provider,
        account,
        poolData.address
      );
      const totalLiquidity = await xAssetCLR.getTotalLiquidity();

      const claimedEarn: BigNumber[] = [];

      if (!withdrawState.withdrawOnly) {
        const claimInfo = await lmService.parseClaimTx(finalTxId);
        poolData.rewardTokens.forEach((rewardToken) => {
          const rewardAmount =
            claimInfo[rewardToken.address.toLowerCase()] || ZERO;
          claimedEarn.push(rewardAmount);
        });
      }

      if (data) {
        updateState({
          amount0Withdrawn: data.amount0,
          amount1Withdrawn: data.amount1,
          liquidityWithdrawn: data.liquidity,
          totalLiquidity,
          claimedEarn,
        });
      }

      setState((prev) => ({
        ...prev,
        withdrawing: false,
        withdrawTx: txId,
        withdrawDone: true,
      }));
    } catch (error) {
      console.error(error);
      setState((prev) => ({
        ...prev,
        withdrawing: false,
      }));
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>Withdraw Liquidity</Typography>
        <Typography className={classes.description}>
          Please complete all transactions to complete the withdraw.
        </Typography>
      </div>
      <div className={classes.content}>
        <WarningInfo
          className={classes.warning}
          title="Warning"
          description="Please, don’t close this window until the process is complete!"
        />
        <div className={classes.actions}>
          <ActionStepRow
            step={1}
            isActiveStep={state.step === 1}
            comment="Complete"
            title={withdrawState.withdrawOnly ? "Withdraw" : "Claim & Withdraw"}
            actionLabel={state.withdrawDone ? "Withdrew" : "Withdraw"}
            onConfirm={onWithdraw}
            actionPending={state.withdrawing}
            actionDone={state.withdrawDone}
            rightComponent={
              state.withdrawDone && state.withdrawTx !== "" ? (
                <ViewTransaction txId={state.withdrawTx} />
              ) : null
            }
          />
        </div>
      </div>
    </div>
  );
};
