import { Swiper, SwiperSlide } from "swiper/react";
import { useVaults } from "hooks/useVaults";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import Loading from "components/Shared/Loading";
import "./index.scss";
import "swiper/css";

export default function MyNFTs() {
  const { t } = useTranslation();
  const { nftData } = useVaults();

  const nfts = nftData?.redeemable?.map((nft, index) =>
    <SwiperSlide key={index}>
      <img key={index} src={nft.tokenUri} alt="nft" />
    </SwiperSlide>
  )

  const showLoader =
    nftData?.redeemMultipleFromTreeState.status === "PendingSignature" ||
    nftData?.redeemMultipleFromTreeState.status === "Mining" ||
    nftData?.redeemMultipleFromSharesState.status === "PendingSignature" ||
    nftData?.redeemMultipleFromSharesState.status === "Mining";

  return (
    <div className={classNames("my-nfts-wrapper", { "disabled": showLoader })}>
      <div className="my-nfts__container">
        {nfts?.length === 0 ? "No NFTs yet" : (
          <Swiper
            spaceBetween={1}
            slidesPerView={3}
            speed={500}
            touchRatio={1.5}
            navigation={true}
            effect={"flip"}>
            {nfts}
          </Swiper>
        )}
      </div>
      {nftData?.airdropToRedeem && <button onClick={nftData?.redeemTree} className="my-nfts__action-btn fill">{t("Header.MyAccount.MyNFTs.airdrop-redeem")}</button>}
      {nftData?.depositToRedeem && <button onClick={nftData?.redeemShares} className="my-nfts__action-btn fill">{t("Header.MyAccount.MyNFTs.deposit-redeem")}</button>}
      {showLoader && <Loading />}
    </div>
  )
}
