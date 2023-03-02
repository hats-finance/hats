import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { ChainsConfig } from "@hats-finance/shared";
import ReactDOM from "react-dom";
import { Media } from "components";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { useEscapePressed } from "hooks/useKeyPress";
import { ipfsTransformUri } from "utils";
import OpenInNewTabIcon from "assets/icons/open-in-new-tab.svg";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { INFTTokenMetadata } from "hooks/nft/types";
import "./index.scss";

interface IProps {
  tokenId: string;
  chainId?: number;
  isRedeemed?: boolean;
  tokenMetadata?: INFTTokenMetadata;
}

export function NFTCard({ tokenId, tokenMetadata, isRedeemed = true, chainId }: IProps) {
  const { chain } = useNetwork();
  const { t } = useTranslation();
  const [fullScreen, setFullScreen] = useState(false);
  const tier = tokenMetadata?.attributes.find((attr) => attr.trait_type === "Trust Level")?.value;
  const vaultName = tokenMetadata?.attributes.find((attr) => attr.trait_type === "Vault")?.value;
  const escapePressed = useEscapePressed();

  useEffect(() => {
    if (escapePressed) {
      setFullScreen(false);
    }
  }, [escapePressed]);

  if (!tokenMetadata) return null;

  let openSeaUrl = "";
  if (chainId) {
    if (chain?.testnet) {
      openSeaUrl = `https://testnets.opensea.io/assets/${ChainsConfig[chainId].vaultsNFTContract}/${tokenId}`;
    } else {
      openSeaUrl = `https://opensea.io/assets/${ChainsConfig[chainId].vaultsNFTContract}/${tokenId}`;
    }
  }

  if (fullScreen) {
    return ReactDOM.createPortal(
      <div className="nft-card-full-screen-wrapper">
        <button onClick={() => setFullScreen(false)} className="nft-card-full-screen__close-btn">
          &times;
        </button>
        <div className="nft-card-full-screen__container">
          <Media
            link={ipfsTransformUri(tokenMetadata.animation_url)}
            poster={ipfsTransformUri(tokenMetadata.image)}
            className="nft-card-full-screen__video"
          />
          {isRedeemed && (
            <a className="nft-card-full-screen__opensea-link" href={openSeaUrl} {...defaultAnchorProps}>
              {t("NFTCard.view-on-open-sea")} <img src={OpenInNewTabIcon} alt="" />{" "}
            </a>
          )}
        </div>
      </div>,
      document.body
    );
  }

  return (
    <div className={classNames("nft-card-wrapper", { "not-redeemed": !isRedeemed })} onClick={() => setFullScreen(true)}>
      <Media link={ipfsTransformUri(tokenMetadata.image)} />
      <div className="nft-card__info-container">
        {/* <div className="nft-card__info-title">{roleName}</div> */}
        <div className="nft-card__info-element">
          <div className="nft-card__info-element-title">{t("NFTCard.vault-embassy")}</div>
          <div className="nft-card__info-element-value">{vaultName}</div>
        </div>
        <div className="nft-card__info-element">
          <div className="nft-card__info-element-title">{t("NFTCard.tier")}</div>
          <div className="nft-card__info-element-value">
            {tier} {t("NFTCard.tier-text")}
          </div>
        </div>
      </div>
      <div className={classNames("nft-card__status", { eligible: !isRedeemed, redeemed: isRedeemed })}>
        {isRedeemed ? t("NFTCard.redeemed") : t("NFTCard.eligible")}
      </div>
    </div>
  );
}
