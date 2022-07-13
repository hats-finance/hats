import { IPFS_PREFIX } from "constants/constants";
import { useTranslation } from "react-i18next";
import RadioButtonChecked from "../../../../../../assets/icons/radio-button-checked.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./index.scss";

const TEMP_IPFS_NFT_COLLECTION = "QmSiPFLfYwodihG94ASaiWJuQ6uLUXkz8p8kvoCTv8KraP";
const TEMP_NFTS = ["892", "342", "427", "374"];

export default function NFTAirdrop() {
  const { t } = useTranslation();

  const nftsSlides = TEMP_NFTS.map((nft) => {
    return (
      <SwiperSlide>
        <img key={nft} src={`${IPFS_PREFIX}/${TEMP_IPFS_NFT_COLLECTION}/${nft}.png`} alt="nft" />
      </SwiperSlide>
    )
  })

  return (
    <div className="nft-airdrop-wrapper">
      <span>{t("AirdropMachine.NFTAirdrop.text-1")}</span>
      <section>
        <b>{t("AirdropMachine.NFTAirdrop.text-2")}</b>
        <div className="nft-airdrop__features-wrapper">
          <div className="nft-airdrop__feature">
            <img src={RadioButtonChecked} alt="radio button" />
            {t("AirdropMachine.NFTAirdrop.text-3")}
          </div>
          <div className="nft-airdrop__feature">
            <img src={RadioButtonChecked} alt="radio button" />
            {t("AirdropMachine.NFTAirdrop.text-4")}
          </div>
          <div className="nft-airdrop__feature">
            <img src={RadioButtonChecked} alt="radio button" />
            {t("AirdropMachine.NFTAirdrop.text-5")}
          </div>
          <div className="nft-airdrop__feature">
            <img src={RadioButtonChecked} alt="radio button" />
            {t("AirdropMachine.NFTAirdrop.text-6")}
          </div>
        </div>
      </section>
      <div className="nft-airdrop__nfts-wrapper">
        <Swiper
          spaceBetween={1}
          slidesPerView={3}
          speed={500}
          touchRatio={1.5}
          navigation={true}
          effect={"flip"}>
          {nftsSlides}
        </Swiper>
      </div>
      <button className="fill">{t("AirdropMachine.NFTAirdrop.button-text")}</button>
    </div>
  )
}
