import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import Loading from "../Shared/Loading";
import RedeemTicketSuccess from "./components/RedeemTicketSuccess/RedeemTicketSuccess";
import classNames from "classnames";
import { useVaults } from "hooks/useVaults";
import "./index.scss";
import "swiper/css";

export default function EmbassyNftTicketPrompt() {
  const { t } = useTranslation();
  const { nftData } = useVaults();

  if (nftData?.redeemMultipleFromSharesState.status === "Success") {
    return <RedeemTicketSuccess />
  }

  const showLoader = nftData?.redeemMultipleFromSharesState.status === "PendingSignature" || nftData?.redeemMultipleFromSharesState.status === "Mining";

  const nfts = nftData?.redeemable?.filter(nft => nft.type === "Deposit" && nft.isEligibile).map(({ tokenUri }, index) =>
    <SwiperSlide key={index}>
      <img key={index} src={tokenUri} alt="nft" />
    </SwiperSlide>)

  return (
    <div className={classNames("embassy-nft-ticket-wrapper", { "disabled": showLoader })}>
      {t("EmbassyNftTicketPrompt.text")}
      <Swiper
        spaceBetween={1}
        slidesPerView={3}
        speed={500}
        touchRatio={1.5}
        navigation={true}
        effect={"flip"}>
        {nfts}
      </Swiper>
      <button onClick={nftData?.redeemShares} className="embassy-nft-ticket__redeem-btn fill">{t("EmbassyNftTicketPrompt.button-text")}</button>
      {showLoader && <Loading />}
    </div>
  )
}
