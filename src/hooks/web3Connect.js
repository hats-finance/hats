import { useState, useCallback } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";

const INFURA_NETWORK = "wss://rinkeby.infura.io/ws/v3/472979e3dd4744859d63fe6421283f47";
const INFURA_ID = "472979e3dd4744859d63fe6421283f47";

function Web3Connect() {
    const [provider, setProvider] = useState();

    const ConnectToInjected = useCallback(async () => {
        if (typeof window.ethereum !== 'undefined') {
            setProvider(new ethers.providers.InfuraProvider("wss://rinkeby.infura.io/ws/v3/472979e3dd4744859d63fe6421283f47"))
            try {
                await provider.request({ method: 'eth_requestAccounts' })
            } catch (err) {
                throw new Error('User Rejected')
            }
        } else if (window.web3) {
            setProvider(window.web3.currentProvider)
        } else {
            throw new Error('No web3 provider found')
        }
    },[])

    const useWalletConnect = useCallback(async function () {
        setProvider(new WalletConnectProvider({
            infuraId: INFURA_ID
        }))
        await provider.enable();
    })

    return [provider, ConnectToInjected, useWalletConnect]
}

export default Web3Connect;