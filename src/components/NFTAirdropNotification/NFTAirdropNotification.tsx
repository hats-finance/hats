import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LocalStorage, RoutePaths } from "../../constants/constants";
import Modal from "../Shared/Modal";
import "./NFTAirdropNotification.scss";

interface IProps {
  setShowNFTAirdropNotification: any
}

export default function NFTAirdropNotification({ setShowNFTAirdropNotification }: IProps) {

  const handleClick = () => {
    setShowNFTAirdropNotification(false);
  }

  useEffect(() => {
    localStorage.setItem(LocalStorage.NFTAirdrop, "1");
  }, [])

  return (
    <Modal title="Congratulations!" setShowModal={setShowNFTAirdropNotification} height="fit-content">
      <div className="nft-airdrop-notification-wrapper">
        <span>Your current connected wallet is eligible for NFT Airdrop!</span>
        <span className="question-mark">?</span>
        <Link to={RoutePaths.nft_airdrop} onClick={handleClick}>More Details</Link>
      </div>
    </Modal>
  )
}
