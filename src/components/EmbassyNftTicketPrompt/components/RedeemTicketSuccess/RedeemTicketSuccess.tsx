import RadioButtonChecked from "assets/icons/radio-button-checked.svg";
import { useTranslation } from "react-i18next";
import DiscordIcon from "assets/icons/social/discord.icon";
import { DISCORD_ENTRY_CHANNEL } from "constants/constants";
import { ipfsTransformUri } from "utils";
import { Swiper, SwiperSlide } from "swiper/react";
import RedeemWalletSuccessIcon from "assets/icons/wallet-nfts/wallet-redeem-success.svg";
import { useVaults } from "hooks/useVaults";
import "./index.scss";
import "swiper/css";

export default function RedeemTicketSuccess() {
  const { t } = useTranslation();
  const { nftData} = useVaults();

  const nfts = nftData?.nftTokens?.filter(nft => nft.isMerkleTree && !nft.isRedeemed).map(({ nftInfo }, index) =>
    <SwiperSlide key={index} className="swiper-slide">
      <img key={index} src={ipfsTransformUri(nftInfo.image)} alt="nft" />
    </SwiperSlide>
  )

  return (
    <div className="redeem-ticket-success-wrapper">
      <img className="redeem-ticket-success__icon" src={RedeemWalletSuccessIcon} alt="wallet" />
      <div className="redeem-ticket-success__title">{t("EmbassyNftTicketPrompt.RedeemTicketSuccess.title")}</div>
      <span className="redeem-ticket-success__sub-title">{t("EmbassyNftTicketPrompt.RedeemTicketSuccess.sub-title")}</span>
      {t("EmbassyNftTicketPrompt.RedeemTicketSuccess.text-1")}
      <b>{t("EmbassyNftTicketPrompt.RedeemTicketSuccess.text-2")}</b>
      <div className="redeem-ticket-success__features-wrapper">
        <div className="redeem-ticket-success__feature">
          <img src={RadioButtonChecked} alt="radio button" />
          {t("EmbassyNftTicketPrompt.RedeemTicketSuccess.text-3")}
        </div>
        <div className="redeem-ticket-success__feature">
          <img src={RadioButtonChecked} alt="radio button" />
          {t("EmbassyNftTicketPrompt.RedeemTicketSuccess.text-4")}
        </div>
        <div className="redeem-ticket-success__feature">
          <img src={RadioButtonChecked} alt="radio button" />
          {t("EmbassyNftTicketPrompt.RedeemTicketSuccess.text-5")}
        </div>
      </div>
      <div className="redeem-ticket-success__nfts-wrapper">
        <Swiper
          spaceBetween={1}
          slidesPerView={3}
          speed={500}
          touchRatio={1.5}
          navigation={true}
          effect={"flip"}>
          {nfts}
        </Swiper>
      </div>
      <button className="redeem-ticket-success__join-embassy-btn" onClick={() => window.open(DISCORD_ENTRY_CHANNEL)}>
        <DiscordIcon />
        &nbsp;
        {t("EmbassyNftTicketPrompt.RedeemTicketSuccess.button-text")}
      </button>
    </div>
  )
}
