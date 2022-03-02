import Logo from "assets/icons/logo.icon";
import { t } from "i18next";
import { useContext } from "react";
import { Stage, TokenAirdropContext } from "../../TokenAirdrop";
import "./index.scss";

interface IProps {
  tokenAmount: number
}

export default function CheckEligibility({ tokenAmount }: IProps) {
  const { setStage } = useContext(TokenAirdropContext);

  return (
    <div className="check-eligibility-wrapper">
      <span>{t("Airdrop.TokenAirdrop.CheckEligibility.claim-amount")}</span>
      <div className="amount-container">
        <Logo /> {tokenAmount} HATS
      </div>
      <button onClick={() => setStage(Stage.Terms)}>Continue</button>
    </div>
  )
}
