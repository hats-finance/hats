import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { useCallback, useState } from "react";
import RedeemWalletSuccessIcon from "assets/icons/wallet-nfts/wallet-redeem-success.svg";
import { NFTCard, Loading, RedeemNftSuccess } from "components";
import { RootState } from "reducers";
import { ScreenSize } from "constants/constants";
import { INFTTokenInfoRedeemed } from "hooks/nft/types";
import "./index.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

interface IProps {
  availableNftsToRedeem: INFTTokenInfoRedeemed[];
  handleRedeem?: () => Promise<INFTTokenInfoRedeemed[] | undefined>;
}
export default function EmbassyNftRedeem({ availableNftsToRedeem, handleRedeem }: IProps) {
  const { t } = useTranslation();
  const { screenSize } = useSelector((state: RootState) => state.layoutReducer);
  const [loading, setLoading] = useState(false);
  const [redeemed, setRedeemed] = useState<INFTTokenInfoRedeemed[] | undefined>();

  const showLoader = !redeemed && loading;

  const handleRedeemAndShowRedeemed = useCallback(async () => {
    if (!handleRedeem) return;
    setLoading(true);
    const redeemedNfts = await handleRedeem();

    setRedeemed(redeemedNfts);
    setLoading(false);
  }, [handleRedeem]);

  if (redeemed) return <RedeemNftSuccess redeemed={redeemed} />;

  return (
    <div className={classNames("embassy-nft-ticket-wrapper", { disabled: showLoader })}>
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
        {availableNftsToRedeem.map((nftInfo, index) => (
          <SwiperSlide key={index}>
            <NFTCard key={index} tokenInfo={nftInfo} />
          </SwiperSlide>
        ))}
      </Swiper>
      <button onClick={handleRedeemAndShowRedeemed} className="embassy-nft-ticket__redeem-btn fill">
        {t("EmbassyNftTicketPrompt.button-text")}
      </button>
      {showLoader && <Loading extraText={`${t("redeemingNft")}...`} />}
    </div>
  );
}
