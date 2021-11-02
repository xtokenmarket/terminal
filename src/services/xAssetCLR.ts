import { Contract, Wallet, ethers } from "ethers";
import { Maybe } from "types";
import abis from "abis";

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
}

export { xAssetCLRService };
