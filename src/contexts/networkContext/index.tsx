import { ChainId, CHAIN_NAMES, CHAIN_PARAMS } from 'config/constants'
import { useConnectedWeb3Context } from 'contexts/connectedWeb3'
import { createContext, useContext } from 'react'
import { Config, getConfig } from './config'

interface IState {
  chainId: ChainId
  chainName: string
  isSupportedChain: boolean
}

interface INetworkContext extends IState {
  switchChain: (chainId: ChainId) => Promise<void>
  supportedChains: ChainId[]
}

const NetworkContext = createContext<INetworkContext>(null!)
const useNetworkContext = () => useContext(NetworkContext)

interface IProps {
  config?: Partial<Config>
}

const NetworkContextProvider: React.FC<IProps> = ({ children, config }) => {
  const { supportedChains } = getConfig(config)
  const { networkId: chainId } = useConnectedWeb3Context()

  const refreshPage = () => {
    window.location.reload()
  }

  const value = {
    chainId: chainId as ChainId,
    chainName: chainId ? CHAIN_NAMES[chainId as ChainId] : '',
    supportedChains,
    isSupportedChain: [...supportedChains].includes(chainId as ChainId),
    switchChain: async (chainId: ChainId) => {
      const ethereum = (window as any).ethereum
      if (!ethereum) return

      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        })
      } catch (error: any) {
        // This error code indicates that the chain has not been added to MetaMask
        // if it is not, then install it into the user MetaMask
        if (error.code === 4902) {
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [CHAIN_PARAMS[chainId]],
            })
          } catch (addError) {
            console.error(addError)
          }
        }
      }
      refreshPage()
    },
  }

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  )
}

export { NetworkContextProvider, useNetworkContext }
