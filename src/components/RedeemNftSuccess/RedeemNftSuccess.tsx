import RadioButtonChecked from "assets/icons/radio-button-checked.svg";
import { useTranslation } from "react-i18next";
import DiscordIcon from "assets/icons/social/discord.icon";
import { DISCORD_ENTRY_CHANNEL, ScreenSize } from "constants/constants";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import RedeemWalletSuccessIcon from "assets/icons/wallet-nfts/wallet-redeem-success.svg";
import "./index.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import NFTCard from "components/NFTCard/NFTCard";
import { RootState } from "reducers";
import { useSelector } from "react-redux";
import { INFTTokenInfoRedeemed } from "types/types";

export default function RedeemNftSuccess({ redeemed }: { redeemed: INFTTokenInfoRedeemed[] }) {
  const { t } = useTranslation();
  const { screenSize } = useSelector((state: RootState) => state.layoutReducer);

  const vaultsNames = new Set();
  const nfts = redeemed.map((nft, index) => {
    const vaultName = nft.metadata.attributes.find(attr => attr.trait_type === "Vault")?.value;
    vaultsNames.add(vaultName)
    return (
      <SwiperSlide key={index} className="swiper-slide">
        <NFTCard key={index} tokenInfo={nft} />
      </SwiperSlide>
    )
  })

  return (
    <div className="airdrop-redeem-success-wrapper">
      <img className="airdrop-redeem-success__icon" src={RedeemWalletSuccessIcon} alt="wallet" />
      <div className="airdrop-redeem-success__title">{t("RedeemNftSuccess.title")}</div>
      <span className="airdrop-redeem-success__sub-title">{t("RedeemNftSuccess.sub-title")}</span>
      <span className="airdrop-redeem-success__projects">
        {`${t("RedeemNftSuccess.text-1")} ${Array.from(vaultsNames).join(', ').replace(/,(?!.*,)/gmi, ` ${t("RedeemNftSuccess.text-8")}`)} ${vaultsNames.size === 1 ? t("RedeemNftSuccess.text-9") : t("RedeemNftSuccess.text-10")} ${t("RedeemNftSuccess.text-2")}`}
        {t("RedeemNftSuccess.text-3")}
      </span>
      <b  >{t("RedeemNftSuccess.text-4")}</b>
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
          spaceBetween={20}
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          slidesPerView={screenSize === ScreenSize.Mobile ? 1 : 2}
          speed={500}
          touchRatio={1.5}
          navigation
          effect={"flip"}>
          {nfts}
        </Swiper>
      </div>
      <div className="airdrop-redeem-success__join-embassy-btn-container">
        <button className="airdrop-redeem-success__join-embassy-btn" onClick={() => window.open(DISCORD_ENTRY_CHANNEL)}>
          <DiscordIcon />
          &nbsp;
          {t("RedeemNftSuccess.button-text")}
        </button>
      </div>
    </div>
  )
}
