import ERC20Abi from './ERC20.json'
import LMTerminalAbi from './LMTerminal.json'
import MulticallAbi from './Multicall.json'
import RewardEscrowAbi from './RewardEscrow.json'
import StakedCLRTokenAbi from './StakedCLRToken.json'
import UniswapV3FactoryAbi from './UniswapV3Factory.json'
import UniswapV3PoolStateAbi from './UniswapV3PoolState.json'
import UniswapV3PositionAbi from './UniswapV3Position.json'
import xAssetCLRAbi from './xAssetCLR.json'

// Origination
import OriginationCoreAbi from './origination/OriginationCore.json'
import OriginationPoolAbi from './origination/OriginationPool.json'

const Abi = {
  ERC20: ERC20Abi,
  LMTerminal: LMTerminalAbi,
  Multicall: MulticallAbi,
  RewardEscrow: RewardEscrowAbi,
  StakedCLRToken: StakedCLRTokenAbi,
  UniswapV3Factory: UniswapV3FactoryAbi,
  UniswapV3PoolState: UniswapV3PoolStateAbi,
  UniswapV3Position: UniswapV3PositionAbi, // NonfungiblePositionManager
  xAssetCLR: xAssetCLRAbi,

  // Origination
  OriginationCore: OriginationCoreAbi,
  OriginationPool: OriginationPoolAbi,
}

export default Abi
