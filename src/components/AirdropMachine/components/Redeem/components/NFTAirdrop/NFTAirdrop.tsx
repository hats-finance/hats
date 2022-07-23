import { useTranslation } from "react-i18next";
import RadioButtonChecked from "../../../../../../assets/icons/radio-button-checked.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { AirdropMachineWallet } from "types/types";
import { buildProofs } from "components/AirdropMachine/utils";
import { useRedeemMultipleFromTree, useTokenActions } from "hooks/tokenContractHooks";
import "swiper/css";
import "./index.scss";
import { useEffect, useState } from "react";

interface IProps {
  data: AirdropMachineWallet;
  closeRedeemModal: () => void;
}

export default function NFTAirdrop({ data, closeRedeemModal }: IProps) {
  const { t } = useTranslation();
  const { getTokenId, getTokenUri } = useTokenActions();
  const { send: redeemMultipleFromTree, state: redeemMultipleFromTreeState } = useRedeemMultipleFromTree();
  const [nfts, setNfts] = useState<JSX.Element[]>();

  const handleRedeem = async () => {
    try {
      const proofs = buildProofs(data);
      console.log("proofs", proofs);

      const hatVaults = data.nft_elegebility.map(nft => nft.contract_address);
      const pids = data.nft_elegebility.map(nft => nft.pid);
      const tiers = data.nft_elegebility.map(nft => nft.tier);

      await redeemMultipleFromTree(hatVaults, pids, data.id, tiers, proofs);
      closeRedeemModal();
    } catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    (async () => {
      const nfts = await Promise.all(data.nft_elegebility.map(async (nft, index) => {
        const tokenId = await getTokenId(data.id, nft.pid, nft.tier);
        const tokenUri = await getTokenUri(tokenId);
        return (
          <SwiperSlide key={index}>
            <img key={index} src={tokenUri} alt="nft" />
          </SwiperSlide>
        )
      }))
      setNfts(nfts);
    })();
  }, [data, getTokenId, getTokenUri])

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
          {nfts}
        </Swiper>
      </div>
      <button onClick={handleRedeem} className="fill">{t("AirdropMachine.NFTAirdrop.button-text")}</button>
    </div>
  )
}
