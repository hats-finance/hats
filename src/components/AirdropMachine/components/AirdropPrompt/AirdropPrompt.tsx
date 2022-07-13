import { useEthers } from "@usedapp/core";
import { RoutePaths } from "constants/constants";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./index.scss";

interface IProps {
  closePrompt: () => void;
}

export default function AirdropPrompt({ closePrompt }: IProps) {
  const { t } = useTranslation();
  const { account } = useEthers();
  const navigate = useNavigate();

  const handleClick = () => {
    closePrompt();
    navigate(RoutePaths.airdrop_machine);
  }

  return (
    <div className="airdrop-prompt-wrapper">
      <div className="airdrop-prompt__title">{t("AirdropMachine.AirdropPrompt.title")}</div>
      <span>{t("AirdropMachine.AirdropPrompt.text-1")}</span>
      <div className="airdrop-prompt__wallet-container">
        <span>{t("AirdropMachine.AirdropPrompt.text-2")}</span>
        <div className="airdrop-prompt__wallet-address">
          {account}
        </div>
      </div>
      <span>{t("AirdropMachine.AirdropPrompt.text-3")}</span>
      <button onClick={handleClick} className="airdrop-prompt__continue-btn fill">
        {t("AirdropMachine.AirdropPrompt.button-text")}
      </button>
    </div>
  )
}
