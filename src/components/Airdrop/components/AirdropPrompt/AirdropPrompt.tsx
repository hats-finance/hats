import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";
import { RootState } from "reducers";
import { LocalStorage, RoutePaths, ScreenSize } from "../../../../constants/constants";
import { truncatedAddress } from "../../../../utils";
import Modal from "../../../Shared/Modal";
import "./index.scss";
import { useEthers } from "@usedapp/core";

interface IProps {
  closePrompt: () => void;
}

export default function AirdropPrompt({ closePrompt }: IProps) {
  const currentScreenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const { account } = useEthers()

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem(LocalStorage.Airdrop) ?? "[]");
    savedItems.push(account);
    localStorage.setItem(LocalStorage.Airdrop, JSON.stringify(savedItems));
  }, [account])

  return (
    <Modal title="AIRDROP" setShowModal={closePrompt} height="fit-content">
      <Confetti numberOfPieces={currentScreenSize === ScreenSize.Mobile ? 50 : 200} />
      <div className="airdrop-prompt-wrapper">
        <h2>Congrats!</h2>
        <span>You are eligible to Hats Airdrop!</span>
        <div className="wallet-address-container">
          <span>Eligible wallet address:</span>
          <span className="wallet-address">{`${truncatedAddress(account!)}`}</span>
        </div>
        <Link to={{ pathname: RoutePaths.airdrop, search: `walletAddress=${account}` }} onClick={closePrompt} className="reveal-link">SHOW ME</Link>
      </div>
    </Modal>
  )
}
