import { useEthers } from "@usedapp/core";
import { HAT_VAULTS_CONSTANT } from "components/AirdropMachine/data";
import { useGetTierToRedeemFromShares, useRedeemMultipleFromShares, useTokenIds, useUri } from "hooks/airdropContractHooks";
import { useTranslation } from "react-i18next";

interface IProps {
  pid: string;
}

/**
 * If tier --> meaning it hasn't been redeemed yet? or need to check also with tokensRedeemed?
 */
export default function NFTElement({ pid }: IProps) {
  const { t } = useTranslation();
  const { account } = useEthers();
  const { send: redeemMultipleFromShares, state: redeemMultipleFromSharesState } = useRedeemMultipleFromShares();
  const tier = useGetTierToRedeemFromShares(pid, account!);
  const tokenId = useTokenIds(account!, pid, tier ?? 0);
  const uri = useUri(tokenId ?? "");

  /** Need to check id already redeemed */
  const redeemed = false;

  const handleRedeem = () => {
    try {
      /** Should we use the multiple here or the single? */
      redeemMultipleFromShares([HAT_VAULTS_CONSTANT], [pid], [account]);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Need to build the correct URI after it updates in the contract.
   */
  return (
    <div className="nft-element-wrapper">
      {tier ? <img src={uri} alt="nft" /> : null}
      {!redeemed && <button onClick={handleRedeem} className="fill">{t("MyAccount.MyNFTs.button-text")}</button>}
    </div>
  )
}