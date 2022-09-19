import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { useVaults } from "hooks/useVaults";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import Loading from "components/Shared/Loading";
import "./index.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Modal from "components/Shared/Modal/Modal";
import RedeemNftSuccess from "components/RedeemNftSuccess/RedeemNftSuccess";
import useModal from "hooks/useModal";
import { useCallback, useState } from "react";
import NFTCard from "components/NFTCard/NFTCard";
import { useSelector } from "react-redux";
import { RootState } from "reducers";
import { ScreenSize } from "constants/constants";
import { INFTTokenInfoRedeemed } from "types/types";
import { TransactionReceipt } from "@ethersproject/providers";

export default function MyNFTs() {
  const { t } = useTranslation();
  const { screenSize } = useSelector((state: RootState) => state.layoutReducer);
  const { nftData } = useVaults();
  const { isShowing: showRedeemNftPrompt, toggle: toggleRedeemNftPrompt } = useModal();
  const [showLoader, setShowLoader] = useState(false);
  const [redeemed, setRedeemed] = useState<INFTTokenInfoRedeemed[] | undefined>();

  const handleRedeem = useCallback(async () => {
    if (!nftData?.treeRedeemables || !nftData.proofRedeemables) return;
    setShowLoader(true);
    let txTree: TransactionReceipt | undefined;
    if (nftData.treeRedeemables.length) {
      txTree = await nftData?.redeemTree();
    }
    let txProof: TransactionReceipt | undefined;
    if (nftData.proofRedeemables.length) {
      txProof = await nftData?.redeemProof();
    }

    const refreshed = await nftData?.refreshRedeemed();
    const redeemed: INFTTokenInfoRedeemed[] = [];
    if (refreshed) {
      if (txTree?.status)
        redeemed.push(...refreshed.filter(nft => nft.isRedeemed &&
          nftData.treeRedeemables?.find(r => r.tokenId.eq(nft.tokenId))));
      if (txProof?.status)
        redeemed.push(...refreshed?.filter(nft => nft.isRedeemed &&
          nftData.proofRedeemables?.find(r => r.tokenId.eq(nft.tokenId))));
    }
    if (redeemed.length) {
      setRedeemed(redeemed);
      toggleRedeemNftPrompt();
    }
    setShowLoader(false);
  }, [nftData, toggleRedeemNftPrompt]);

  const eligible = nftData?.proofRedeemables?.length || (nftData?.treeRedeemablesCount ?? 0);
  const twoTransactions = (nftData?.proofRedeemables?.length ?? 0) > 0 && (nftData?.treeRedeemablesCount ?? 0) > 0;


  return (
    <div className={classNames("my-nfts-wrapper", { "disabled": showLoader })}>
      <span className="my-nfts__title">NFTs</span>
      <div className="my-nfts__airdrop-nfts-container">
        {nftData?.withRedeemed?.length === 0 ? <div className="my-nfts__no-nfts-text">{t("Header.MyAccount.MyNFTs.no-tree-nfts")}</div> : (
          <Swiper
            spaceBetween={20}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={screenSize === ScreenSize.Mobile ? 1 : 2}
            speed={500}
            touchRatio={1.5}
            navigation
            effect={"flip"}>
            {nftData?.withRedeemed?.map((nft, index) =>
              <SwiperSlide key={index} className="my-nfts__slide">
                <NFTCard
                  key={index}
                  tokenInfo={nft}
                />
              </SwiperSlide>
            )}
          </Swiper>
        )}
      </div>
      <div className="my-nfts__info-text-container">
        {twoTransactions &&
          <span className="my-nfts__info-text-1">{t("Header.MyAccount.MyNFTs.two-transactions")}</span>}
      </div>
      <button
        disabled={!nftData?.isBeforeDeadline || !eligible}
        onClick={handleRedeem}
        className="my-nfts__action-btn">
        {t("Header.MyAccount.MyNFTs.redeem")}
        {!nftData?.isBeforeDeadline && <span>&nbsp; ({t("Header.MyAccount.MyNFTs.after-deadline")})</span>}
      </button>
      {showLoader && <Loading />}
      <Modal
        isShowing={showRedeemNftPrompt}
        hide={toggleRedeemNftPrompt}>
        <RedeemNftSuccess redeemed={redeemed!} />
      </Modal>
    </div>
  )
}
