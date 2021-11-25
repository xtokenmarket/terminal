import clsx from "clsx";
import { makeStyles, Modal } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { EWithdrawStep } from "utils/enums";
import { WithdrawSection, InputSection, SuccessSection } from "./components";
import { ITerminalPool } from "types";
import { BigNumber } from "@ethersproject/bignumber";
import { ZERO } from "utils/number";
import useCommonStyles from "style/common";
import { useConnectedWeb3Context } from "contexts";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    width: "90vw",
    maxWidth: 600,
    backgroundColor: theme.colors.primary500,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    outline: "none",
    maxHeight: "80vh",
    userSelect: "none",
    overflowY: "auto",
    "&.transparent": {
      backgroundColor: theme.colors.transparent,
    },
  },
}));

interface IProps {
  className?: string;
  onClose: () => void;
  poolData: ITerminalPool;
  onSuccess: () => Promise<void>;
}

export interface IWithdrawState {
  step: EWithdrawStep;
  lpInput: BigNumber;
  amount0Estimation: BigNumber;
  amount1Estimation: BigNumber;
  totalLiquidity: BigNumber;
  //
  userLP: BigNumber;
  // used
  amount0Withdrawn: BigNumber;
  amount1Withdrawn: BigNumber;
  liquidityWithdrawn: BigNumber;
  claimedEarn: BigNumber[];
  //
  earned: BigNumber[];
  //
  withdrawOnly: boolean;
}

export const WithdrawModal = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { account } = useConnectedWeb3Context();

  const { onClose } = props;
  const [state, setState] = useState<IWithdrawState>({
    step: EWithdrawStep.Input,
    lpInput: ZERO,
    amount0Estimation: ZERO,
    amount1Estimation: ZERO,
    userLP: ZERO,
    totalLiquidity: ZERO,
    amount0Withdrawn: ZERO,
    amount1Withdrawn: ZERO,
    liquidityWithdrawn: ZERO,
    earned: [],
    claimedEarn: [],
    withdrawOnly: false,
  });

  useEffect(() => {
    if (!account) {
      onClose();
    }
  }, [account]);

  const updateState = (e: any) => {
    setState((prev) => ({ ...prev, ...e }));
  };

  const onNextStep = () => {
    switch (state.step) {
      case EWithdrawStep.Input:
        setState((prev) => ({ ...prev, step: EWithdrawStep.Withdraw }));
        break;
      case EWithdrawStep.Withdraw:
        setState((prev) => ({ ...prev, step: EWithdrawStep.Success }));
        break;
      default:
        onClose();
    }
  };

  const renderContent = () => {
    switch (state.step) {
      case EWithdrawStep.Input:
        return (
          <InputSection
            onNext={onNextStep}
            updateState={updateState}
            withdrawState={state}
            onClose={props.onClose}
            poolData={props.poolData}
          />
        );
      case EWithdrawStep.Withdraw:
        return (
          <WithdrawSection
            onNext={onNextStep}
            withdrawState={state}
            poolData={props.poolData}
            updateState={updateState}
          />
        );
      default:
        return (
          <SuccessSection
            onClose={props.onSuccess}
            withdrawState={state}
            poolData={props.poolData}
          />
        );
    }
  };

  return (
    <Modal open>
      <div
        className={clsx(
          classes.root,
          commonClasses.scroll,
          props.className,
          state.step === EWithdrawStep.Success ? "transparent" : ""
        )}
      >
        {renderContent()}
      </div>
    </Modal>
  );
};
