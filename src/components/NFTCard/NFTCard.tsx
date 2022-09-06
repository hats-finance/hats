import { useState } from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import Media from "components/Shared/Media/Media";
import { TokenInfo } from "types/types";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

interface IProps {
  tokenInfo: TokenInfo
  width?: string // can be any valid css width value
  isRedeemed?: boolean
}

export default function NFTCard({ tokenInfo, width, isRedeemed }: IProps) {
  const { t } = useTranslation();
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
    <div className={classNames("nft-card-wrapper", { "not-redeemed": !isRedeemed })} onClick={() => setFullScreen(true)}>
      <Media link={tokenInfo.image} ipfsLink width={width} />
      <div className="nft-card__info-container">
        <div className="nft-card__info-title">{tokenInfo.name}</div>
      </div>
      {!isRedeemed && <div className="nft-card__eligible-label">{t("NFTCard.eligible")}</div>}
    </div>
  )
}
