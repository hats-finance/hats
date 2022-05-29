import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Stage, TokenAirdropContext } from "../../TokenAirdrop";
import "./index.scss";

interface IProps {
  setInTokenAirdrop: (value: boolean) => void
}

export default function Protocol({ setInTokenAirdrop }: IProps) {
  const { setStage } = useContext(TokenAirdropContext);
  const { t } = useTranslation();

  return (
    <div className="protocol-wrapper">
      <h3>{t("Airdrop.TokenAirdrop.Protocol.section-1-title")}</h3>
      <p>{t("Airdrop.TokenAirdrop.Protocol.section-1")}</p>
      <h3>{t("Airdrop.TokenAirdrop.Protocol.section-2-title")}</h3>
      <p>{t("Airdrop.TokenAirdrop.Protocol.section-2")}</p>
      <h3>{t("Airdrop.TokenAirdrop.Protocol.section-3-title")}</h3>
      <p>{t("Airdrop.TokenAirdrop.Protocol.section-3")}</p>
      <div className="actions-wrapper">
        <button onClick={() => { setStage(Stage.CheckEligibility); setInTokenAirdrop(false); }}>BACK</button>
        <button className="fill" onClick={() => setStage(Stage.ChooseDelegatee)}>NEXT</button>
      </div>
    </div>
  )
}
