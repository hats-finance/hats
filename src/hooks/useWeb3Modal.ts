import Web3Modal, { CHAIN_DATA_LIST } from 'web3modal'
import { useEthers } from "@usedapp/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ENDPOINT, NETWORK } from 'settings';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { useNotification } from './useNotification';
import { NotificationType } from 'constants/constants';

export const useWeb3Modal = () => {
    const [provider, setProvider] = useState<any>();
    const { toggleNotification } = useNotification()
    const { activate, deactivate, error } = useEthers();
    const [autoLoaded, setAutoLoaded] = useState(false);
    const autoLoad = true
    const web3Modal = new Web3Modal({
        network: CHAIN_DATA_LIST[NETWORK].network,
        cacheProvider: true,
        providerOptions: {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    chainId: NETWORK,
                    rpc: {
                        [NETWORK]: ENDPOINT,
                    }
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
    })

    const activateProvider = useCallback(async () => {
        const newProvider = await web3Modal.connect();
        await activate(newProvider)
        setProvider(newProvider);
    }, [web3Modal]);

    const deactivateProvider = useCallback(async () => {
        await web3Modal.clearCachedProvider();
        if (provider instanceof WalletConnectProvider) {
            provider.close()
        }
        await deactivate()
    },
        [web3Modal, provider],
    );

    useEffect(() => {
        console.log({ autoLoad, autoLoaded, cacheProvider: web3Modal.cachedProvider })

        if (autoLoad && !autoLoaded && web3Modal.cachedProvider) {
            console.log("autoLoading connection to wallet");
            activateProvider();
            setAutoLoaded(true);
        }
    }, [autoLoad, autoLoaded, activateProvider, setAutoLoaded, web3Modal.cachedProvider]);

    useEffect(() => {
        if (error) {
            toggleNotification(true, NotificationType.Error, error.message, true);
        }
    }, [error, toggleNotification]);

    return { activateProvider, deactivateProvider, error }
}