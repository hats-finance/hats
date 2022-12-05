import { useContext } from "react";
import { useAccount } from "wagmi";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import classNames from "classnames";
import { NFTCard } from "components";
import { useSupportedNetwork } from "hooks";
import { RootState } from "reducers";
import { ScreenSize } from "constants/constants";
import { AirdropMachineContext } from "pages/AirdropMachinePage/context";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./index.scss";

export default function NFTAirdrop() {
  const { t } = useTranslation();
  const { screenSize } = useSelector((state: RootState) => state.layoutReducer);
  const { airdropData, handleRedeem } = useContext(AirdropMachineContext);
  const isSupportedNetwork = useSupportedNetwork();
  const { address: account } = useAccount();

  return (
    <div className={classNames("nft-airdrop-wrapper")}>
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
          {airdropData?.airdropTokens?.map((nftInfo, index) => (
            <SwiperSlide key={index} className="swiper-slide">
              <NFTCard key={index} tokenInfo={nftInfo} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="nft-airdrop__button-container">
        {(!account || !isSupportedNetwork) && <span className="nft-airdrop__error">{t("Shared.wallet-not-connected")}</span>}
        <button onClick={handleRedeem} disabled={!account || !isSupportedNetwork} className="fill">
          {t("AirdropMachine.NFTAirdrop.button-text")}
        </button>
      </div>
    </div>
  );
}
