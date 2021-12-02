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
}

export { xAssetCLRService };
