import { Button, makeStyles, Typography } from "@material-ui/core";
import { useConnectedWeb3Context } from "contexts";
import { useIsMountedRef, useServices } from "helpers";
import { IDepositState } from "pages/TerminalPoolDetailsPage/components";
import { useEffect, useState } from "react";
import { ERC20Service, xAssetCLRService } from "services";
import { ITerminalPool } from "types";
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
  depositState: IDepositState;
  poolData: ITerminalPool;
  updateState: (e: any) => void;
}

interface IState {
  token0Approved: boolean;
  token0ApproveTx: string;
  token1Approved: boolean;
  token1ApproveTx: string;
  depositDone: boolean;
  token0Approving: boolean;
  token1Approving: boolean;
  depositing: boolean;
  depositTx: string;
  step: number;
}

export const DepositSection = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    token0Approved: false,
    token0ApproveTx: "",
    token0Approving: false,
    token1ApproveTx: "",
    token1Approved: false,
    token1Approving: false,
    depositDone: false,
    depositing: false,
    depositTx: "",
    step: 1,
  });
  const { onNext, depositState, poolData, updateState } = props;
  const { multicall, lmService } = useServices();
  const { account, networkId, library: provider } = useConnectedWeb3Context();

  const isMountedRef = useIsMountedRef();

  const loadInitialInfo = async () => {
    if (!account || !provider) {
      return;
    }
    try {
      const token0 = new ERC20Service(
        provider,
        account,
        poolData.token0.address
      );
      const token0Approved = await token0.hasEnoughAllowance(
        account,
        poolData.address,
        depositState.amount0Estimation
      );
      const token1 = new ERC20Service(
        provider,
        account,
        poolData.token1.address
      );
      const token1Approved = await token1.hasEnoughAllowance(
        account,
        poolData.address,
        depositState.amount1Estimation
      );
      if (isMountedRef.current === true) {
        let step = 1;
        if (token0Approved) step = 2;
        if (token1Approved) step = 3;
        setState((prev) => ({ ...prev, token0Approved, token1Approved, step }));
      }
    } catch (error) {}
  };

  useEffect(() => {
    loadInitialInfo();
  }, []);

  useEffect(() => {
    if (state.depositDone) {
      setTimeout(() => {
        onNext();
      }, 2000);
    }
  }, [state.depositDone]);

  const onApprove0 = async () => {
    if (!account || !provider) {
      return;
    }
    try {
      setState((prev) => ({
        ...prev,
        token0Approving: true,
      }));
      const token0 = new ERC20Service(
        provider,
        account,
        poolData.token0.address
      );
      const txHash = await token0.approveUnlimited(poolData.address);

      await token0.waitUntilApproved(account, poolData.address, txHash);

      setState((prev) => ({
        ...prev,
        token0Approving: false,
        token0Approved: true,
        step: 2,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        token0Approving: false,
      }));
    }
  };
  const onApprove1 = async () => {
    if (!account || !provider) {
      return;
    }
    try {
      setState((prev) => ({
        ...prev,
        token1Approving: true,
      }));
      const token1 = new ERC20Service(
        provider,
        account,
        poolData.token1.address
      );
      const txHash = await token1.approveUnlimited(poolData.address);

      await token1.waitUntilApproved(account, poolData.address, txHash);

      setState((prev) => ({
        ...prev,
        token1Approving: false,
        token1Approved: true,
        step: 3,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        token1Approving: false,
      }));
    }
  };
  const onDeposit = async () => {
    if (!account || !provider) {
      return;
    }
    try {
      setState((prev) => ({
        ...prev,
        depositing: true,
      }));

      const inputAsset = depositState.amount0.isZero() ? 1 : 0;
      const inputAmount = depositState.amount0.isZero()
        ? depositState.amount1
        : depositState.amount0;

      const txId = await lmService.provideLiquidity(
        poolData.address,
        inputAsset,
        inputAmount
      );
      const finalTxId = await lmService.waitUntilProvideLiquidity(
        poolData.address,
        inputAsset,
        inputAmount,
        account,
        txId
      );

      const data = await lmService.parseProvideLiquidityTx(finalTxId);
      const xAssetCLR = new xAssetCLRService(
        provider,
        account,
        poolData.address
      );
      const totalLiquidity = await xAssetCLR.getTotalLiquidity();
      if (data) {
        updateState({
          amount0Used: data.amount0,
          amount1Used: data.amount1,
          liquidityAdded: data.liquidity,
          totalLiquidity,
        });
      }

      setState((prev) => ({
        ...prev,
        depositing: false,
        depositTx: txId,
        depositDone: true,
      }));
    } catch (error) {
      console.error(error);
      setState((prev) => ({
        ...prev,
        depositing: false,
      }));
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>Deposit Liquidity</Typography>
        <Typography className={classes.description}>
          Please complete all transactions to complete the deposit.
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
            comment="Approve"
            title={poolData.token0.symbol}
            actionLabel={state.token0Approved ? "APPROVED" : "APPROVE"}
            onConfirm={onApprove0}
            actionPending={state.token0Approving}
            actionDone={state.token0Approved}
            titleIcon={
              <img
                alt="token"
                className={classes.tokenIcon}
                src={poolData.token0.image}
              />
            }
            rightComponent={
              state.token0Approved && state.token0ApproveTx !== "" ? (
                <ViewTransaction txId={state.token0ApproveTx} />
              ) : null
            }
          />
          <ActionStepRow
            step={2}
            isActiveStep={state.step === 2}
            comment="Approve"
            title={poolData.token1.symbol}
            actionLabel={state.token1Approved ? "APPROVED" : "APPROVE"}
            onConfirm={onApprove1}
            actionPending={state.token1Approving}
            actionDone={state.token1Approved}
            titleIcon={
              <img
                alt="token"
                className={classes.tokenIcon}
                src={poolData.token1.image}
              />
            }
            rightComponent={
              state.token1Approved && state.token1ApproveTx !== "" ? (
                <ViewTransaction txId={state.token1ApproveTx} />
              ) : null
            }
          />
          <ActionStepRow
            step={3}
            isActiveStep={state.step === 3}
            comment="Complete"
            title="Deposit"
            actionLabel={state.depositDone ? "Deposited" : "Deposit"}
            onConfirm={onDeposit}
            actionPending={state.depositing}
            actionDone={state.depositDone}
            rightComponent={
              state.depositDone && state.depositTx !== "" ? (
                <ViewTransaction txId={state.depositTx} />
              ) : null
            }
          />
        </div>
      </div>
    </div>
  );
};
