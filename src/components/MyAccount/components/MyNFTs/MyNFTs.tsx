import { useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useVaults } from "hooks/vaults/useVaults";
import { RootState } from "reducers";
import { ScreenSize } from "constants/constants";
import { INFTTokenInfoRedeemed } from "types/types";
import { Loading, RedeemNftSuccess, Modal, NFTCard } from "components";
import useModal from "hooks/useModal";
import { StyledMyNFT } from "./styles";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export default function MyNFTs() {
  const { t } = useTranslation();
  const { screenSize } = useSelector((state: RootState) => state.layoutReducer);
  const { nftData } = useVaults();
  const [showLoader, setShowLoader] = useState(false);
  const [redeemed, setRedeemed] = useState<INFTTokenInfoRedeemed[] | undefined>();
  const { isShowing: showRedeemNftPrompt, show: showNftPrompt, hide: hideNftPrompt } = useModal();

  const handleRedeem = useCallback(async () => {
    if (!nftData?.treeRedeemables || !nftData.proofRedeemables) return;

    setShowLoader(true);

    if (nftData.treeRedeemables.length) {
      await nftData?.redeemTree();
    }

    if (nftData.proofRedeemables.length) {
      await nftData?.redeemProof();
    }

    const refreshed = await nftData?.refreshProofAndRedeemed();
    const redeemed = refreshed?.filter(
      (nft) =>
        nft.isRedeemed &&
        (nftData?.treeRedeemables?.find((r) => nft.tokenId.eq(r.tokenId)) ||
          nftData?.proofRedeemables?.find((r) => nft.tokenId.eq(r.tokenId)))
    );

    if (redeemed?.length) {
      setRedeemed(redeemed);
      showNftPrompt();
    }

    setShowLoader(false);
  }, [nftData, showNftPrompt]);

  const eligible = nftData?.proofRedeemables?.length || (nftData?.treeRedeemablesCount ?? 0);
  const twoTransactions = (nftData?.proofRedeemables?.length ?? 0) > 0 && (nftData?.treeRedeemablesCount ?? 0) > 0;

  return (
    <StyledMyNFT disabled={showLoader}>
      <span className="title">NFTs</span>

      <div className="airdrop-nfts-container">
        {nftData?.withRedeemed?.length === 0 ? (
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
            {nftData?.withRedeemed?.map((nft, index) => (
              <SwiperSlide key={index} className="nfts-slide">
                <NFTCard key={index} tokenInfo={nft} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <div className="info-text-container">
        {twoTransactions && <span className="info-text-1">{t("Header.MyAccount.MyNFTs.two-transactions")}</span>}
      </div>

      <button disabled={!nftData?.isBeforeDeadline || !eligible} onClick={handleRedeem} className="action-btn">
        {t("Header.MyAccount.MyNFTs.redeem")}
        {!nftData?.isBeforeDeadline && <span>&nbsp; ({t("Header.MyAccount.MyNFTs.after-deadline")})</span>}
      </button>

      {showLoader && <Loading />}

      <Modal isShowing={showRedeemNftPrompt} onHide={hideNftPrompt}>
        <RedeemNftSuccess redeemed={redeemed!} />
      </Modal>
    </StyledMyNFT>
  );
}
