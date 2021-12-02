import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LocalStorage, RoutePaths } from "../../constants/constants";
import { RootState } from "../../reducers";
import Modal from "../Shared/Modal";
import "./NFTAirdropNotification.scss";

interface IProps {
  setShowNFTAirdropNotification: any
}

export default function NFTAirdropNotification({ setShowNFTAirdropNotification }: IProps) {
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";

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
        <Link to={{ pathname: RoutePaths.nft_airdrop, search: `walletAddress=${selectedAddress}` }} onClick={handleClick} className="more-details">More Details</Link>
      </div>
    </Modal>
  )
}
