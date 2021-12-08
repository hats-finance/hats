import classNames from "classnames";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTransaction, nftAirdropRedeem } from "../../actions/contractsActions";
import { IPFS_PREFIX, LocalStorage } from "../../constants/constants";
import { RootState } from "../../reducers";
import { EligibleTokens } from "../../types/types";
import { hashToken } from "../../utils";
import "./Redeem.scss";
const bs58 = require('bs58');


interface IProps {
  merkleTree: any
  walletAddress: string
  setPendingWalletAction: Function
}

const removeAddressFromLocalSrorage = (address: string) => {
  const savedItems = JSON.parse(localStorage.getItem(LocalStorage.NFTAirdrop) ?? "[]");
  const addressIndex = savedItems.indexOf(address);
  if (addressIndex > -1) {
    savedItems.splice(addressIndex, 1);
  }
  localStorage.setItem(LocalStorage.NFTAirdrop, JSON.stringify(savedItems));
}

export default function Redeem({ merkleTree, walletAddress, setPendingWalletAction }: IProps) {
  const dispatch = useDispatch();
  const [revealed, setRevealed] = useState(false);
  const eligibleTokens = useSelector((state: RootState) => state.dataReducer.airdropEligibleTokens) as EligibleTokens;
  const ipfsLink = Object.keys(eligibleTokens).find(key => eligibleTokens[key] === walletAddress);

  const redeem = async () => {
    const proof = merkleTree.getHexProof(hashToken(ipfsLink ?? "", walletAddress));
    setPendingWalletAction(true);
    await createTransaction(
      async () => nftAirdropRedeem(walletAddress, bs58.decode(ipfsLink).slice(2) ?? "", proof),
      () => { },
      () => { removeAddressFromLocalSrorage(walletAddress); setPendingWalletAction(false); },
      () => { setPendingWalletAction(false); },
      dispatch,
      "NFT Airdrop redeemed successfully"
    );
  }

  const handleClick = () => {
    if (!revealed) {
      setRevealed(true);
    } else {
      redeem();
    }
  }

  const redeemButtonClass = classNames({
    "action-btn": true,
    "redeem-btn": revealed,
    "reveal-btn": !revealed
  })

  return (
    <div className="redeem-wrapper">
      <div className="nft-image-container">
        {!revealed ? <span>?</span> : <img src={`${IPFS_PREFIX}${ipfsLink}`} width="300px" height="300px" alt="nft" />}
      </div>
      <button onClick={handleClick} className={redeemButtonClass}>{`${!revealed ? "REVEAL" : "REDEEM"}`}</button>
    </div>
  )
}
