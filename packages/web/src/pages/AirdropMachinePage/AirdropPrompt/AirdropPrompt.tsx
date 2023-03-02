import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { RoutePaths } from "navigation";
import { shortenIfAddress } from "utils/addresses.utils";
import EligibleWalletIcon from "assets/icons/wallet-nfts/wallet-eligible.svg";
import "./index.scss";

interface IProps {
  closePrompt: () => void;
}

export default function AirdropPrompt({ closePrompt }: IProps) {
  const { t } = useTranslation();
  const { address: account } = useAccount();
  const navigate = useNavigate();

  const handleClick = () => {
    closePrompt();
    navigate(RoutePaths.airdrop_machine);
  };

  return (
    <div className="airdrop-prompt-wrapper">
      <img className="airdrop-prompt__eligible-icon" src={EligibleWalletIcon} alt="wallet" />
      <div className="airdrop-prompt__title">{t("AirdropMachine.AirdropPrompt.title")}</div>
      <span className="airdrop-prompt__text-1">{t("AirdropMachine.AirdropPrompt.text-1")}</span>
      <div className="airdrop-prompt__wallet-container">
        <span>{t("AirdropMachine.AirdropPrompt.text-2")}</span>
        <div className="airdrop-prompt__wallet-address">{shortenIfAddress(account)}</div>
      </div>
      <span>{t("AirdropMachine.AirdropPrompt.text-3")}</span>
      <button onClick={handleClick} className="airdrop-prompt__continue-btn fill">
        {t("AirdropMachine.AirdropPrompt.button-text")}
      </button>
    </div>
  );
}
