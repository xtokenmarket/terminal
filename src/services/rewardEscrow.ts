import { BigNumber, Contract, Wallet, ethers } from "ethers";
import { Maybe } from "types";
import abis from "abis";

const rewardEscrowAbi = abis.RewardEscrow;

class RewardEscrowService {
  provider: any;
  contract: Contract;

  constructor(provider: any, signerAddress: Maybe<string>, address: string) {
    this.provider = provider;
    if (signerAddress) {
      const signer: Wallet = provider.getSigner();
      this.contract = new ethers.Contract(
        address,
        rewardEscrowAbi,
        provider
      ).connect(signer);
    } else {
      this.contract = new ethers.Contract(address, rewardEscrowAbi, provider);
    }
  }

  get address(): string {
    return this.contract.address;
  }

  clrPoolVestingPeriod = async (addr: string): Promise<BigNumber> => {
    return this.contract.clrPoolVestingPeriod(addr);
  };
}

export { RewardEscrowService };
