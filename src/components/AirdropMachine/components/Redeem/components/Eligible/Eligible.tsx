import classNames from "classnames";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import NFTAirdrop from "../NFTAirdrop/NFTAirdrop";
import TokenEligibility from "../TokenEligibility/TokenEligibility";
import "./index.scss";

enum Stage {
  TokenEligibility = 1,
  NFTAirdrop,
}

export default function Eligible() {
  const { t } = useTranslation();
  const [stage, setStage] = useState(Stage.TokenEligibility);

  const nextStage = () => {
    setStage(Stage.NFTAirdrop);
    document.getElementById("modalBody")?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  return (
    <div className="eligible-wrapper">
      <div className="eligible__header-wrapper">
        <div className="eligible__header-title">{t("AirdropMachine.Eligible.title")}</div>
        <div>{t("AirdropMachine.Eligible.text")}</div>
      </div>
      <div className="eligible__stages-wrapper">
        <div onClick={() => setStage(Stage.TokenEligibility)} className="eligible__stage-title-wrapper">
          <div className="eligible__stage-number first">1</div>
          <div className={classNames("eligible__stage-title", { "eligible__stage-title-current": stage === Stage.TokenEligibility })}>
            TOKEN <br className="mobile-break" /> ELIGIBILITY
          </div>
        </div>
        <div onClick={() => setStage(Stage.NFTAirdrop)} className="eligible__stage-title-wrapper">
          <div className="eligible__stage-number second">2</div>
          <div className={classNames("eligible__stage-title", { "eligible__stage-title-current": stage === Stage.NFTAirdrop })}>
            NFT <br className="mobile-break" /> AIRDROP
          </div>
        </div>
      </div>
      {stage === Stage.TokenEligibility ? (
        <TokenEligibility
          nextStage={nextStage} />
      ) : <NFTAirdrop />}
    </div>
  )
}
