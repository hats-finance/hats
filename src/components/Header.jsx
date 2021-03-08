import React, { useState } from "react";
import useWeb3Modal from "../hooks/useWeb3Modal";
import { connect, updateWalletBalance } from "../actions/index";
import { getTokenBalance } from "../actions/contractsActions";
import { useDispatch, useSelector } from "react-redux";
import { truncatedAddress, getNetworkNameByChainId, getMainPath, getEtherBalance } from "../utils";
import "../styles/Header.scss";
import "../styles/global.scss";
import { ScreenSize } from "../constants/constants";
import { useLocation } from "react-router-dom";
import { Pages } from "../constants/constants";
import Lodaing from "./Shared/Loading";
import Modal from "./Shared/Modal";
import HatsBreakdown from "./HatsBreakdown";
import { HATS_TOKEN } from "../constants/constants";

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  return (
    <button
      className={!provider ? "wallet-btn disconnected" : "wallet-btn connected"}
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      <div>
        <span className={!provider ? "dot disconnected" : "dot connected"} style={{ marginRight: "5px" }} />{!provider ? "Connect a Wallet" : "Disconnect Wallet"}
      </div>
    </button>
  );
}

export default function Header() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const selectedAddress = useSelector(state => state.web3Reducer.provider?.selectedAddress) ?? "";
  const { ethBalance, hatsBalance } = useSelector(state => state.web3Reducer);
  const screenSize = useSelector(state => state.layoutReducer.screenSize);
  const [showModal, setShowModal] = useState(false);
  const chainId = useSelector(state => state.web3Reducer.provider?.chainId) ?? "";
  const network = getNetworkNameByChainId(chainId);

  React.useEffect(() => {
    dispatch(connect(provider || {}));
  }, [provider, dispatch]);

  React.useEffect(() => {
    const getWalletBalance = async () => {
      dispatch(updateWalletBalance(null, null));
      dispatch(updateWalletBalance(await getEtherBalance(network, selectedAddress), await getTokenBalance(HATS_TOKEN, selectedAddress)));
    }
    if (selectedAddress) {
      getWalletBalance();
    }
  }, [selectedAddress, network, dispatch]);

  return (
    <header>
      {screenSize === ScreenSize.Small && <div>MENU</div>}
      <div className="page-title">{Pages[getMainPath(location.pathname)]}</div>
      <div className="wallet-wrapper">
        {provider &&
          <div className="wallet-details">
            <button className="hats-btn" onClick={() => setShowModal(true)}>Hats</button>
            <div style={{ position: "relative", minWidth: "50px" }}>
              {!ethBalance ? <Lodaing /> : <span>{`${Number(ethBalance).toFixed(2)} ETH | ${Number(hatsBalance).toFixed(2)} HATS`}</span>}
            </div>
            <span className="current-address">{truncatedAddress(selectedAddress)}</span>
            <span>{`(${network})`}</span>
          </div>}
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </div>
      {showModal &&
        <Modal title="YOUR HATS BREAKDOWN" setShowModal={setShowModal}>
          <HatsBreakdown />
        </Modal>}
    </header>
  )
}
