import { DefaultReadonlyProvider, getContractAddress } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useMemo } from "react";
import { MulticallService } from "services";

export const useServices = () => {
  const { account, library: provider, networkId } = useConnectedWeb3Context();

  const services = useMemo(() => {
    const multicall = new MulticallService(
      provider || DefaultReadonlyProvider,
      account,
      getContractAddress("multicall", networkId)
    );

    return { multicall };
  }, [networkId]);

  return services;
};
