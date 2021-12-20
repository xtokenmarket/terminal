import { BigNumber, Contract, Wallet, ethers } from "ethers";
import { Maybe } from "types";
import abis from "abis";

const univ3PositionAbi = abis.Univ3Position;

class UniPositionService {
  provider: any;
  contract: Contract;

  constructor(provider: any, signerAddress: Maybe<string>, address: string) {
    this.provider = provider;
    if (signerAddress) {
      const signer: Wallet = provider.getSigner();
      this.contract = new ethers.Contract(
        address,
        univ3PositionAbi,
        provider
      ).connect(signer);
    } else {
      this.contract = new ethers.Contract(address, univ3PositionAbi, provider);
    }
  }

  get address(): string {
    return this.contract.address;
  }
}

export { UniPositionService };
