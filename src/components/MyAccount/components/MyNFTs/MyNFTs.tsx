import { useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useVaults } from "hooks/vaults/useVaults";
import { RootState } from "reducers";
import { ScreenSize } from "constants/constants";
import { Loading, RedeemNftSuccess, Modal, NFTCard } from "components";
import useModal from "hooks/useModal";
import { StyledMyNFT } from "./styles";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { INFTTokenInfoRedeemed } from "hooks/nft/types";

export default function MyNFTs() {
  const { t } = useTranslation();
  const { screenSize } = useSelector((state: RootState) => state.layoutReducer);
  const [showLoader, setShowLoader] = useState(false);
  const [redeemed, setRedeemed] = useState<INFTTokenInfoRedeemed[] | undefined>();
  const { isShowing: showRedeemNftPrompt, show: showNftPrompt, hide: hideNftPrompt } = useModal();

  const handleRedeem = useCallback(async () => {
    // if (!depositTokensData?.depositTokens) return;

    // setShowLoader(true);
    // const redeemed = await depositTokensData.redeem();
    // if (redeemed?.length) {
    //   setRedeemed(redeemed);
    //   showNftPrompt();
    // }

    setShowLoader(false);
  }, []);

  const depositTokens: INFTTokenInfoRedeemed[] = [];

  const eligible = depositTokens?.some((nft) => !nft.isRedeemed);

  return (
    <StyledMyNFT disabled={showLoader}>
      <span className="title">NFTs</span>

      <div className="airdrop-nfts-container">
        {depositTokens?.length === 0 ? (
          <div className="no-nfts-text">{t("Header.MyAccount.MyNFTs.no-tree-nfts")}</div>
        ) : (
          <Swiper
            spaceBetween={20}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={screenSize === ScreenSize.Mobile ? 1 : 2}
            speed={500}
            touchRatio={1.5}
            navigation
            effect={"flip"}>
            {depositTokens?.map((nft, index) => (
              <SwiperSlide key={index} className="nfts-slide">
                <NFTCard key={index} tokenInfo={nft} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* <div className="info-text-container">
        {twoTransactions && <span className="info-text-1">{t("Header.MyAccount.MyNFTs.two-transactions")}</span>}
      </div> */}

      <button disabled={!eligible} onClick={handleRedeem} className="action-btn">
        {t("Header.MyAccount.MyNFTs.redeem")}
        {/* {!nftData?.isBeforeDeadline && <span>&nbsp; ({t("Header.MyAccount.MyNFTs.after-deadline")})</span>} */}
      </button>

      {showLoader && <Loading />}

      <Modal isShowing={showRedeemNftPrompt} onHide={hideNftPrompt}>
        <RedeemNftSuccess redeemed={redeemed!} />
      </Modal>
    </StyledMyNFT>
  );
}
