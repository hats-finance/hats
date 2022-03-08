import Logo from "assets/icons/logo.icon";
import { t } from "i18next";
import { useContext } from "react";
import { Stage, TokenAirdropContext } from "../../TokenAirdrop";
import "./index.scss";

interface IProps {
  setInTokenAirdrop: (value: boolean) => void
  tokenAmount: number
}

export default function CheckEligibility({ setInTokenAirdrop, tokenAmount }: IProps) {
  const { setStage } = useContext(TokenAirdropContext);

  return (
    <div className="check-eligibility-wrapper">
      <span>{t("Airdrop.TokenAirdrop.CheckEligibility.claim-amount")}</span>
      <div className="amount-container">
        <Logo /> {tokenAmount} HATS
      </div>
      <button className="continue-btn fill" onClick={() => { setStage(Stage.Protocol); setInTokenAirdrop(true); }}>{t("Airdrop.TokenAirdrop.CheckEligibility.token-claim-continue")}</button>
    </div>
  )
}
