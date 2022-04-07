import Logo from "assets/icons/logo.icon";
import { EligibilityStatus } from "components/Airdrop/constants";
import { t } from "i18next";
import { useContext } from "react";
import { formatWei } from "utils";
import { Stage, TokenAirdropContext } from "../../TokenAirdrop";
import "./index.scss";

interface IProps {
  eligibilityStatus: EligibilityStatus
  setInTokenAirdrop: (value: boolean) => void
  tokenAmount: number
}

export default function CheckEligibility({ eligibilityStatus, setInTokenAirdrop, tokenAmount }: IProps) {
  const { setStage } = useContext(TokenAirdropContext);

  return (
    <fieldset className="check-eligibility-wrapper">
      <legend>{t("Airdrop.TokenAirdrop.CheckEligibility.title")}</legend>
      <span className="check-eligibility-text">{t("Airdrop.TokenAirdrop.CheckEligibility.claim-amount")}</span>
      <div className="amount-container">
        <Logo /> {formatWei(tokenAmount)} HATS
      </div>
      {eligibilityStatus === EligibilityStatus.REDEEMED && <div className="redeemed-info-wrapper">Redeemed</div>}
      {eligibilityStatus !== EligibilityStatus.REDEEMED && <button className="continue-btn fill" onClick={() => { setStage(Stage.Protocol); setInTokenAirdrop(true); }}>{t("Airdrop.TokenAirdrop.CheckEligibility.token-claim-continue")}</button>}
    </fieldset>
  )
}
