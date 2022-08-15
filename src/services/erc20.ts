import { ChainId } from 'config/constants'
import { BigNumber, Contract, Wallet, ethers, utils } from 'ethers'
import { hexlify } from 'ethers/lib/utils'
import { IToken, Maybe } from '../types'
import { isAddress, isContract } from '../utils/tools'

const erc20Abi = [
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function balanceOf(address marketMaker) external view returns (uint256)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)',
  'function decimals() external view returns (uint8)',
  'function totalSupply() external view returns (uint256)',
  'function transferFrom(address sender, address recipient, uint256 amount) public returns (bool)',
  'function transfer(address to, uint256 value) public returns (bool)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
]

class ERC20Service {
  provider: any
  contract: Contract

  constructor(
    provider: any,
    signerAddress: Maybe<string>,
    tokenAddress: string
  ) {
    this.provider = provider
    if (signerAddress) {
      const signer: Wallet = provider.getSigner()
      this.contract = new ethers.Contract(
        tokenAddress,
        erc20Abi,
        provider
      ).connect(signer)
    } else {
      this.contract = new ethers.Contract(tokenAddress, erc20Abi, provider)
    }
  }

  get address(): string {
    return this.contract.address
  }

  /**
   * @returns A boolean indicating if `spender` has enough allowance to transfer `neededAmount` tokens from `spender`.
   */
  hasEnoughAllowance = async (
    owner: string,
    spender: string,
    neededAmount: BigNumber
  ): Promise<boolean> => {
    const allowance: BigNumber = await this.contract.allowance(owner, spender)
    return allowance.gte(neededAmount)
  }

  totalSupply = async (): Promise<BigNumber> => {
    return this.contract.totalSupply()
  }

  /**
   * @returns The allowance given by `owner` to `spender`.
   */
  allowance = async (owner: string, spender: string): Promise<BigNumber> => {
    return this.contract.allowance(owner, spender)
  }

  /**
   * Approve `spender` to transfer `amount` tokens on behalf of the connected user.
   */
  approve = (
    spender: string,
    amount: BigNumber
  ): ethers.providers.TransactionResponse => {
    return this.contract.approve(spender, amount, {
      value: '0x0',
      gasLimit: hexlify(100000),
    })
  }

  /**
   * Approve `spender` to transfer an "unlimited" amount of tokens on behalf of the connected user.
   */
  approveUnlimited = async (
    spender: string,
    networkId: number
  ): Promise<string> => {
    const transactionObject = await this.contract.approve(
      spender,
      ethers.constants.MaxUint256,
      {
        value: '0x0',
        gasLimit: hexlify(networkId === ChainId.Arbitrum ? 600000 : 100000),
      }
    )
    console.log(`Approve unlimited transaction hash: ${transactionObject.hash}`)
    return transactionObject.hash
  }

  waitUntilApproved = async (
    owner: string,
    spender: string,
    txId: string
  ): Promise<string> => {
    let resolved = false
    return new Promise((resolve) => {
      this.contract.on(
        'Approval',
        (
          ownerAddress: string,
          spenderAddress: string,
          amount: any,
          ...rest
        ) => {
          if (
            ownerAddress.toLowerCase() === owner.toLowerCase() &&
            spenderAddress.toLowerCase() === spender.toLowerCase()
          ) {
            if (!resolved) {
              resolved = true
              resolve(rest[0].transactionHash)
            }
          }
        }
      )

      this.contract.provider.waitForTransaction(txId).then(() => {
        if (!resolved) {
          resolved = true
          resolve(txId)
        }
      })
    })
  }

  getBalanceOf = async (address: string): Promise<BigNumber> => {
    return this.contract.balanceOf(address)
  }

  hasEnoughBalanceToFund = async (
    owner: string,
    amount: BigNumber
  ): Promise<boolean> => {
    const balance: BigNumber = await this.contract.balanceOf(owner)

    return balance.gte(amount)
  }

  getDetails = async (): Promise<IToken> => {
    const [decimals, symbol, name] = await Promise.all([
      this.contract.decimals(),
      this.contract.symbol(),
      this.contract.name(),
    ])
    return {
      name,
      symbol,
      decimals,
      address: this.contract.address,
      image: '/assets/tokens/unknown.png',
    }
  }

  getInfo = async (): Promise<IToken> => {
    if (!isAddress(this.contract.address)) {
      throw new Error('Is not a valid erc20 address')
    }

    if (!isContract(this.provider, this.contract.address)) {
      throw new Error('Is not a valid contract')
    }

    const [decimals, symbol, name] = await Promise.all([
      this.contract.decimals(),
      this.contract.symbol(),
      this.contract.name(),
    ])

    return {
      name,
      symbol,
      address: this.address,
      decimals,
      image: '',
    }
  }

  static encodeTransferFrom = (
    from: string,
    to: string,
    amount: BigNumber
  ): string => {
    const transferFromInterface = new utils.Interface(erc20Abi)

    return transferFromInterface.encodeFunctionData('transferFrom', [
      from,
      to,
      amount,
    ])
  }

  static encodeTransfer = (to: string, amount: BigNumber): string => {
    const transferInterface = new utils.Interface(erc20Abi)

    return transferInterface.encodeFunctionData('transfer', [to, amount])
  }

  static encodeApprove = (
    spenderAccount: string,
    amount: BigNumber
  ): string => {
    const approveInterface = new utils.Interface(erc20Abi)

    return approveInterface.encodeFunctionData('approve', [
      spenderAccount,
      amount,
    ])
  }

  static encodeApproveUnlimited = (spenderAccount: string): string => {
    const approveInterface = new utils.Interface(erc20Abi)

    return approveInterface.encodeFunctionData('approve', [
      spenderAccount,
      ethers.constants.MaxUint256,
    ])
  }
}

export { ERC20Service }
