import CLRV0Abi from './CLRV0.json'
import CLRV1Abi from './CLRV1.json'
import ERC20Abi from './ERC20.json'
import LMTerminalAbi from './LMTerminal.json'
import MulticallAbi from './Multicall.json'
import RewardEscrowAbi from './RewardEscrow.json'
import StakedCLRTokenAbi from './StakedCLRToken.json'
import UniswapV3FactoryAbi from './UniswapV3Factory.json'
import UniswapV3PoolStateAbi from './UniswapV3PoolState.json'
import UniswapV3PositionAbi from './UniswapV3Position.json'
import NonRewardPoolApi from './NonRewardPool.json'

const Abi = {
  CLRV0: CLRV0Abi,
  CLRV1: CLRV1Abi,
  ERC20: ERC20Abi,
  LMTerminal: LMTerminalAbi,
  Multicall: MulticallAbi,
  RewardEscrow: RewardEscrowAbi,
  StakedCLRToken: StakedCLRTokenAbi,
  UniswapV3Factory: UniswapV3FactoryAbi,
  UniswapV3PoolState: UniswapV3PoolStateAbi,
  UniswapV3Position: UniswapV3PositionAbi, // NonfungiblePositionManager
  NonRewardPool: NonRewardPoolApi,
}

export default Abi
