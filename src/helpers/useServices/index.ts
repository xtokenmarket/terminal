import { getContractAddress, getNetworkProvider } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { useMemo } from 'react'
import {
  MulticallService,
  RewardEscrowService,
  UniPositionService,
  LMService,
} from 'services'
import { Network } from 'utils/enums'

export const useServices = (network?: Network) => {
  const { account, library: provider, networkId } = useConnectedWeb3Context()
  const readonlyProvider = getNetworkProvider(network)

  return useMemo(() => {
    const multicall = new MulticallService(
      provider || readonlyProvider,
      account,
      getContractAddress('multicall', networkId)
    )

    const rewardEscrow = new RewardEscrowService(
      provider || readonlyProvider,
      account,
      getContractAddress('rewardEscrow', networkId)
    )

    const lmService = new LMService(
      provider || readonlyProvider,
      account,
      getContractAddress('LM', networkId)
    )
    const uniPositionService = new UniPositionService(
      provider || readonlyProvider,
      account,
      getContractAddress('uniPositionManager', networkId)
    )

    return { multicall, rewardEscrow, lmService, uniPositionService }
  }, [networkId])
}
