import { BigNumber, Contract, Wallet, ethers } from "ethers";
import { Maybe } from "types";
import abis from "abis";
import { Interface } from "@ethersproject/abi";

const xAssetCLRAbi = abis.xAssetCLR;

class xAssetCLRService {
  provider: any;
  contract: Contract;

  constructor(provider: any, signerAddress: Maybe<string>, address: string) {
    this.provider = provider;
    if (signerAddress) {
      const signer: Wallet = provider.getSigner();
      this.contract = new ethers.Contract(
        address,
        xAssetCLRAbi,
        provider
      ).connect(signer);
    } else {
      this.contract = new ethers.Contract(address, xAssetCLRAbi, provider);
    }
  }

  get address(): string {
    return this.contract.address;
  }

  calculateAmountsMintedSingleToken = async (
    inputAsset: number,
    amount: BigNumber
  ) => {
    return this.contract.calculateAmountsMintedSingleToken(inputAsset, amount);
  };

  getLiquidityForAmounts = async (amount0: BigNumber, amount1: BigNumber) => {
    return this.contract.getLiquidityForAmounts(amount0, amount1);
  };

  getTotalLiquidity = async () => {
    return this.contract.getTotalLiquidity();
  };

  claimReward = async (address: string): Promise<string> => {
    const transactionObject = await this.contract.claimReward(address);
    console.log(`claimReward transaction hash: ${transactionObject.hash}`);

    return transactionObject.hash;
  };

  waitUntilClaimReward = async (
    account: string,
    txId: string
  ): Promise<string> => {
    let resolved = false;
    return new Promise(async (resolve) => {
      this.contract.on(
        "RewardClaimed",
        (sender: string, token: any, amountStr: any, ...rest) => {
          if (account.toLowerCase() === sender.toLowerCase()) {
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

  parseClaimTx = async (
    txId: string
  ): Promise<{
    [key: string]: BigNumber;
  }> => {
    const result: {
      [key: string]: BigNumber;
    } = {};
    const { logs } = await this.contract.provider.getTransactionReceipt(txId);
    const uniPositionInterface = new Interface(abis.xAssetCLR);
    for (let index = 0; index < logs.length; index++) {
      const log = logs[index];
      try {
        const parsed = uniPositionInterface.parseLog(log);
        if (parsed.name === "RewardClaimed") {
          result[String(parsed.args[1]).toLowerCase()] = parsed.args[2];
        }
      } catch (error) {}
    }
    return result;
  };
}

export { xAssetCLRService };
