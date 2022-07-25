import { useEthers } from "@usedapp/core";
import { useTranslation } from "react-i18next";
import { NFTTokenInfo } from "types/types";
import "./index.scss";

interface IProps {
  data: NFTTokenInfo;
}

export default function NFTElement({ data: { pid, isRedeemed, tokenUri } }: IProps) {
  const { t } = useTranslation();

  const handleRedeem = () => {
    try {
      /** Should we use the multiple here or the single? */
      // redeemMultipleFromShares([HAT_VAULTS_CONSTANT], [pid], [account]);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="nft-element-wrapper">
      <img src={tokenUri} alt="nft" />
      {!isRedeemed && <button onClick={handleRedeem} className="fill">{t("MyAccount.MyNFTs.button-text")}</button>}
    </div>
  )
}