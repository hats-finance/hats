import RadioButtonChecked from "assets/icons/radio-button-checked.svg";
import { useTranslation } from "react-i18next";
import DiscordIcon from "assets/icons/social/discord.icon";
import { DISCORD_ENTRY_CHANNEL } from "constants/constants";
import { ipfsTransformUri } from "utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import RedeemWalletSuccessIcon from "assets/icons/wallet-nfts/wallet-redeem-success.svg";
import "./index.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useVaults } from "hooks/useVaults";
import NFTMedia from "components/NFTMedia";

interface IProps {
  type: "isMerkleTree" | "isDeposit";
}

export default function RedeemNftSuccess({ type }: IProps) {
  const { t } = useTranslation();
  const { nftData, vaults } = useVaults();

  const vaultsNames = new Set();
  const nfts = nftData?.nftTokens?.filter(nft => nft[type] && nft.isRedeemed).map((nft, index) => {

    /** this regex is to handle the special pids that begin with 8 and 9 */
    const formattedPid = /[8-9]?0*([0-9]+)$/gm.exec(String(nft.pid));
    if (formattedPid) {
      const nftVaultName = (vaults?.find(vault => vault.pid === formattedPid[1]))?.description?.["project-metadata"].name;
      if (nftVaultName) vaultsNames.add(nftVaultName);
    }

    return (
      <SwiperSlide key={index} className="swiper-slide">
        <NFTMedia key={index} link={ipfsTransformUri(nft.nftInfo.image)} />
      </SwiperSlide>
    )
  })

  return (
    <div className="airdrop-redeem-success-wrapper">
      <img className="airdrop-redeem-success__icon" src={RedeemWalletSuccessIcon} alt="wallet" />
      <div className="airdrop-redeem-success__title">{t("RedeemNftSuccess.title")}</div>
      <span className="airdrop-redeem-success__sub-title">{t("RedeemNftSuccess.sub-title")}</span>
      {`${t("RedeemNftSuccess.text-1")} ${Array.from(vaultsNames).join(', ').replace(/,(?!.*,)/gmi, ` ${t("RedeemNftSuccess.text-8")}`)} ${t("RedeemNftSuccess.text-2")}`}
      {t("RedeemNftSuccess.text-3")}
      <b>{t("RedeemNftSuccess.text-4")}</b>
      <div className="airdrop-redeem-success__features-wrapper">
        <div className="airdrop-redeem-success__feature">
          <img src={RadioButtonChecked} alt="radio button" />
          {t("RedeemNftSuccess.text-5")}
        </div>
        <div className="airdrop-redeem-success__feature">
          <img src={RadioButtonChecked} alt="radio button" />
          {t("RedeemNftSuccess.text-6")}
        </div>
        <div className="airdrop-redeem-success__feature">
          <img src={RadioButtonChecked} alt="radio button" />
          {t("RedeemNftSuccess.text-7")}
        </div>
      </div>
      <div className="airdrop-redeem-success__nfts-wrapper">
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={1}
          slidesPerView={3}
          speed={500}
          touchRatio={1.5}
          navigation
          effect={"flip"}>
          {nfts}
        </Swiper>
      </div>
      <button className="airdrop-redeem-success__join-embassy-btn" onClick={() => window.open(DISCORD_ENTRY_CHANNEL)}>
        <DiscordIcon />
        &nbsp;
        {t("RedeemNftSuccess.button-text")}
      </button>
    </div>
  )
}
