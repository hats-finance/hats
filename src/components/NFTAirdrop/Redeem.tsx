import classNames from "classnames";
import { useState } from "react";
import "./Redeem.scss";

export default function Redeem() {
  const [revealed, setRevealed] = useState(false);

  const handleClick = () => {
    if (!revealed) {
      setRevealed(true); 
    } else {
      console.log("redeeming...");
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
      <button onClick={handleClick} className={redeemButtonClass}>{`${!revealed ? "REVEAL" : "REDEEM" }`}</button>
    </div>
  )
}
