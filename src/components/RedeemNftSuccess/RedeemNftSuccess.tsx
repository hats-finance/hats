import RadioButtonChecked from "assets/icons/radio-button-checked.svg";
import { useTranslation } from "react-i18next";
import DiscordIcon from "assets/icons/social/discord.icon";
import { DISCORD_ENTRY_CHANNEL } from "constants/constants";
//import { ipfsTransformUri } from "utils";
//import { Swiper, SwiperSlide } from "swiper/react";
import RedeemWalletSuccessIcon from "assets/icons/wallet-nfts/wallet-redeem-success.svg";
//import { useContext } from "react";
//import { AirdropMachineContext } from "components/AirdropMachine/components/CheckEligibility/CheckEligibility";
import "./index.scss";
import "swiper/css";
//import NFTMedia from "components/NFTMedia";

export default function RedeemNftSuccess() {
  const { t } = useTranslation();
  // const { nftData } = useContext(AirdropMachineContext);

  // const nfts = nftData?.nftTokens?.filter(nft => nft.isMerkleTree && nft.isRedeemed).map(({ nftInfo }, index) =>
  //   <SwiperSlide key={index} className="swiper-slide">
  //     <NFTMedia key={index} link={ipfsTransformUri(nftInfo.image)} />
  //   </SwiperSlide>
  // )

  return (
    <div className="airdrop-redeem-success-wrapper">
      <img className="airdrop-redeem-success__icon" src={RedeemWalletSuccessIcon} alt="wallet" />
      <div className="airdrop-redeem-success__title">{t("RedeemNftSuccess.title")}</div>
      <span className="airdrop-redeem-success__sub-title">{t("RedeemNftSuccess.sub-title")}</span>
      {t("RedeemNftSuccess.text-1")}
      <b>{t("RedeemNftSuccess.text-2")}</b>
      <div className="airdrop-redeem-success__features-wrapper">
        <div className="airdrop-redeem-success__feature">
          <img src={RadioButtonChecked} alt="radio button" />
          {t("RedeemNftSuccess.text-3")}
        </div>
        <div className="airdrop-redeem-success__feature">
          <img src={RadioButtonChecked} alt="radio button" />
          {t("RedeemNftSuccess.text-4")}
        </div>
        <div className="airdrop-redeem-success__feature">
          <img src={RadioButtonChecked} alt="radio button" />
          {t("RedeemNftSuccess.text-5")}
        </div>
      </div>
      {/* <div className="airdrop-redeem-success__nfts-wrapper">
        <Swiper
          spaceBetween={1}
          slidesPerView={3}
          speed={500}
          touchRatio={1.5}
          navigation={true}
          effect={"flip"}>
          {nfts}
        </Swiper>
      </div> */}
      <button className="airdrop-redeem-success__join-embassy-btn" onClick={() => window.open(DISCORD_ENTRY_CHANNEL)}>
        <DiscordIcon />
        &nbsp;
        {t("RedeemNftSuccess.button-text")}
      </button>
    </div>
  )
}
