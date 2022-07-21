//import { IPFS_PREFIX } from "constants/constants";
import { useTranslation } from "react-i18next";
import RadioButtonChecked from "../../../../../../assets/icons/radio-button-checked.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { AirdropMachineWallet } from "types/types";
import { buildProofs } from "components/AirdropMachine/utils";
import "swiper/css";
import "./index.scss";
import { useRedeemMultipleFromTree } from "hooks/airdropContractHooks";

//const TEMP_IPFS_NFT_COLLECTION = "QmSiPFLfYwodihG94ASaiWJuQ6uLUXkz8p8kvoCTv8KraP";
//const TEMP_NFTS = ["892", "342", "427", "374"];

interface IProps {
  data: AirdropMachineWallet;
  closeRedeemModal: () => void;
}


/**
 * NEED TO CHECK WHICH OF THE NFTS ARE NOT REDEEMED YET AND DISPLAY ONLY THEM.
 * THEN SENDING ONLY THEM TO redeemMultipleFromTree
 */
export default function NFTAirdrop({ data, closeRedeemModal }: IProps) {
  const { t } = useTranslation();
  const { send: redeemMultipleFromTree, state: redeemMultipleFromTreeState } = useRedeemMultipleFromTree();

  const handleRedeem = () => {
    try {
      const proofs = buildProofs(data);
      console.log(proofs);
      /**
       * TODO: NEED TO ADD THE PARAMS:
       * hatVaults: string[], pids: number[], account: string, tiers: number[], proofs: any[]
       */
      redeemMultipleFromTree();
    } catch (error) {
      console.error(error);
    }
  }

  const nftsSlides = data.nft_elegebility.map((nft, index) => {
    return (
      <SwiperSlide key={index}>
        <img key={index} src={nft.uri} alt="nft" />
      </SwiperSlide>
    )
  })

  return (
    <div className="nft-airdrop-wrapper">
      <span>{t("AirdropMachine.NFTAirdrop.text-1")}</span>
      <section>
        <b>{t("AirdropMachine.NFTAirdrop.text-2")}</b>
        <div className="nft-airdrop__features-wrapper">
          <div className="nft-airdrop__feature">
            <img src={RadioButtonChecked} alt="radio button" />
            {t("AirdropMachine.NFTAirdrop.text-3")}
          </div>
          <div className="nft-airdrop__feature">
            <img src={RadioButtonChecked} alt="radio button" />
            {t("AirdropMachine.NFTAirdrop.text-4")}
          </div>
          <div className="nft-airdrop__feature">
            <img src={RadioButtonChecked} alt="radio button" />
            {t("AirdropMachine.NFTAirdrop.text-5")}
          </div>
          <div className="nft-airdrop__feature">
            <img src={RadioButtonChecked} alt="radio button" />
            {t("AirdropMachine.NFTAirdrop.text-6")}
          </div>
        </div>
      </section>
      <div className="nft-airdrop__nfts-wrapper">
        <Swiper
          spaceBetween={1}
          slidesPerView={3}
          speed={500}
          touchRatio={1.5}
          navigation={true}
          effect={"flip"}>
          {nftsSlides}
        </Swiper>
      </div>
      <button onClick={handleRedeem} className="fill">{t("AirdropMachine.NFTAirdrop.button-text")}</button>
    </div>
  )
}
