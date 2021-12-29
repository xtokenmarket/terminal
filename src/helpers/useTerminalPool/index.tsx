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
  const [state, setState] = useState<IState>({ loading: true });
  const { account, library: provider, networkId } = useConnectedWeb3Context();
  const { multicall, rewardEscrow } = useServices();

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
    // console.time(`loadInfo ${poolAddress}`)
    try {
      // console.time(`loadInfo multicall ${poolAddress}`)
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
        "owner",
        "periodFinish",
        "getTicks",
        "manager",
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
        [owner],
        [periodFinish],
        ticks,
        [manager],
      ] = await multicall.multicallv2(abis.xAssetCLR, calls, {
        requireSuccess: false,
      });
      // console.timeEnd(`loadInfo multicall ${poolAddress}`)

      // console.time(`loadInfo token details ${poolAddress}`)
      const [token0, token1, stakedToken] = await Promise.all([
        getTokenDetails(token0Address),
        getTokenDetails(token1Address),
        getTokenDetails(stakedTokenAddress),
      ]);
      // console.timeEnd(`loadInfo token details ${poolAddress}`)

      // console.time(`loadInfo vesting period ${poolAddress}`)
      const vestingPeriod = await rewardEscrow.clrPoolVestingPeriod(
        poolAddress
      );
      // console.timeEnd(`loadInfo vesting period ${poolAddress}`)

      // console.time(`loadInfo reward tokens ${poolAddress}`)
      const rewardTokens = (await Promise.all(
        rewardTokenAddresses.map((addr: string) => getTokenDetails(addr))
      )) as IToken[];
      // console.timeEnd(`loadInfo reward tokens ${poolAddress}`)

      const rewardCalls = rewardTokens.map((token) => ({
        name: "rewardPerToken",
        address: poolAddress,
        params: [token.address],
      }));

      // console.time(`loadInfo rewards response ${poolAddress}`)
      const rewardsResponse = await multicall.multicallv2(
        abis.xAssetCLR,
        rewardCalls,
        { requireSuccess: false }
      );
      // console.timeEnd(`loadInfo rewards response ${poolAddress}`)

      const rewardsPerToken = rewardsResponse.map(
        (response: any) => response[0]
      );

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
          owner: owner.toLowerCase(),
          periodFinish,
          vestingPeriod,
          ticks: {
            tick0: ticks[0],
            tick1: ticks[1],
          },
          rewardsPerToken,
          manager,
        },
      }));
    } catch (error) {
      console.error(error);
      setState(() => ({ loading: false }));
    }
    // console.timeEnd(`loadInfo ${poolAddress}`)
  };

  useEffect(() => {
    loadInfo();
    const interval = setInterval(loadInfo, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [networkId, poolAddress]);

  return { ...state, loadInfo };
};
