import { BigNumber, Contract, Wallet, ethers } from 'ethers'
import { Maybe, PoolService } from 'types'
import Abi from 'abis'
import { Interface } from '@ethersproject/abi'
import { ChainId, GAS_DELTA } from 'config/constants'
import { getContractAddress } from 'config/networks'

class SingleAssetPoolService implements PoolService {
  abi: any
  contract: Contract
  provider: any
  version: string

  constructor(provider: any, signerAddress: Maybe<string>, address: string) {
    this.abi = Abi.CLRV0
    this.provider = provider
    this.version = ''
    this.contract = new ethers.Contract(address, Abi.SingleAssetPool, provider)

    this.contract
      .getVersion()
      .then((version: string) => {
        this.abi = Abi.CLRV1
        if (signerAddress) {
          const signer: Wallet = provider.getSigner()
          this.contract = this.contract.connect(signer)
        }
      })
      .catch(() => {
        this.contract = new ethers.Contract(address, Abi.CLRV0, provider)
        if (signerAddress) {
          const signer: Wallet = provider.getSigner()
          this.contract = this.contract.connect(signer)
        }
      })
  }

  get address(): string {
    return this.contract.address
  }

  getRewardTokens = async (): Promise<string[]> => {
    return this.contract.getRewardTokens()
  }

  getStakedTokenBalance = async (): Promise<{
    amount0: BigNumber
    amount1: BigNumber
  }> => {
    const stakingToken = await this.contract.stakingToken()
    const tokenContract = new ethers.Contract(
      stakingToken,
      Abi.ERC20,
      this.provider
    )

    const stakedTokenBalance = await tokenContract.balanceOf(
      this.contract.address
    )

    return { amount0: stakedTokenBalance, amount1: BigNumber.from(0) }
  }

  calculateAmountsMintedSingleToken = async (
    inputAsset: number,
    amount: BigNumber
  ) => {
    return
  }

  getLiquidityForAmounts = async (amount0: BigNumber, amount1: BigNumber) => {
    return
  }

  deposit = async (amount0: BigNumber, amount1: BigNumber) => {
    return
  }

  waitUntilDeposit = async (
    amount0: BigNumber,
    amount1: BigNumber,
    account: string,
    txId: string
  ): Promise<string> => {
    return ''
  }

  parseProvideLiquidityTx = async (
    txId: string
  ): Promise<{
    amount0: BigNumber
    amount1: BigNumber
    liquidity: BigNumber
  } | null> => {
    return null
  }

  withdrawAndClaimReward = async (
    amount: BigNumber,
    amount0Estimation: BigNumber,
    amount1Estimation: BigNumber
  ) => {
    return
  }

  withdraw = async (
    amount: BigNumber,
    amount0Estimation: BigNumber,
    amount1Estimation: BigNumber
  ) => {
    return
  }

  parseWithdrawTx = async (
    txId: string
  ): Promise<{
    amount0: BigNumber
    amount1: BigNumber
    liquidity: BigNumber
  } | null> => {
    return null
  }

  parseClaimTx = async (txId: string) => {
    return
  }

  waitUntilWithdraw = async (
    account: string,
    txId: string
  ): Promise<string> => {
    return ''
  }

  claimReward = async () => {
    return
  }

  waitUntilReinvest = async (txId: string): Promise<string> => {
    return ''
  }

  waitUntilClaimReward = async (account: string, txId: string) => {
    return
  }

  calculateWithdrawAmounts = async (amount: BigNumber) => {
    return this.contract.calculateWithdrawAmounts(amount)
  }

  earned = async (account: Maybe<string>, tokenAddress: string) => {
    return
  }

  reinvest = async () => {
    return
  }
}

export { SingleAssetPoolService }
