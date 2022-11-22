import Web3Modal, { CHAIN_DATA_LIST } from "web3modal";
import { useEthers } from "@usedapp/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CHAINID, CHAINS } from "settings";
import WalletConnectProvider from "@walletconnect/web3-provider";

export const useWeb3Modal = () => {
  const [provider, setProvider] = useState<any>();
  const { activate, deactivate, chainId } = useEthers();
  const [autoLoaded, setAutoLoaded] = useState(false);
  const autoLoad = true;
  const web3Modal = useMemo(
    () =>
      new Web3Modal({
        network: CHAIN_DATA_LIST[CHAINID].network,
        cacheProvider: true,
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              chainId: chainId,
              rpc: Object.fromEntries(Object.entries(CHAINS).map(([chainId, config]) => [chainId, config.endpoint])),
            },
          },
        },
        theme: {
          background: "rgb(39, 49, 56)",
          main: "rgb(199, 199, 199)",
          secondary: "rgb(136, 136, 136)",
          border: "rgba(195, 195, 195, 0.14)",
          hover: "rgb(16, 26, 32)",
        },
      }),
    [chainId]
  );

  const activateProvider = useCallback(async () => {
    const newProvider = await web3Modal.connect();
    await activate(newProvider);
    setProvider(newProvider);
  }, [web3Modal, activate]);

  const deactivateProvider = useCallback(async () => {
    await web3Modal.clearCachedProvider();
    if (provider instanceof WalletConnectProvider) {
      provider.close();
    }
    await deactivate();
  }, [web3Modal, provider, deactivate]);

  useEffect(() => {
    if (autoLoad && !autoLoaded && web3Modal.cachedProvider) {
      activateProvider();
      setAutoLoaded(true);
    }
  }, [autoLoad, autoLoaded, activateProvider, setAutoLoaded, web3Modal.cachedProvider]);

  return { activateProvider, deactivateProvider };
};
