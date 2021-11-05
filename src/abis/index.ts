import LMAbi from "./json/LM.json";
import MulticallAbi from "./json/multicall.json";
import xAssetCLRAbi from "./json/xAssetCLR.json";
import StakingCLRTokenAbi from "./json/StakingCLRToken.json";
import RewardEscrowAbi from "./json/RewardEscrow.json";

const abis = {
  LM: LMAbi,
  Multicall: MulticallAbi,
  xAssetCLR: xAssetCLRAbi,
  StakingCLRToken: StakingCLRTokenAbi,
  RewardEscrow: RewardEscrowAbi,
};

export default abis;
