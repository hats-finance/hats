import classNames from "classnames";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTransaction, nftAirdropRedeem } from "../../actions/contractsActions";
import { LocalStorage } from "../../constants/constants";
import { RootState } from "../../reducers";
import { EligibleTokens } from "../../types/types";
import { hashToken, normalizeAddress } from "../../utils";
import "./Redeem.scss";
const bs58 = require('bs58');


interface IProps {
  merkleTree: any
  walletAddress: string
  setPendingWalletAction: Function
}

const removeAddressFromLocalSrorage = (address: string) => {
  const savedItems = JSON.parse(localStorage.getItem(LocalStorage.NFTAirdrop) ?? "[]");
  const addressIndex = savedItems.indexOf(normalizeAddress(address));
  if (addressIndex > -1) {
    savedItems.splice(addressIndex, 1);
  }
  localStorage.setItem(LocalStorage.NFTAirdrop, JSON.stringify(savedItems));
}

export default function Redeem({ merkleTree, walletAddress, setPendingWalletAction }: IProps) {
  const dispatch = useDispatch();
  const [revealed, setRevealed] = useState(false);
  const eligibleTokens = useSelector((state: RootState) => state.dataReducer.airdropEligibleTokens) as EligibleTokens;

  const redeem = async () => {
    const key = Object.keys(eligibleTokens).find(key => eligibleTokens[key] === walletAddress);
    const proof = merkleTree.getHexProof(hashToken(key ?? "", walletAddress));
    setPendingWalletAction(true);
    await createTransaction(
      async () => nftAirdropRedeem(walletAddress, bs58.decode(key).slice(2) ?? "", proof),
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

  const nftImageContainerClass = classNames({
    "nft-image-container": true,
    "revealed": revealed
  })

  return (
    <div className="redeem-wrapper">
      <span>You are part of the hats first airdrop “The crow clan”. Reedeem your NFT and join the clan.</span>
      <div className={nftImageContainerClass}>
        {!revealed && <span>?</span>}
      </div>
      <button onClick={handleClick} className={redeemButtonClass}>{`${!revealed ? "REVEAL" : "REDEEM"}`}</button>
    </div>
  )
}
