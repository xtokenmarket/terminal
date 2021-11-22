import { BigNumber, Contract, Wallet, ethers } from "ethers";
import { Maybe } from "types";
import abis from "abis";
import { getSortedToken } from "utils/token";
import { Interface } from "@ethersproject/abi";

const lmAbi = abis.LM;

class LMService {
  provider: any;
  contract: Contract;

  constructor(provider: any, signerAddress: Maybe<string>, address: string) {
    this.provider = provider;
    if (signerAddress) {
      const signer: Wallet = provider.getSigner();
      this.contract = new ethers.Contract(address, lmAbi, provider).connect(
        signer
      );
    } else {
      this.contract = new ethers.Contract(address, lmAbi, provider);
    }
  }

  get address(): string {
    return this.contract.address;
  }

  provideLiquidity = async (
    clrPool: string,
    inputAsset: number,
    amount: BigNumber
  ): Promise<string> => {
    const transactionObject = await this.contract.provideLiquidity(
      clrPool,
      inputAsset,
      amount
    );
    console.log(`provideLiquidity transaction hash: ${transactionObject.hash}`);

    return transactionObject.hash;
  };

  waitUntilProvideLiquidity = async (
    clrPool: string,
    inputAsset: number,
    amount: BigNumber,
    account: string,
    txId: string
  ): Promise<string> => {
    let resolved = false;
    return new Promise(async (resolve) => {
      this.contract.on(
        "ProvidedLiquidity",
        (
          clrPoolAddress: string,
          sender: string,
          inputAssetType: any,
          amountStr: any,
          ...rest
        ) => {
          if (
            clrPool.toLowerCase() === clrPoolAddress.toLowerCase() &&
            inputAsset === BigNumber.from(inputAssetType).toNumber() &&
            account.toLowerCase() === sender.toLowerCase() &&
            amount.eq(BigNumber.from(amountStr))
          ) {
            if (!resolved) {
              resolved = true;
              resolve(rest[0].transactionHash);
            }
          }
        }
      );

      await this.contract.provider.waitForTransaction(txId);
      if (!resolved) {
        resolved = true;
        resolve(txId);
      }
    });
  };

  parseProvideLiquidityTx = async (
    txId: string
  ): Promise<{
    amount0: BigNumber;
    amount1: BigNumber;
    liquidity: BigNumber;
  } | null> => {
    const { logs } = await this.contract.provider.getTransactionReceipt(txId);
    const uniPositionInterface = new Interface(abis.Univ3Position);
    for (let index = 0; index < logs.length; index++) {
      const log = logs[index];
      try {
        const parsed = uniPositionInterface.parseLog(log);
        if (parsed.name === "IncreaseLiquidity") {
          return {
            amount0: parsed.args[2],
            amount1: parsed.args[3],
            liquidity: parsed.args[1],
          };
        }
      } catch (error) {}
    }
    return null;
  };

  getPool = async (
    token0: string,
    token1: string,
    tier: BigNumber
  ): Promise<string> => {
    return this.contract.getPool(...getSortedToken(token0, token1), tier);
  };

  createPool = async (
    token0: string,
    token1: string,
    tier: BigNumber
  ): Promise<string> => {
    const transactionObject = await this.contract.createPool(
      token0,
      token1,
      tier,
      {
        value: "0x0",
      }
    );
    console.log(`CreatePool transaction hash: ${transactionObject.hash}`);
    return transactionObject.hash;
  };

  waitUntilPoolCreated = async (
    tokenA: string,
    tokenB: string,
    tier: BigNumber
  ): Promise<void> => {
    const [token0, token1] = getSortedToken(tokenA, tokenB);
    return new Promise((resolve) => {
      this.contract.on("PoolCreated", (t0, t1, fee) => {
        console.log("====", t0, t1, fee);
        if (
          t0.toLowerCase() === token0 &&
          t1.toLowerCase() === token1 &&
          tier.eq(BigNumber.from(fee))
        ) {
          console.log("eq");
          resolve();
        }
      });
    });
  };
}

export { LMService };
