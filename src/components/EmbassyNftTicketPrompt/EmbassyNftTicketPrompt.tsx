import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import Loading from "../Shared/Loading";
import classNames from "classnames";
import { useVaults } from "hooks/useVaults";
import { useCallback, useState } from "react";
import RedeemWalletSuccessIcon from "assets/icons/wallet-nfts/wallet-redeem-success.svg";
import "./index.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import RedeemNftSuccess from "components/RedeemNftSuccess/RedeemNftSuccess";
import NFTCard from "components/NFTCard/NFTCard";
import { useSelector } from "react-redux";
import { RootState } from "reducers";
import { ScreenSize } from "constants/constants";

export default function EmbassyNftTicketPrompt() {
  const { t } = useTranslation();
  const { screenSize } = useSelector((state: RootState) => state.layoutReducer);
  const { nftData } = useVaults();
  const [loading, setLoading] = useState(false);
  const [redeemed, setRedeemed] = useState(false);

  const showLoader = !redeemed && loading;

  const handleRedeem = useCallback(async () => {
    try {
      setLoading(true);
      await nftData?.redeemShares();
      setLoading(false);
      setRedeemed(true);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, [nftData]);

  const nfts = nftData?.proofTokens?.map((nftInfo, index) =>
    <SwiperSlide key={index}>
      <NFTCard key={index} tokenInfo={nftInfo} />
    </SwiperSlide>)

  if (redeemed) return <RedeemNftSuccess type="isDeposit" />;
  return (
    <div className={classNames("embassy-nft-ticket-wrapper", { "disabled": showLoader })}>
      <img className="embassy-nft-ticket__icon" src={RedeemWalletSuccessIcon} alt="wallet" />
      <div className="embassy-nft-ticket__title">{t("EmbassyNftTicketPrompt.title")}</div>
      {t("EmbassyNftTicketPrompt.text")}
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
      <button onClick={handleRedeem} className="embassy-nft-ticket__redeem-btn fill">{t("EmbassyNftTicketPrompt.button-text")}</button>
      {showLoader && <Loading />}
    </div>
  )
}
