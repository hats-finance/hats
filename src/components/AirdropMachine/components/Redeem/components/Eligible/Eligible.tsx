import classNames from "classnames";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AirdropMachineWallet } from "types/types";
import NFTAirdrop from "../NFTAirdrop/NFTAirdrop";
import TokenEligibility from "../TokenEligibility/TokenEligibility";
import "./index.scss";

interface IProps {
  data: AirdropMachineWallet;
}

enum Stage {
  TokenEligibility = 1,
  NFTAirdrop,
}

export default function Eligible({ data }: IProps) {
  const { t } = useTranslation();
  const [stage, setStage] = useState(Stage.TokenEligibility);

  console.log(stage);
  console.log(Stage.TokenEligibility)

  return (
    <div className="eligible-wrapper">
      <div className="eligible__header-wrapper">
        <div className="eligible__header-title">{t("AirdropMachine.Eligible.title")}</div>
        <div>{t("AirdropMachine.Eligible.text")}</div>
      </div>
      <div className="eligible__stages-wrapper">
        <div className="eligible__stage-title-wrapper">
          <div className="eligible__stage-number">1</div>
          <div className={classNames("eligible__stage-title", { "eligible__stage-title-current": stage === Stage.TokenEligibility })}>
            TOKEN ELIGIBILITY
          </div>
        </div>
        <div className="eligible__stage-title-wrapper">
          <div className="eligible__stage-number">2</div>
          <div className={classNames("eligible__stage-title", { "eligible__stage-title-current": stage === Stage.NFTAirdrop })}>
            NFT AIRDROP
          </div>
        </div>
      </div>
      {stage === Stage.TokenEligibility ? <TokenEligibility /> : <NFTAirdrop />}
    </div>
  )
}
