import { Web3Provider } from "@ethersproject/providers";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { ConnectWalletModal, TransactionModal } from "components";
import { STORAGE_KEY_CONNECTOR } from "config/constants";
import { setupNetwork } from "config/networks";
import connectors from "utils/connectors";
import { ConnectorNames } from "utils/enums";
import { Maybe } from "types/types";
import { useSnackbar } from "notistack";
import { BigNumber } from "@ethersproject/bignumber";
import { ZERO } from "utils/number";

export interface ConnectedWeb3Context {
  account: Maybe<string> | null;
  library: Web3Provider | undefined;
  networkId: number | undefined;
  rawWeb3Context: any;
  initialized: boolean;
  walletConnectModalOpened: boolean;
  setWalletConnectModalOpened: (_: boolean) => void;
  onDisconnect: () => void;
  txModalInfo?: {
    visible: boolean;
    description: string;
    txHash: string;
    title: string;
  };
  setTxModalInfo: (
    visible: boolean,
    title?: string,
    description?: string,
    txHash?: string
  ) => void;
  getTokenPrices: (tokens: string[]) => Promise<BigNumber[]>;
}

const ConnectedWeb3Context =
  React.createContext<Maybe<ConnectedWeb3Context>>(null);

/**
 * This hook can only be used by components under the `ConnectedWeb3` component. Otherwise it will throw.
 */
export const useConnectedWeb3Context = () => {
  const context = React.useContext(ConnectedWeb3Context);

  if (!context) {
    throw new Error("Component rendered outside the provider tree");
  }

  return context;
};

/**
 * Component used to render components that depend on Web3 being available. These components can then
 * `useConnectedWeb3Context` safely to get web3 stuff without having to null check it.
 */
export const ConnectedWeb3: React.FC = (props) => {
  const context = useWeb3React<Web3Provider>();
  const { account, activate, active, chainId, deactivate, error, library } =
    context;
  const [state, setState] = useState<{
    initialized: boolean;
    walletConnectModalOpened: boolean;
    txModalInfo?: {
      visible: boolean;
      description: string;
      txHash: string;
      title: string;
    };
    tokenPrices: { [key: string]: BigNumber };
  }>({
    initialized: false,
    walletConnectModalOpened: false,
    tokenPrices: {},
  });
  const { enqueueSnackbar } = useSnackbar();

  const setInitialized = (initialized: boolean) => {
    setState((prev) => ({ ...prev, initialized }));
  };
  const setWalletConnectModalOpened = (walletConnectModalOpened: boolean) =>
    setState((prev) => ({ ...prev, walletConnectModalOpened }));

  const updateInitialized = () => {
    if (!state.initialized) setInitialized(true);
  };

  useEffect(() => {
    const checkNetworkAndUpdate = async () => {
      const connector = localStorage.getItem(STORAGE_KEY_CONNECTOR);
      if (error) {
        if (error instanceof UnsupportedChainIdError && !state.initialized) {
          try {
            if (window.ethereum && window.ethereum.isTrust) {
              enqueueSnackbar("Please switch to Binance Smart Chain", {
                variant: "error",
              });
              return;
            }
            const hasSetup = await setupNetwork();
            if (hasSetup) {
              activate(connectors[connector as ConnectorNames]);
            }
          } catch (error) {
            localStorage.removeItem(STORAGE_KEY_CONNECTOR);
            deactivate();
            updateInitialized();
          }
        } else {
          localStorage.removeItem(STORAGE_KEY_CONNECTOR);
          deactivate();
          updateInitialized();
        }
      } else if (connector && Object.keys(connectors).includes(connector)) {
        const isMetaMaskActive =
          window.ethereum && window.ethereum._metamask
            ? await window.ethereum._metamask.isUnlocked()
            : false;
        if (
          !active &&
          (connector !== ConnectorNames.Injected || isMetaMaskActive)
        ) {
          activate(connectors[connector as ConnectorNames])
            .then(() => updateInitialized())
            .catch(() => updateInitialized());
        } else {
          updateInitialized();
        }
      } else {
        updateInitialized();
      }
    };
    checkNetworkAndUpdate();
    // eslint-disable-next-line
  }, [context, library, active, error]);

  const onDisconnect = () => {
    localStorage.removeItem(STORAGE_KEY_CONNECTOR);
    deactivate();
  };

  const setTxModalInfo = (
    visible: boolean,
    title?: string,
    description?: string,
    txHash?: string
  ) => {
    setState((prev) => ({
      ...prev,
      txModalInfo: {
        title: title || "",
        visible,
        description: description || "",
        txHash: txHash || "",
      },
    }));
  };

  const getTokenPrices = async (tokens: string[]): Promise<BigNumber[]> => {
    const tokensToFetch = tokens
      .map((token) => token.toLowerCase())
      .filter((token) => !state.tokenPrices[token]);
    try {
      const response: { [key: string]: BigNumber } = {};
      // get price info with tokensToFetch
      const updatedTokenPrices = { ...state.tokenPrices, ...response };

      setState((prev) => ({
        ...prev,
        tokenPrices: { ...prev.tokenPrices, ...response },
      }));

      return tokens
        .map((token) => token.toLowerCase())
        .map((token) => updatedTokenPrices[token] || ZERO);
    } catch (error) {
      console.error(error);
      return tokens.map(() => ZERO);
    }
  };

  const value = {
    account: account || null,
    library,
    networkId: chainId,
    rawWeb3Context: context,
    initialized: state.initialized,
    walletConnectModalOpened: state.walletConnectModalOpened,
    setWalletConnectModalOpened,
    onDisconnect,
    setTxModalInfo,
    getTokenPrices,
  };

  return (
    <ConnectedWeb3Context.Provider value={value}>
      {state.initialized ? props.children : null}
      {state.walletConnectModalOpened && (
        <ConnectWalletModal
          visible={state.walletConnectModalOpened}
          onClose={() => setWalletConnectModalOpened(false)}
        />
      )}
      {state.txModalInfo && state.txModalInfo.visible && (
        <TransactionModal
          visible
          onClose={() => setTxModalInfo(false)}
          description={state.txModalInfo.description}
          txId={state.txModalInfo.txHash}
          title={state.txModalInfo.title}
        />
      )}
    </ConnectedWeb3Context.Provider>
  );
};

export const WhenConnected: React.FC = (props) => {
  const { account } = useConnectedWeb3Context();

  return <>{account && props.children}</>;
};
