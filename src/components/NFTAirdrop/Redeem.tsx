import classNames from "classnames";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTransaction, nftAirdropRedeem } from "../../actions/contractsActions";
import { IPFS_ELIGIBLE_TOKENS } from "../../constants/constants";
import { RootState } from "../../reducers";
import { EligibleTokens } from "../../types/types";
import { hashToken } from "../../utils";
import "./Redeem.scss";
const bs58 = require('bs58');

interface IProps {
  merkleTree: any
  walletAddress: string
}

export default function Redeem({ merkleTree, walletAddress }: IProps) {
  const dispatch = useDispatch();
  const [revealed, setRevealed] = useState(false);
  const eligibleTokens = useSelector((state: RootState) => state.dataReducer.airdropEligibleTokens) as EligibleTokens;

  const redeem = async () => {
    const key = Object.keys(eligibleTokens).find(key => eligibleTokens[key] === walletAddress);
    const proof = merkleTree.getHexProof(hashToken(key ?? "", walletAddress));
    await createTransaction(
      async () => nftAirdropRedeem(walletAddress, bs58.decode(IPFS_ELIGIBLE_TOKENS), proof),
      () => {},
      () => {},
      () => {},
      dispatch
    )
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
