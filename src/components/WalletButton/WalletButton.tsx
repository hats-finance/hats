import { useSelector } from "react-redux";
import { ScreenSize } from "../../constants/constants";
import { RootState } from "../../reducers";
import { truncatedAddress } from "../../utils";
import "./WalletButton.scss";

export default function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";
  
  const handleClick = () => {
    if (!provider) {
      loadWeb3Modal();
    } else {
      logoutOfWeb3Modal();
    }
  }

  return (
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
  );
}
