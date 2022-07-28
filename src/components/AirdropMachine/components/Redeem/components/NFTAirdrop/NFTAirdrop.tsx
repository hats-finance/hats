import { useTranslation } from "react-i18next";
import RadioButtonChecked from "assets/icons/radio-button-checked.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { useContext } from "react";
import { AirdropMachineContext } from "components/AirdropMachine/components/CheckEligibility/CheckEligibility";
import classNames from "classnames";
import Loading from "components/Shared/Loading";
import { ipfsTransformUri } from "utils";
import "swiper/css";
import "./index.scss";

export default function NFTAirdrop() {
  const { t } = useTranslation();
  const { closeRedeemModal, nftData: { redeemTree, redeemable, redeemMultipleFromTreeState } } = useContext(AirdropMachineContext);

  const showLoader = redeemMultipleFromTreeState.status === "PendingSignature" || redeemMultipleFromTreeState.status === "Mining";

  const handleRedeem = async (e) => {
    await redeemTree();
    if (redeemMultipleFromTreeState.status === "Success") {
      closeRedeemModal(e);
    }
  }

  const nfts = redeemable?.filter(nft => nft.type === "MerkleTree" && !nft.isRedeemed).map(({ nftInfo }, index) =>
    <SwiperSlide key={index}>
      <img key={index} src={ipfsTransformUri(nftInfo.image)} alt="nft" />
    </SwiperSlide>
  )
  return (
    <div className={classNames("nft-airdrop-wrapper", { "disabled": showLoader })}>
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
      {showLoader && <Loading />}
    </div>
  )
}
