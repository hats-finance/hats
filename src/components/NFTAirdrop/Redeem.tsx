import axios from "axios";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTransaction, nftAirdropRedeem } from "../../actions/contractsActions";
import { IPFS_BASE_URI, IPFS_PREFIX, LocalStorage } from "../../constants/constants";
import { RootState } from "../../reducers";
import { EligibleTokens, IAirdropElement } from "../../types/types";
import { hashToken } from "../../utils";
import { EligibilityStatus } from "./NFTAirdrop";
import "./Redeem.scss";

interface IProps {
  merkleTree: any
  walletAddress: string
  setPendingWalletAction: Function
  clearInput: Function
  eligibilityStatus: EligibilityStatus
  reveal: boolean
}

const removeAddressFromLocalStorage = (address: string) => {
  const savedItems = JSON.parse(localStorage.getItem(LocalStorage.NFTAirdrop) ?? "[]");
  const addressIndex = savedItems.indexOf(address);
  if (addressIndex > -1) {
    savedItems.splice(addressIndex, 1);
  }
  localStorage.setItem(LocalStorage.NFTAirdrop, JSON.stringify(savedItems));
}

export default function Redeem({ merkleTree, walletAddress, setPendingWalletAction, clearInput, eligibilityStatus, reveal }: IProps) {
  const dispatch = useDispatch();
  const [revealed, setRevealed] = useState((eligibilityStatus === EligibilityStatus.REDEEMED || reveal) ? true : false);
  const [nftData, setNftData] = useState<IAirdropElement>();
  const eligibleTokens = useSelector((state: RootState) => state.dataReducer.airdropEligibleTokens) as EligibleTokens;
  const nftIndex = Object.keys(eligibleTokens).find(key => eligibleTokens[key] === walletAddress);

  useEffect(() => {
    (async () => {
      try {
        const data = await axios.get(`${IPFS_PREFIX}${IPFS_BASE_URI}/${nftIndex}.json`);
        setNftData(data.data);
      } catch (error) {
        console.error(error);
        // TODO: show error
      }
    })();
  }, [nftIndex])

  const redeem = async () => {
    const proof = merkleTree.getHexProof(hashToken(nftIndex ?? "", walletAddress));
    setPendingWalletAction(true);
    await createTransaction(
      async () => nftAirdropRedeem(walletAddress, nftIndex ?? "", proof),
      () => { },
      () => { removeAddressFromLocalStorage(walletAddress); setPendingWalletAction(false); clearInput(); },
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
        {!revealed ? <span>?</span> : <img src={nftData?.image} width="300px" height="300px" alt="nft" />}
      </div>
      {eligibilityStatus !== EligibilityStatus.REDEEMED && <button onClick={handleClick} className={redeemButtonClass}>{`${!revealed ? "REVEAL" : "REDEEM"}`}</button>}
    </div>
  )
}
