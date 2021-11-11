import { networkIds } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useEffect, useState } from "react";
import { waitSeconds } from "utils";

interface IState {
  pools: string[];
  loading: boolean;
}

export const useMyTerminalPools = () => {
  const [state, setState] = useState<IState>({ pools: [], loading: true });
  const { networkId } = useConnectedWeb3Context();

  const loadPools = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      await waitSeconds(1);
      if (!networkId || networkId === networkIds.KOVAN) {
        setState((prev) => ({
          ...prev,
          pools: ["0x029F58e079B435DF1Da74eE055379c5E60A4aD2D"],
          loading: false,
        }));
      } else {
        setState((prev) => ({ ...prev, loading: false }));
      }
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    setState((prev) => ({ ...prev, pools: [], loading: true }));
    loadPools();
  }, [networkId]);

  return state;
};
