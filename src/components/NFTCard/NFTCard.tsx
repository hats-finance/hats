import { useState } from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import Media from "components/Shared/Media/Media";
import { TokenInfo } from "types/types";

interface IProps {
  tokenInfo: TokenInfo
  width?: string // can be any valid css width value
}

export default function NFTCard({ tokenInfo, width }: IProps) {
  const [fullScreen, setFullScreen] = useState(false);

  if (fullScreen) {
    return (
      ReactDOM.createPortal(
        <div className="nft-card-full-screen-wrapper">
          <button onClick={() => setFullScreen(false)} className="nft-card-full-screen__close-btn">&times;</button>
          <div className="nft-card-full-screen__container">
            <Media link={tokenInfo.image} ipfsLink width="100%" />
          </div>
        </div>, document.body
      )
    )
  }

  return (
    <div className="nft-card-wrapper" onClick={() => setFullScreen(true)}>
      <Media link={tokenInfo.image} ipfsLink width={width} />
      <div className="nft-card__info-container">
        <div className="nft-card__info-title">{tokenInfo.name}</div>
      </div>
    </div>
  )
}
