import { Swiper, SwiperSlide } from "swiper/react";
import { useVaults } from "hooks/useVaults";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import Loading from "components/Shared/Loading";
import { ipfsTransformUri } from "utils";
import Dot from "components/Shared/Dot/Dot";
import { Colors } from "constants/constants";
import "./index.scss";
import "swiper/css";
import NFTMedia from "components/NFTMedia";

export default function MyNFTs() {
  const { t } = useTranslation();
  const { nftData } = useVaults();

  const treeNfts = nftData?.nftTokens?.filter(nft => nft.isMerkleTree).map((nft, index) =>
    <SwiperSlide key={index} className="my-nfts__slide">
      <NFTMedia
        key={index}
        className={classNames({ "my-nfts__not-redeemed": !nft.isRedeemed })}
        link={ipfsTransformUri(nft.nftInfo.image)}
        width="130px" />
      {!nft.isRedeemed && <Dot className="my-nfts__not-redeemed-dot" color={Colors.strongRed} />}
    </SwiperSlide>
  )

  const depositNfts = nftData?.nftTokens?.filter(nft => nft.isDeposit).map((nft, index) =>
    <SwiperSlide key={index} className="my-nfts__slide">
      <NFTMedia
        key={index}
        className={classNames({ "my-nfts__not-redeemed": !nft.isRedeemed })}
        link={ipfsTransformUri(nft.nftInfo.image)}
        width="130px" />
      {!nft.isRedeemed && <Dot className="my-nfts__not-redeemed-dot" color={Colors.strongRed} />}
    </SwiperSlide>
  )

  const showLoader =
    nftData?.redeemMultipleFromTreeState.status === "PendingSignature" ||
    nftData?.redeemMultipleFromTreeState.status === "Mining" ||
    nftData?.redeemMultipleFromSharesState.status === "PendingSignature" ||
    nftData?.redeemMultipleFromSharesState.status === "Mining";

  return (
    <div className={classNames("my-nfts-wrapper", { "disabled": showLoader })}>
      <span className="my-nfts__title">NFTs</span>
      <span className="my-nfts__sub-title">{t("Header.MyAccount.MyNFTs.airdrop-nfts")}</span>
      <div className="my-nfts__airdrop-nfts-container">
        {treeNfts?.length === 0 ? <div className="my-nfts__no-nfts-text">{t("Header.MyAccount.MyNFTs.no-tree-nfts")}</div> : (
          <Swiper
            spaceBetween={1}
            slidesPerView={3}
            speed={500}
            touchRatio={1.5}
            navigation={true}
            effect={"flip"}>
            {treeNfts}
          </Swiper>
        )}
      </div>
      <span className="my-nfts__sub-title">{t("Header.MyAccount.MyNFTs.depsoit-nfts")}</span>
      <div className="my-nfts__deposit-nfts-container">
        {depositNfts?.length === 0 ? <div className="my-nfts__no-nfts-text">{t("Header.MyAccount.MyNFTs.no-deposit-nfts")}</div> : (
          <Swiper
            spaceBetween={1}
            slidesPerView={3}
            speed={500}
            touchRatio={1.5}
            navigation={true}
            effect={"flip"}>
            {depositNfts}
          </Swiper>
        )}
      </div>
      <div className="my-nfts__one-nft-trust-level-text">{t("Header.MyAccount.MyNFTs.text-0")}</div>
      {nftData?.airdropToRedeem && (
        <button
          disabled={!nftData?.isBeforeDeadline}
          onClick={nftData?.redeemTree}
          className="my-nfts__action-btn fill">
          {t("Header.MyAccount.MyNFTs.airdrop-redeem")}
          {!nftData?.isBeforeDeadline && <span>&nbsp; ({t("Header.MyAccount.MyNFTs.after-deadline")})</span>}
        </button>)}
      {nftData?.depositToRedeem && <button onClick={nftData?.redeemShares} className="my-nfts__action-btn fill">{t("Header.MyAccount.MyNFTs.deposit-redeem")}</button>}
      {showLoader && <Loading />}
    </div>
  )
}
