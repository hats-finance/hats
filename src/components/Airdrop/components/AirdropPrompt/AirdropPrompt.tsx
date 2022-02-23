import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LocalStorage, RoutePaths } from "../../../../constants/constants";
import { truncatedAddress } from "../../../../utils";
import Modal from "../../../Shared/Modal";
import "./index.scss";

interface IProps {
  address: string;
  closePrompt: () => void;
}

export default function AirdropPrompt({ address, closePrompt }: IProps) {

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem(LocalStorage.Airdrop) ?? "[]");
    savedItems.push(address);
    localStorage.setItem(LocalStorage.Airdrop, JSON.stringify(savedItems));
  }, [address])

  return (
    <Modal title="AIRDROP" setShowModal={closePrompt} height="fit-content">
      <div className="airdrop-prompt-wrapper">
        <h2>Congrats!</h2>
        <span>You are eligible to Hats Airdrop!</span>
        <div className="wallet-address-container">
          <span>Eligible wallet address:</span>
          <span className="wallet-address">{`${truncatedAddress(address)}`}</span>
        </div>
        <Link to={{ pathname: RoutePaths.airdrop, search: `walletAddress=${address}` }} onClick={closePrompt} className="reveal-link">SHOW ME</Link>
      </div>
    </Modal>
  )
}
