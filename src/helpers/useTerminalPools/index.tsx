import { networkIds } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useEffect, useState } from "react";
import { waitSeconds } from "utils";

interface IState {
  pools: string[];
  loading: boolean;
}

export const useTerminalPools = () => {
  const [state, setState] = useState<IState>({ pools: [], loading: true });
  const { networkId } = useConnectedWeb3Context();

  const loadPools = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      await waitSeconds(1);
      if (!networkId || networkId === networkIds.KOVAN) {
        setState((prev) => ({
          ...prev,
          pools: ["0xDBcd727e46A9dD0ff0A4875c76a9DB9546272a66"],
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
