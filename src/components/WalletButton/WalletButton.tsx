import { useState } from "react";
import { useSelector } from "react-redux";
import { ScreenSize } from "../../constants/constants";
import { RootState } from "../../reducers";
import { truncatedAddress } from "../../utils";
import Modal from "../Shared/Modal";
import "./WalletButton.scss";

export default function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";
  const [showDisconnectPrompt, setShowDisconnectPrompt] = useState(false);

  const handleClick = () => {
    if (!provider) {
      loadWeb3Modal();
    } else if (screenSize === ScreenSize.Desktop) {
      logoutOfWeb3Modal();
    } else {
      setShowDisconnectPrompt(true);
    }
  }

  return (
    <>
      <button
        className={!provider ? "wallet-btn disconnected" : "wallet-btn connected"}
        onClick={handleClick}>
        <div>
          <span
            className={!provider ? "dot disconnected" : "dot connected"}
            style={{ marginRight: "5px" }} />
          {!provider ? "Connect a Wallet" : screenSize === ScreenSize.Desktop ? "Disconnect Wallet" : `${truncatedAddress(selectedAddress)}`}
        </div>
      </button>
      {showDisconnectPrompt && (
        <Modal title="Disconnect Wallet?" setShowModal={setShowDisconnectPrompt} height="fit-content">
          <div className="disconnect-prompt-wrapper">
            <button className="disconnect" onClick={() => { logoutOfWeb3Modal(); setShowDisconnectPrompt(false); }}>Disconnect Wallet</button>
            <button onClick={() => setShowDisconnectPrompt(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </>
  );
}
