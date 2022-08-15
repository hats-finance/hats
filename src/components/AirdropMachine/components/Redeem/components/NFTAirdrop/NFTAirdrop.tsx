import { useTranslation } from "react-i18next";
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
  const { nftData: { redeemTree, nftTokens, redeemMultipleFromTreeState } } = useContext(AirdropMachineContext);

  const showLoader = ["PendingSignature", "Mining"].includes(redeemMultipleFromTreeState.status);

  const handleRedeem = async () => {
    await redeemTree();
  }

  const nfts = nftTokens?.filter(nft => nft.isMerkleTree && !nft.isRedeemed).map(({ nftInfo }, index) =>
    <SwiperSlide key={index} className="swiper-slide">
      <img key={index} src={ipfsTransformUri(nftInfo.image)} alt="nft" />
    </SwiperSlide>
  )
  return (
    <div className={classNames("nft-airdrop-wrapper", { "disabled": showLoader })}>
      <span>{t("AirdropMachine.NFTAirdrop.text-1")}</span>
      <section>
        <b>{t("AirdropMachine.NFTAirdrop.text-2")}</b>
        <span>{t("AirdropMachine.NFTAirdrop.text-3")}</span>
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
