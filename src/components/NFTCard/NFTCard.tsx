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

interface IProps {
  tokenInfo: INFTTokenInfo
  width?: string // can be any valid css width value
}

export default function NFTCard({ tokenInfo, width }: IProps) {
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
          {isRedeemed && <a href={openSeaUrl} target="_blank" rel="noreferrer">View on OpenSea</a>}
          <div className="nft-card-full-screen__container">
            <Media link={metadata.animation_url} ipfsLink width="100%" />
          </div>
        </div>, document.body
      )
    )
  }

  return (
    <div className={classNames("nft-card-wrapper", { "not-redeemed": !isRedeemed })} onClick={() => setFullScreen(true)}>
      <Media link={metadata.image} ipfsLink width={width} />
      <div className="nft-card__info-container">
        <div className="nft-card__info-title">{metadata.name}</div>
        <div className="nft-card__info-title">{vaultName}</div>
        <div className="nft-card__info-title">{tier}</div>
      </div>
      {!isRedeemed && <div className="nft-card__eligible-label">{t("NFTCard.eligible")}</div>}
    </div>
  )
}
