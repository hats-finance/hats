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
import { INFTTokenInfo } from "types/types";

export default function MyNFTs() {
  const { t } = useTranslation();
  const { screenSize } = useSelector((state: RootState) => state.layoutReducer);
  const { nftData } = useVaults();
  const { isShowing: showRedeemNftPrompt, toggle: toggleRedeemNftPrompt } = useModal();
  const [showLoader, setShowLoader] = useState(false);
  const [redeemed, setRedeemed] = useState<INFTTokenInfo[] | undefined>();

  const treeNfts = nftData?.treeTokens?.map((nft, index) =>
    <SwiperSlide key={index} className="my-nfts__slide">
      <NFTCard
        key={index}
        tokenInfo={nft}
      />
    </SwiperSlide>
  )

  const handleRedeem = useCallback(async () => {
    if (!nftData?.treeRedeemables || !nftData.proofRedeemables) return;
    setShowLoader(true);
    let redeemed: INFTTokenInfo[] = [];
    let success = false;
    let tx;
    if (nftData.treeRedeemables.length > 0) {
      tx = await nftData?.redeemTree();
      if (tx?.status) {
        redeemed = [...redeemed, ...nftData?.treeRedeemables];
        success = true;
      }
    }
    if (nftData.proofRedeemables.length > 0) {
      tx = await nftData?.redeemProof();
      if (tx?.status) {
        redeemed = [...redeemed, ...nftData?.proofRedeemables];
      }
    }
    setShowLoader(false);
    setRedeemed(redeemed);
    if (success)
      toggleRedeemNftPrompt();
  }, [nftData, toggleRedeemNftPrompt]);


  const twoTransactions = (nftData?.proofRedeemables?.length ?? 0) > 0 && (nftData?.treeRedeemablesCount ?? 0) > 0;

  return (
    <div className={classNames("my-nfts-wrapper", { "disabled": showLoader })}>
      <span className="my-nfts__title">NFTs</span>
      <div className="my-nfts__airdrop-nfts-container">
        {treeNfts?.length === 0 ? <div className="my-nfts__no-nfts-text">{t("Header.MyAccount.MyNFTs.no-tree-nfts")}</div> : (
          <Swiper
            spaceBetween={20}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={screenSize === ScreenSize.Mobile ? 1 : 2}
            speed={500}
            touchRatio={1.5}
            navigation
            effect={"flip"}>
            {nftData?.nftTokens?.map((nft, index) =>
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
        disabled={!nftData?.isBeforeDeadline || nftData?.treeRedeemablesCount === 0}
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
