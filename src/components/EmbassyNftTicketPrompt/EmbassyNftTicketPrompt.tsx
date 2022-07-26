import { useTranslation } from "react-i18next";
import { useNFTTokenData } from "hooks/useNFTTokenData";
import Loading from "../Shared/Loading";
import RedeemTicketSuccess from "./components/RedeemTicketSuccess/RedeemTicketSuccess";
import "./index.scss";

export default function EmbassyNftTicketPrompt() {
  const { t } = useTranslation();
  const { redeemMultipleFromShares, redeemMultipleFromSharesState } = useNFTTokenData();

  if (redeemMultipleFromSharesState.status === "Success") {
    return <RedeemTicketSuccess />
  }

  const showLoader = redeemMultipleFromSharesState.status === "PendingSignature" || redeemMultipleFromSharesState.status === "Mining";

  return (
    <div className="embassy-nft-ticket-wrapper">
      {t("EmbassyNftTicketPrompt.text")}
      <div>SHOW ELIGIBLE NFT</div>
      <button onClick={redeemMultipleFromShares} className="fill">{t("EmbassyNftTicketPrompt.button-text")}</button>
      {showLoader && <Loading />}
    </div>
  )
}
