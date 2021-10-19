import { networkIds } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useEffect, useState } from "react";
import { waitSeconds } from "utils";

interface IState {
  pools: string[];
  loading: boolean;
}

export const useTerminalPool = (poolAddress: string) => {
  const [state, setState] = useState<IState>({ pools: [], loading: false });
  const { networkId } = useConnectedWeb3Context();

  const loadPools = async () => {
    setState((prev) => ({ ...prev, loading: false }));
    try {
      await waitSeconds(2);
      if (!networkId || networkId === networkIds.KOVAN) {
        setState((prev) => ({
          ...prev,
          pools: ["0x1DdAbd03eeddBa8A81d0D0f37B15Cf4e0aBB662e"],
          loading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    setState((prev) => ({ ...prev, pools: [], loading: false }));
    loadPools();
  }, [networkId]);

  return state;
};
