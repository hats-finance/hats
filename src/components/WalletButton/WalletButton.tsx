import Web3Modal, { CHAIN_DATA_LIST } from "web3modal";
import { useDispatch, useSelector } from "react-redux";
import { Colors, NotificationType, ScreenSize } from "../../constants/constants";
import { RootState } from "../../reducers";
import Dot from "../Shared/Dot/Dot";
import "./WalletButton.scss";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ENDPOINT, NETWORK } from "settings";
import { shortenIfAddress, useEthers } from "@usedapp/core";
import { useCallback, useEffect, useState } from "react";
import { toggleNotification } from "actions";

export default function WalletButton() {
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const dispatch = useDispatch();
  const { account, activate, deactivate, error } = useEthers();
  const [provider, setProvider] = useState<any>();

  useEffect(() => {
    if (error) {
      dispatch(toggleNotification(true, NotificationType.Error, error?.message, false));
    }
  }, [error, dispatch]);

  const activateProvider = async () => {
    const networkName = CHAIN_DATA_LIST[NETWORK].network
    const web3Modal = new Web3Modal({
      network: networkName,
      cacheProvider: false,
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
    });

    web3Modal.clearCachedProvider()
    const provider = await web3Modal.connect()
    setProvider(provider)
    await activate(provider)
  }

  const deactivateProvider = useCallback(async () => {
    try {
      if (provider instanceof WalletConnectProvider) {
        provider.close()
      }
      await deactivate()
    } catch (error: any) {
      console.log(error.message);
    }
  }, [deactivate, provider])



  return (
    <>
      <button
        className={account ? "wallet-btn connected" : "wallet-btn disconnected"}
        onClick={account ? deactivateProvider : activateProvider}>
        <div>
          <Dot color={account ? Colors.turquoise : Colors.red} />
          {account ? screenSize === ScreenSize.Desktop ? "Disconnect Wallet" : `${shortenIfAddress(account)}` : "Connect a Wallet"}
        </div>
      </button>
    </>
  );
}
