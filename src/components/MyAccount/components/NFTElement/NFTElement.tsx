import { useEthers } from "@usedapp/core";
import { HAT_VAULTS_CONSTANT } from "components/AirdropMachine/data";
import { useGetTierFromShares, useRedeemMultipleFromShares, useTokenActions } from "hooks/tokenContractHooks";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./index.scss";

interface IProps {
  pid: number;
}

export default function NFTElement({ pid }: IProps) {
  const { t } = useTranslation();
  const { account } = useEthers();
  const { isTokenRedeemed, getTokenId, getTokenUri } = useTokenActions();
  const { send: redeemMultipleFromShares, state: redeemMultipleFromSharesState } = useRedeemMultipleFromShares();
  const tier = useGetTierFromShares(pid, account!);
  const [uri, setUri] = useState("");
  const [redeemed, setRedeemed] = useState<boolean>();

  useEffect(() => {
    (async () => {
      const isRedeemed = await isTokenRedeemed(pid, tier!, account!);
      setRedeemed(isRedeemed);
    })();
  }, [pid, tier, account, isTokenRedeemed, setRedeemed])

  useEffect(() => {
    (async () => {
      const tokenId = await getTokenId(account!, pid, tier!);
      const tokenUri = await getTokenUri(tokenId);
      setUri(tokenUri);
    })();
  }, [account, pid, tier, getTokenId, getTokenUri, setUri])

  const handleRedeem = () => {
    try {
      /** Should we use the multiple here or the single? */
      redeemMultipleFromShares([HAT_VAULTS_CONSTANT], [pid], [account]);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="nft-element-wrapper">
      <img src={uri} alt="nft" />
      {!redeemed && <button onClick={handleRedeem} className="fill">{t("MyAccount.MyNFTs.button-text")}</button>}
    </div>
  )
}