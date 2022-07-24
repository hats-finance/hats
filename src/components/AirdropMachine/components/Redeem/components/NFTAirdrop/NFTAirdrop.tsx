import { useTranslation } from "react-i18next";
import RadioButtonChecked from "../../../../../../assets/icons/radio-button-checked.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { AirdropMachineWallet } from "types/types";
import { useTokenActions } from "hooks/tokenContractHooks";
import "swiper/css";
import "./index.scss";

interface IProps {
  data: AirdropMachineWallet;
  closeRedeemModal: () => void;
}

export default function NFTAirdrop({ data, closeRedeemModal }: IProps) {
  const { t } = useTranslation();
  const { redeem, extendedEligibility } = useTokenActions();

  const handleRedeem = async () => {
    await redeem();
    closeRedeemModal();
  }

  const nfts = extendedEligibility?.map(({ tokenUri }, index) =>
    <SwiperSlide key={index}>
      <img key={index} src={tokenUri} alt="nft" />
    </SwiperSlide>
  )
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
          {nfts}
        </Swiper>
      </div>
      <button onClick={handleRedeem} className="fill">{t("AirdropMachine.NFTAirdrop.button-text")}</button>
    </div>
  )
}
