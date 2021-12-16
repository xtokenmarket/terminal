import clsx from "clsx";
import { makeStyles, Modal } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { ERewardStep } from "utils/enums";
import {
  RewardSection,
  InputSection,
  SuccessSection,
  ConfirmSection,
} from "./components";
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

export interface IRewardState {
  step: ERewardStep;
  period: string;
  amounts: BigNumber[];
}

export const LiquidityModal = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { account } = useConnectedWeb3Context();

  const { onClose } = props;
  const [state, setState] = useState<IRewardState>({
    step: ERewardStep.Input,
    period: "",
    amounts: props.poolData.rewardTokens.map((e) => ZERO),
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
      case ERewardStep.Input:
        setState((prev) => ({ ...prev, step: ERewardStep.Confirm }));
        break;
      case ERewardStep.Confirm:
        setState((prev) => ({ ...prev, step: ERewardStep.Initiate }));
        break;
      case ERewardStep.Initiate:
        setState((prev) => ({ ...prev, step: ERewardStep.Success }));
        break;
      default:
        onClose();
    }
  };

  const renderContent = () => {
    switch (state.step) {
      case ERewardStep.Input:
        return (
          <InputSection
            onNext={onNextStep}
            updateState={updateState}
            rewardState={state}
            onClose={props.onClose}
            poolData={props.poolData}
          />
        );
      case ERewardStep.Confirm:
        return (
          <ConfirmSection
            onNext={onNextStep}
            rewardState={state}
            poolData={props.poolData}
            updateState={updateState}
          />
        );
      case ERewardStep.Initiate:
        return (
          <RewardSection
            onNext={onNextStep}
            rewardState={state}
            poolData={props.poolData}
            updateState={updateState}
          />
        );
      default:
        return (
          <SuccessSection
            onClose={props.onSuccess}
            rewardState={state}
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
          state.step === ERewardStep.Success ? "transparent" : ""
        )}
      >
        {renderContent()}
      </div>
    </Modal>
  );
};
