import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { useVaults } from "hooks/useVaults";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import Loading from "components/Shared/Loading";
import { ipfsTransformUri } from "utils";
import Dot from "components/Shared/Dot/Dot";
import { Colors } from "constants/constants";
import "./index.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import NFTMedia from "components/NFTMedia";
import Modal from "components/Shared/Modal/Modal";
import RedeemNftSuccess from "components/RedeemNftSuccess/RedeemNftSuccess";
import useModal from "hooks/useModal";
import { useEffect } from "react";
import { usePrevious } from "hooks/usePrevious";

export default function MyNFTs() {
  const { t } = useTranslation();
  const { nftData } = useVaults();
  const { isShowing: showRedeemNftPrompt, toggle: toggleRedeemNftPrompt } = useModal();

  const treeNfts = nftData?.nftTokens?.filter(nft => nft.isMerkleTree).map((nft, index) =>
    <SwiperSlide key={index} className={classNames("my-nfts__slide", { "my-nfts__not-redeemed": !nft.isRedeemed })}>
      <NFTMedia
        key={index}
        clickable
        link={ipfsTransformUri(nft.nftInfo.image)} />
      {!nft.isRedeemed && <Dot className="my-nfts__not-redeemed-dot" color={Colors.strongRed} />}
    </SwiperSlide>
  )

  const depositNfts = nftData?.nftTokens?.filter(nft => nft.isDeposit).map((nft, index) =>
    <SwiperSlide key={index} className={classNames("my-nfts__slide", { "my-nfts__not-redeemed": !nft.isRedeemed })}>
      <NFTMedia
        key={index}
        clickable
        link={ipfsTransformUri(nft.nftInfo.image)} />
      {!nft.isRedeemed && <Dot className="my-nfts__not-redeemed-dot" color={Colors.strongRed} />}
    </SwiperSlide>
  )

  const showLoader =
    nftData?.redeemMultipleFromTreeState.status === "PendingSignature" ||
    nftData?.redeemMultipleFromTreeState.status === "Mining" ||
    nftData?.redeemMultipleFromSharesState.status === "PendingSignature" ||
    nftData?.redeemMultipleFromSharesState.status === "Mining";

  const prevSharesStatus = usePrevious(nftData?.redeemMultipleFromSharesState.status);
  const prevTreeStatus = usePrevious(nftData?.redeemMultipleFromTreeState.status);

  useEffect(() => {
    if ((prevSharesStatus && prevSharesStatus !== nftData?.redeemMultipleFromSharesState.status && nftData?.redeemMultipleFromSharesState.status === "Success") ||
      (prevTreeStatus && prevTreeStatus !== nftData?.redeemMultipleFromTreeState.status && nftData?.redeemMultipleFromTreeState.status === "Success")) {
      toggleRedeemNftPrompt();
    }
  }, [
    nftData?.redeemMultipleFromSharesState.status,
    prevSharesStatus,
    nftData?.redeemMultipleFromTreeState.status,
    prevTreeStatus,
    toggleRedeemNftPrompt,
  ])

  let redeemType;

  const handleRedeemTree = () => {
    redeemType = "isMerkleTree";
    nftData?.redeemTree();
  }

  const handleRedeemShares = () => {
    redeemType = "isDeposit";
    nftData?.redeemShares();
  }

  return (
    <div className={classNames("my-nfts-wrapper", { "disabled": showLoader })}>
      <span className="my-nfts__title">NFTs</span>
      <span className="my-nfts__sub-title">{t("Header.MyAccount.MyNFTs.airdrop-nfts")}</span>
      <div className="my-nfts__airdrop-nfts-container">
        {treeNfts?.length === 0 ? <div className="my-nfts__no-nfts-text">{t("Header.MyAccount.MyNFTs.no-tree-nfts")}</div> : (
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={1}
            slidesPerView={3}
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
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={1}
            slidesPerView={3}
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
        <RedeemNftSuccess type={redeemType} />
      </Modal>
    </div>
  )
}
