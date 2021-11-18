import clsx from "clsx";
import { makeStyles, Modal } from "@material-ui/core";
import React, { useState } from "react";
import { EDepositStep } from "utils/enums";
import {
  ConfirmSection,
  DepositSection,
  InitSection,
  InputSection,
  SuccessSection,
} from "./components";
import { ITerminalPool } from "types";
import { BigNumber } from "@ethersproject/bignumber";
import { ZERO } from "utils/number";
import useCommonStyles from "style/common";

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
  },
}));

interface IProps {
  className?: string;
  onClose: () => void;
  poolData: ITerminalPool;
}

export interface IDepositState {
  step: EDepositStep;
  amount0: BigNumber;
  amount1: BigNumber;
  amount0Estimation: BigNumber;
  amount1Estimation: BigNumber;
  lpEstimation: BigNumber;
  totalLiquidity: BigNumber;
}

export const DepositModal = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const { onClose } = props;
  const [state, setState] = useState<IDepositState>({
    step: EDepositStep.Init,
    amount0: ZERO,
    amount1: ZERO,
    amount0Estimation: ZERO,
    amount1Estimation: ZERO,
    lpEstimation: ZERO,
    totalLiquidity: ZERO,
  });

  const updateState = (e: any) => {
    setState((prev) => ({ ...prev, ...e }));
  };

  const onNextStep = () => {
    switch (state.step) {
      case EDepositStep.Init:
        setState((prev) => ({ ...prev, step: EDepositStep.Input }));
        break;
      case EDepositStep.Input:
        setState((prev) => ({ ...prev, step: EDepositStep.Confirm }));
        break;
      case EDepositStep.Confirm:
        setState((prev) => ({ ...prev, step: EDepositStep.Deposit }));
        break;
      case EDepositStep.Deposit:
        setState((prev) => ({ ...prev, step: EDepositStep.Success }));
        break;
      default:
        onClose();
    }
  };

  const renderContent = () => {
    switch (state.step) {
      case EDepositStep.Init:
        return <InitSection onNext={onNextStep} />;
      case EDepositStep.Input:
        return (
          <InputSection
            onNext={onNextStep}
            updateState={updateState}
            depositState={state}
            onClose={props.onClose}
            poolData={props.poolData}
          />
        );
      case EDepositStep.Confirm:
        return <ConfirmSection onNext={onNextStep} />;
      case EDepositStep.Deposit:
        return <DepositSection onNext={onNextStep} />;
      default:
        return <SuccessSection onNext={onNextStep} />;
    }
  };

  return (
    <Modal open>
      <div
        className={clsx(classes.root, commonClasses.scroll, props.className)}
      >
        {renderContent()}
      </div>
    </Modal>
  );
};
