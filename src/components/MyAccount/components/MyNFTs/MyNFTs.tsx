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

export default function MyNFTs() {
  const { t } = useTranslation();
  const { screenSize } = useSelector((state: RootState) => state.layoutReducer);
  const { nftData } = useVaults();
  const { isShowing: showRedeemNftPrompt, toggle: toggleRedeemNftPrompt } = useModal();
  const [showLoader, setShowLoader] = useState(false);
  const [redeemType, setRedeemType] = useState<"isMerkleTree" | "isDeposit">()

  const treeNfts = nftData?.nftTokens?.filter(nft => nft.isMerkleTree).map((nft, index) =>
    <SwiperSlide key={index} className="my-nfts__slide">
      <NFTCard
        key={index}
        tokenInfo={nft}
      />
    </SwiperSlide>
  )

  const depositNfts = nftData?.nftTokens?.filter(nft => nft.isDeposit).map((nft, index) =>
    <SwiperSlide key={index} className="my-nfts__slide">
      <NFTCard
        key={index}
        tokenInfo={nft}
      />
    </SwiperSlide>
  )
  const handleRedeemTree = useCallback(async () => {
    try {
      setRedeemType("isMerkleTree");
      setShowLoader(true);
      const tx = await nftData?.redeemTree();
      setShowLoader(false);
      if (tx?.status) {
        toggleRedeemNftPrompt();
      }
    } catch (e) {
      setShowLoader(false);
    }
  }, [nftData, toggleRedeemNftPrompt]);

  const handleRedeemShares = useCallback(async () => {
    try {
      setRedeemType("isDeposit");
      setShowLoader(true)
      const tx = await nftData?.redeemShares();
      setShowLoader(false);
      if (tx)
        toggleRedeemNftPrompt();
    } catch (e) {
      console.error(e);
      setShowLoader(false);
    }
    nftData?.redeemShares();
  }, [nftData, toggleRedeemNftPrompt]);

  return (
    <div className={classNames("my-nfts-wrapper", { "disabled": showLoader })}>
      <span className="my-nfts__title">NFTs</span>
      <span className="my-nfts__sub-title">{t("Header.MyAccount.MyNFTs.airdrop-nfts")}</span>
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
            {treeNfts}
          </Swiper>
        )}
      </div>
      <span className="my-nfts__sub-title">{t("Header.MyAccount.MyNFTs.depsoit-nfts")}</span>
      <div className="my-nfts__deposit-nfts-container">
        {depositNfts?.length === 0 ? <div className="my-nfts__no-nfts-text">{t("Header.MyAccount.MyNFTs.no-deposit-nfts")}</div> : (
          <Swiper
            spaceBetween={20}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={screenSize === ScreenSize.Mobile ? 1 : 2}
            speed={500}
            touchRatio={1.5}
            navigation
            effect={"flip"}>
            {depositNfts}
          </Swiper>
        )}
      </div>
      <div className="my-nfts__info-text-container">
        <span className="my-nfts__info-text-1">{t("Header.MyAccount.MyNFTs.text-0")}</span>
        {t("Header.MyAccount.MyNFTs.text-1")}
      </div>
      <button
        disabled={!nftData?.isBeforeDeadline || !nftData?.airdropToRedeem}
        onClick={handleRedeemTree}
        className="my-nfts__action-btn">
        {t("Header.MyAccount.MyNFTs.airdrop-redeem")}
        {!nftData?.isBeforeDeadline && <span>&nbsp; ({t("Header.MyAccount.MyNFTs.after-deadline")})</span>}
      </button>
      <button
        disabled={!nftData?.depositToRedeem}
        onClick={handleRedeemShares}
        className="my-nfts__action-btn fill">
        {t("Header.MyAccount.MyNFTs.deposit-redeem")}
      </button>
      {showLoader && <Loading />}
      <Modal
        isShowing={showRedeemNftPrompt}
        hide={toggleRedeemNftPrompt}>
        <RedeemNftSuccess type={redeemType!} />
      </Modal>
    </div>
  )
}
