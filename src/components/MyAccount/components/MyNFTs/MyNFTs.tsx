import { Swiper, SwiperSlide } from "swiper/react";
import { useVaults } from "hooks/useVaults";
import "./index.scss";
import "swiper/css";

export default function MyNFTs() {
  const { nftData } = useVaults();

  const nfts = nftData?.redeemable?.map((nft, index) =>
    <SwiperSlide key={index}>
      <img key={index} src={nft.tokenUri} alt="nft" />
      {/* TODO: need to assign to correct redeem function (Tree or Shares)
                But maybe we need just two buttons, one to redeem all from shares
                and one to reedem all from tree.
      */}
      {!nft.isRedeemed && (
        <button className="fill">
          Redeem
        </button>
      )}
    </SwiperSlide>
  )

  return (
    <div className="my-nfts-wrapper">
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
  )
}
