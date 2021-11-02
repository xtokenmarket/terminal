import abis from "abis";
import { DefaultReadonlyProvider, getTokenFromAddress } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { useServices } from "helpers";
import { useEffect, useState } from "react";
import { ERC20Service } from "services";
import { ITerminalPool, IToken } from "types";

interface IState {
  pool?: ITerminalPool;
  loading: boolean;
}

export const useTerminalPool = (poolAddress: string) => {
  const [state, setState] = useState<IState>({ loading: false });
  const { account, library: provider, networkId } = useConnectedWeb3Context();
  const { multicall } = useServices();

  const getTokenDetails = async (addr: string) => {
    try {
      const token = getTokenFromAddress(addr, networkId);
      return token;
    } catch (error) {
      const erc20 = new ERC20Service(
        provider || DefaultReadonlyProvider,
        account,
        addr
      );
      const token = await erc20.getDetails();
      return token;
    }
  };

  const loadInfo = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const calls = [
        "token0",
        "token1",
        "stakedToken",
        "tokenId",
        "token0DecimalMultiplier",
        "token1DecimalMultiplier",
        "tokenDiffDecimalMultiplier",
        "tradeFee",
        "poolFee",
        "uniswapPool",
        "getRewardTokens",
        "rewardsDuration",
        "rewardsAreEscrowed",
      ].map((method) => ({
        name: method,
        address: poolAddress,
        params: [],
      }));
      const [
        [token0Address],
        [token1Address],
        [stakedTokenAddress],
        [tokenId],
        [token0DecimalMultiplier],
        [token1DecimalMultiplier],
        [tokenDiffDecimalMultiplier],
        [tradeFee],
        [poolFee],
        [uniswapPool],
        [rewardTokenAddresses],
        [rewardsDuration],
        [rewardsAreEscrowed],
      ] = await multicall.multicallv2(abis.xAssetCLR, calls, {
        requireSuccess: false,
      });
      const [token0, token1, stakedToken] = await Promise.all([
        getTokenDetails(token0Address),
        getTokenDetails(token1Address),
        getTokenDetails(stakedTokenAddress),
      ]);

      const rewardTokens = (await Promise.all(
        rewardTokenAddresses.map((addr: string) => getTokenDetails(addr))
      )) as IToken[];

      setState((prev) => ({
        ...prev,
        loading: false,
        pool: {
          address: poolAddress,
          token0,
          token1,
          stakedToken,
          tokenId,
          token0DecimalMultiplier,
          token1DecimalMultiplier,
          tokenDiffDecimalMultiplier,
          tradeFee,
          poolFee,
          uniswapPool,
          rewardTokens,
          rewardsDuration,
          rewardsAreEscrowed,
        },
      }));
    } catch (error) {
      setState((prev) => ({ loading: false }));
    }
  };

  useEffect(() => {
    loadInfo();
    const interval = setInterval(loadInfo, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [networkId, poolAddress]);

  return state;
};
