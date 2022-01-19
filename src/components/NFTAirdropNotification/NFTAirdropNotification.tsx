import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LocalStorage, RoutePaths } from "../../constants/constants";
import { RootState } from "../../reducers";
import { normalizeAddress, truncatedAddress } from "../../utils";
import Modal from "../Shared/Modal";
import NFTIcon from "../../assets/icons/nft.svg";
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
    const savedItems = JSON.parse(localStorage.getItem(LocalStorage.NFTAirdrop) ?? "[]");
    savedItems.push(normalizeAddress(selectedAddress));
    localStorage.setItem(LocalStorage.NFTAirdrop, JSON.stringify(savedItems));
  }, [selectedAddress])

  return (
    <Modal title="NFT AIRDROP" setShowModal={setShowNFTAirdropNotification} height="fit-content" icon={NFTIcon}>
      <div className="nft-airdrop-notification-wrapper">
        <h2>Congrats!</h2>
        <span>You are eligible to Hats first NFT airdrop “The crow clan” collection.</span>
        <div className="wallet-address-container">
          <span>Eligible wallet address:</span>
          <span className="wallet-address">{`${truncatedAddress(selectedAddress)}`}</span>
        </div>
        <span>Reveal your NFT and find out more on the crow clan collection.</span>
        <div className="question-mark">?</div>
        <Link to={{ pathname: RoutePaths.nft_airdrop, search: `walletAddress=${selectedAddress}` }} onClick={handleClick} className="reveal-link">REVEAL</Link>
      </div>
    </Modal>
  )
}
