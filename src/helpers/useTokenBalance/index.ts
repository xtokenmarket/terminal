import { NULL_ADDRESS } from "config/constants";
import { useConnectedWeb3Context } from "contexts";
import { BigNumber } from "ethers";
import { useIsMountedRef } from "helpers/useIsMountedRef";
import { useEffect, useState } from "react";
import { ERC20Service } from "services/erc20";
import { ZERO } from "utils/number";

export const useTokenBalance = (
  tokenAddress: string
): {
  balance: BigNumber;
  loadBalance: () => Promise<void>;
} => {
  const [balance, setBalance] = useState(ZERO);
  const { account, library: provider, networkId } = useConnectedWeb3Context();
  const isMountedRef = useIsMountedRef();

  const loadBalance = async () => {
    if (!account || !provider || !networkId) {
      setBalance(() => ZERO);
      return;
    }
    try {
      if (tokenAddress === NULL_ADDRESS) {
        // ethBalance;
        const bal = await provider.getBalance(account);
        if (isMountedRef.current === true) {
          setBalance(() => bal);
        }
      } else {
        const erc20 = new ERC20Service(provider, account, tokenAddress);
        const bal = await erc20.getBalanceOf(account);
        if (isMountedRef.current === true) {
          setBalance(() => bal);
        }
      }
    } catch (error) {
      if (isMountedRef.current === true) {
        setBalance(() => ZERO);
      }
    }
  };

  useEffect(() => {
    loadBalance();
  }, [tokenAddress, account, networkId, provider]);

  return { balance, loadBalance };
};
