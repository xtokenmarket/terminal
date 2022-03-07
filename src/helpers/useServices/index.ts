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
import { getIdFromNetwork } from 'utils/network'

export const useServices = (network?: Network) => {
  const { account, library: provider, networkId } = useConnectedWeb3Context()
  let readonlyProvider = provider
  let readonlyNetworkId = networkId

  if (networkId !== getIdFromNetwork(network)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    readonlyProvider = getNetworkProvider(network)
    readonlyNetworkId = getIdFromNetwork(network)
  }

  return useMemo(() => {
    const multicall = new MulticallService(
      readonlyProvider,
      account,
      getContractAddress('multicall', readonlyNetworkId)
    )

    const rewardEscrow = new RewardEscrowService(
      readonlyProvider,
      account,
      getContractAddress('rewardEscrow', readonlyNetworkId)
    )

    const lmService = new LMService(
      readonlyProvider,
      account,
      getContractAddress('LM', readonlyNetworkId)
    )
    const uniPositionService = new UniPositionService(
      readonlyProvider,
      account,
      getContractAddress('uniPositionManager', readonlyNetworkId)
    )

    return { multicall, rewardEscrow, lmService, uniPositionService }
  }, [networkId])
}
