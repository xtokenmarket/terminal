import { DefaultReadonlyProvider, getContractAddress } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useMemo } from "react";
import { MulticallService, RewardEscrowService } from "services";
import { LMService } from "services/lmService";

export const useServices = () => {
  const { account, library: provider, networkId } = useConnectedWeb3Context();

  const services = useMemo(() => {
    const multicall = new MulticallService(
      provider || DefaultReadonlyProvider,
      account,
      getContractAddress("multicall", networkId)
    );

    const rewardEscrow = new RewardEscrowService(
      provider || DefaultReadonlyProvider,
      account,
      getContractAddress("rewardEscrow", networkId)
    );

    const lmService = new LMService(
      provider || DefaultReadonlyProvider,
      account,
      getContractAddress("LM", networkId)
    );

    return { multicall, rewardEscrow, lmService };
  }, [networkId]);

  return services;
};
