import { NULL_ADDRESS } from 'config/constants'
import { DefaultReadonlyProvider } from 'config/networks'
import { useConnectedWeb3Context } from 'contexts'
import { BigNumber } from 'ethers'
import { useIsMountedRef } from 'helpers/useIsMountedRef'
import { useEffect, useState } from 'react'
import { ERC20Service } from 'services/erc20'
import { ZERO } from 'utils/number'

export const useTokenBalance = (
  tokenAddress: string,
  user?: string
): {
  balance: BigNumber
  loadBalance: () => Promise<void>
  isLoading: boolean
} => {
  const [balance, setBalance] = useState(ZERO)
  const [isLoading, setIsLoading] = useState(false)
  const { account, library: provider, networkId } = useConnectedWeb3Context()
  const isMountedRef = useIsMountedRef()

  const loadBalance = async () => {
    setIsLoading(true)
    const fProvider = provider || DefaultReadonlyProvider
    if (!user && !account) {
      setBalance(ZERO)
      setIsLoading(false)
      return
    }

    try {
      if (!tokenAddress || tokenAddress === NULL_ADDRESS) {
        // ethBalance;
        const bal = await fProvider.getBalance(user || account || '')
        if (isMountedRef.current) {
          setBalance(() => bal)
        }
      } else {
        const erc20 = new ERC20Service(fProvider, account, tokenAddress)
        const bal = await erc20.getBalanceOf(user || account || '')
        if (isMountedRef.current) {
          setBalance(() => bal)
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        setBalance(() => ZERO)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadBalance()
  }, [tokenAddress, account, networkId, provider])

  return { balance, loadBalance, isLoading }
}
