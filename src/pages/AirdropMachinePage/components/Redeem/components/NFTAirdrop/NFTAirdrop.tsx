import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import classNames from "classnames";
import Loading from "components/Shared/Loading";
import { useSupportedNetwork } from "hooks/useSupportedNetwork";
import { useEthers } from "@usedapp/core";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./index.scss";
import { useContext } from "react";
import { AirdropMachineContext } from "pages/AirdropMachinePage/components/CheckEligibility/CheckEligibility";
import NFTCard from "components/NFTCard/NFTCard";
import { useSelector } from "react-redux";
import { RootState } from "reducers";
import { ScreenSize } from "constants/constants";

export default function NFTAirdrop() {
  const { t } = useTranslation();
  const { screenSize } = useSelector((state: RootState) => state.layoutReducer);
  const { nftData, handleRedeem, showLoader } = useContext(AirdropMachineContext);
  const isSupportedNetwork = useSupportedNetwork();
  const { account } = useEthers();

  return (
    <div className={classNames("nft-airdrop-wrapper", { "disabled": showLoader })}>
      <span>{t("AirdropMachine.NFTAirdrop.text-1")}</span>
      <section>
        <b>{t("AirdropMachine.NFTAirdrop.text-2")}</b>
        <span>{t("AirdropMachine.NFTAirdrop.text-3")}</span>
      </section>
      <div className="nft-airdrop__nfts-wrapper">
        <Swiper
          spaceBetween={20}
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          slidesPerView={screenSize === ScreenSize.Mobile ? 1 : 2}
          speed={500}
          touchRatio={1.5}
          navigation
          effect={"flip"}>
          {nftData?.treeRedeemables?.map((nftInfo, index) =>
            <SwiperSlide key={index} className="swiper-slide">
              <NFTCard key={index} tokenInfo={nftInfo} />
            </SwiperSlide>
          )}
        </Swiper>
      </div>
      <div className="nft-airdrop__button-container">
        {(!account || !isSupportedNetwork) && <span className="nft-airdrop__error">{t("Shared.wallet-not-connected")}</span>}
        <button onClick={handleRedeem} disabled={!account || !isSupportedNetwork} className="fill">{t("AirdropMachine.NFTAirdrop.button-text")}</button>
      </div>
      {showLoader && <Loading />}
    </div>
  )
}
