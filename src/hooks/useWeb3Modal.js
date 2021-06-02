import { useCallback, useEffect, useState, useMemo } from "react";
import { Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Torus from "@toruslabs/torus-embed";
import Authereum from "authereum";
import Portis from "@portis/web3";
import MewConnect from "@myetherwallet/mewconnect-web-client"

// Enter a valid infura key here to avoid being rate limited
// You can get a key for free at https://infura.io/register
const INFURA_ID = "472979e3dd4744859d63fe6421283f47";

// 
const FORMATIC_ID = "pk_test_7F2F878BC34EF901";

//const NETWORK_NAME = "mainnet";
const NETWORK_NAME = "rinkeby";

function useWeb3Modal(config = {}) {
  const [provider, setProvider] = useState();
  const [autoLoaded, setAutoLoaded] = useState(false);
  const { autoLoad = true, infuraId = INFURA_ID, NETWORK = NETWORK_NAME } = config;

  // Web3Modal also supports many other wallets.
  // You can see other options at https://github.com/Web3Modal/web3modal
  const web3Modal = useMemo(() => {
    return new Web3Modal({
      network: NETWORK,
      cacheProvider: true,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId,
          },
        },
        torus: {
          package: Torus,
          options: {
            config: {
              buildEnv: "development"
            },
          },
        },
        authereum: {
          package: Authereum,
        },
        portis: {
          package: Portis,
          options: {
            id: "ded972c3-b6cf-466a-92c6-fd6ada36a878",
          },
        },
        mewconnect: {
          package: MewConnect,
          options: {
            infuraId: infuraId
          }
        }
      },
      theme: {
        background: "rgb(39, 49, 56)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(16, 26, 32)"
      }
    });
  }, [NETWORK, infuraId])

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
