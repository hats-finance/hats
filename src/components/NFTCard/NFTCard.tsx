import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import Media from "components/Shared/Media/Media";
import { INFTTokenInfo } from "types/types";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { useEthers } from "@usedapp/core";
import { HATVaultsNFTContract } from "constants/constants";
import { useEscapePressed } from "hooks/useKeyPress";
import { ipfsTransformUri } from "utils";
import OpenInNewTabIcon from "assets/icons/open-in-new-tab.svg";

interface IProps {
  tokenInfo: INFTTokenInfo
}

export default function NFTCard({ tokenInfo }: IProps) {
  const { metadata, isRedeemed, tokenId } = tokenInfo;
  const { chainId } = useEthers();
  const { t } = useTranslation();
  const [fullScreen, setFullScreen] = useState(false);
  const tier = metadata.attributes.find(attr => attr.trait_type === "Trust Level")?.value;
  const vaultName = metadata.attributes.find(attr => attr.trait_type === "Vault")?.value;
  const escapePressed = useEscapePressed();

  useEffect(() => {
    if (escapePressed) {
      setFullScreen(false);
    }
  }, [escapePressed])

  let openSeaUrl;
  const nftContract = HATVaultsNFTContract[chainId!];
  if (chainId === 1) {
    openSeaUrl = `https://opensea.io/assets/${nftContract}/${tokenId}`;
  }
  else if (chainId === 4) {
    openSeaUrl = `https://testnets.opensea.io/assets/${nftContract}/${tokenId}`;
  }

  if (fullScreen) {
    return (
      ReactDOM.createPortal(
        <div className="nft-card-full-screen-wrapper">
          <button onClick={() => setFullScreen(false)} className="nft-card-full-screen__close-btn">&times;</button>
          <div className="nft-card-full-screen__container">
            <Media link={ipfsTransformUri(metadata.animation_url)} poster={ipfsTransformUri(metadata.image)} className="nft-card-full-screen__video" />
            {isRedeemed && <a className="nft-card-full-screen__opensea-link" href={openSeaUrl} target="_blank" rel="noreferrer">{t("NFTCard.view-on-open-sea")} <img src={OpenInNewTabIcon} alt="" /> </a>}
          </div>
        </div>, document.body
      )
    )
  }

  return (
    <div className={classNames("nft-card-wrapper", { "not-redeemed": !isRedeemed })} onClick={() => setFullScreen(true)}>
      <Media link={ipfsTransformUri(metadata.image)} />
      <div className="nft-card__info-container">
        <div className="nft-card__info-title">{metadata.name}</div>
        <div className="nft-card__info-element">
          <div className="nft-card__info-element-title">{t("NFTCard.vault-embassy")}</div>
          <div className="nft-card__info-element-value">{vaultName}</div>
        </div>
        <div className="nft-card__info-element">
          <div className="nft-card__info-element-title">{t("NFTCard.tier")}</div>
          <div className="nft-card__info-element-value">{tier} {t("NFTCard.tier-text")}</div>
        </div>
      </div>
      <div className={classNames("nft-card__status", { "eligible": !isRedeemed, "redeemed": isRedeemed })}>
        {isRedeemed ? t("NFTCard.redeemed") : t("NFTCard.eligible")}
      </div>
    </div>
  )
}
