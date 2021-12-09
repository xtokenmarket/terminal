import LMAbi from "./json/LM.json";
import MulticallAbi from "./json/multicall.json";
import xAssetCLRAbi from "./json/xAssetCLR.json";
import StakingCLRTokenAbi from "./json/StakingCLRToken.json";
import RewardEscrowAbi from "./json/RewardEscrow.json";
import Univ3FactoryAbi from "./json/Univ3Factory.json";
import Univ3PositionAbi from "./json/UniPosition.json";
import Erc20Abi from "./json/erc20.json";

const abis = {
  LM: LMAbi,
  Multicall: MulticallAbi,
  xAssetCLR: xAssetCLRAbi,
  StakingCLRToken: StakingCLRTokenAbi,
  RewardEscrow: RewardEscrowAbi,
  Univ3Factory: Univ3FactoryAbi,
  Univ3Position: Univ3PositionAbi,
  Erc20: Erc20Abi,
};

export default abis;
