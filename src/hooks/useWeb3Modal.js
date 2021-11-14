import { useCallback, useEffect, useState, useMemo } from "react";
import { Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { INFURA_ID } from "../constants/constants";
import { NETWORK } from "../settings";
//import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

// const supportedChainIds = [
//   1, // mainnet
//   4, // rinkeby
// ];
// const RPC = {
//   "mainnet": 'https://eth-mainnet.alchemyapi.io/v2/q1gSNoSMEzJms47Qn93f9-9Xg5clkmEC',
//   "rinkeby": 'https://eth-rinkeby.alchemyapi.io/v2/XVLwDlhGP6ApBXFz_lfv0aZ6VmurWhYD',
// }
// export const walletconnect = new WalletConnectConnector({
//   rpc: RPC,
//   bridge: 'https://bridge.walletconnect.org',
//   qrcode: true,
//   supportedChainIds,
//   // pollingInterval: 15000,
// })

function useWeb3Modal(config = {}) {
  const [provider, setProvider] = useState();
  const [autoLoaded, setAutoLoaded] = useState(false);
  const { autoLoad = true, infuraId = INFURA_ID, network = NETWORK } = config;

  // Web3Modal also supports many other wallets.
  // You can see other options at https://github.com/Web3Modal/web3modal
  const web3Modal = useMemo(() => {
    return new Web3Modal({
      network: network,
      cacheProvider: true,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId,
          },
        },
      },
      theme: {
        background: "rgb(39, 49, 56)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(16, 26, 32)"
      }
    });
  }, [network, infuraId])

  // Open wallet selection modal.
  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect();
    setProvider(new Web3Provider(newProvider));
  }, [web3Modal]);

  const logoutOfWeb3Modal = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      window.location.reload();
    },
    [web3Modal],
  );

  // If autoLoad is enabled and the the wallet had been loaded before, load it automatically now.
  useEffect(() => {
    if (autoLoad && !autoLoaded && web3Modal.cachedProvider) {
      loadWeb3Modal();
      setAutoLoaded(true);
    }
  }, [autoLoad, autoLoaded, loadWeb3Modal, setAutoLoaded, web3Modal.cachedProvider]);

  return [provider, loadWeb3Modal, logoutOfWeb3Modal];
}

export default useWeb3Modal;
