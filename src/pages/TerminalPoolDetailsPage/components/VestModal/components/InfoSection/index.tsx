import { BigNumber } from "@ethersproject/bignumber";
import { Button, IconButton, makeStyles, Typography } from "@material-ui/core";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import abis from "abis";
import { MINT_BURN_SLIPPAGE } from "config/constants";
import { getContractAddress } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useIsMountedRef, useServices } from "helpers";
import { IVestState } from "pages/TerminalPoolDetailsPage/components";
import { useEffect } from "react";
import { ERC20Service, xAssetCLRService } from "services";
import { ITerminalPool } from "types";
import { OutputEstimation, OutputEstimationInfo } from "..";

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
    marginBottom: 24,
  },
  closeButton: {
    position: "absolute",
    right: 12,
    top: 12,
    padding: 12,
    color: theme.colors.white1,
  },

  actions: {
    padding: 32,
  },

  deposit: { marginTop: 32 },
  buy: { marginTop: 8 },
}));

interface IProps {
  onNext: () => void;
  onClose: () => void;
  vestState: IVestState;
  updateState: (e: any) => void;
  poolData: ITerminalPool;
}

let timerId: any;

export const InfoSection = (props: IProps) => {
  const classes = useStyles();
  const { onNext, onClose, vestState, updateState, poolData } = props;
  const { account, library: provider, networkId } = useConnectedWeb3Context();
  const isMountedRef = useIsMountedRef();
  const { multicall } = useServices();

  const loadBasicInfo = async () => {
    if (!account || !provider) {
      return;
    }
    try {
      const xCLR = new xAssetCLRService(provider, account, poolData.address);
      const stakingToken = new ERC20Service(
        provider,
        account,
        poolData.stakedToken.address
      );

      const [totalLiquidity, userLP] = await Promise.all([
        xCLR.getTotalLiquidity(),
        stakingToken.getBalanceOf(account),
      ]);

      const earnedCall = poolData.rewardTokens.map((rewardToken) => ({
        name: "earned",
        address: poolData.address,
        params: [account, rewardToken.address],
      }));

      const earned = await multicall.multicallv2(abis.xAssetCLR, earnedCall, {
        requireSuccess: false,
      });

      const escrowAddress = getContractAddress("rewardEscrow", networkId);

      const numVestingEntriesCalls = poolData.rewardTokens.map(
        (rewardToken) => ({
          name: "numVestingEntries",
          address: escrowAddress,
          params: [poolData.address, rewardToken.address, account],
        })
      );
      const numVestingEntriesResponse = await multicall.multicallv2(
        abis.RewardEscrow,
        numVestingEntriesCalls,
        { requireSuccess: false }
      );

      const vestings: { amount: BigNumber; timestamp: BigNumber }[][] = [];

      for (let index = 0; index < numVestingEntriesResponse.length; index++) {
        const vestingCount = numVestingEntriesResponse[index][0].toNumber();
        const subCalls = [];
        const rewardToken = poolData.rewardTokens[index];
        for (let i = 0; i < vestingCount; i++) {
          subCalls.push({
            name: "getVestingScheduleEntry",
            address: escrowAddress,
            params: [poolData.address, rewardToken.address, account, i],
          });
        }
        const entryResponse = await multicall.multicallv2(
          abis.RewardEscrow,
          subCalls,
          { requireSuccess: false }
        );

        const info: { amount: BigNumber; timestamp: BigNumber }[] = [];
        entryResponse.forEach((element: any) => {
          info.push({ amount: element[0], timestamp: element[1] });
        });

        vestings.push(info);
      }

      if (isMountedRef.current === true) {
        updateState({
          totalLiquidity,
          userLP,
          earned: earned.map((res: any) => res[0]),
          vestings,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadBasicInfo();
  }, []);

  const loadEstimations = async (amount: BigNumber) => {
    try {
      const calls = ["getTotalLiquidity", "totalSupply"].map((method) => ({
        name: method,
        address: poolData.address,
        params: [],
      }));
      const [[totalLiquidity], [totalSupply]] = await multicall.multicallv2(
        abis.xAssetCLR,
        calls,
        {
          requireSuccess: false,
        }
      );

      const proRataBalance = amount.mul(totalLiquidity).div(totalSupply);
      const amountCalls = [
        {
          name: "getAmountsForLiquidity",
          address: poolData.address,
          params: [proRataBalance],
        },
      ];
      const [amountResponse] = await multicall.multicallv2(
        abis.xAssetCLR,
        amountCalls,
        { requireSuccess: false }
      );
      const amount0 = amountResponse[0] as BigNumber;
      const amount1 = amountResponse[1] as BigNumber;
      const unstakeAmount0 = amount0.add(amount0.div(MINT_BURN_SLIPPAGE));
      const unstakeAmount1 = amount1.add(amount1.div(MINT_BURN_SLIPPAGE));
      updateState({
        totalLiquidity,
        amount0Estimation: unstakeAmount0,
        amount1Estimation: unstakeAmount1,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (newLPValue: BigNumber) => {
    updateState({ lpInput: newLPValue });

    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      loadEstimations(newLPValue);
    }, 800);
  };

  const disabled = (() => {
    for (let index = 0; index < vestState.earned.length; index++) {
      const element = vestState.earned[index];
      if (!element.isZero()) {
        return false;
      }
    }
    return true;
  })();

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>Vest tokens</Typography>
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
      </div>
      <OutputEstimation poolData={poolData} earned={vestState.earned} />
      <div className={classes.actions}>
        <Button
          color="primary"
          variant="contained"
          fullWidth
          disabled={disabled}
          className={classes.deposit}
          onClick={() => {
            updateState({ withdrawOnly: false });
            onNext();
          }}
        >
          VEST
        </Button>
      </div>
    </div>
  );
};
