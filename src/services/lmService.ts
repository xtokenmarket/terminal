import { BigNumber, Contract, Wallet, ethers } from "ethers";
import { Maybe } from "types";
import abis from "abis";
import { getSortedToken } from "utils/token";

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
