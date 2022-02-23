import { t } from "i18next";
import "./index.scss";

interface IProps {
  tokenAmount: number
}

export default function TokenAirdrop({ tokenAmount }: IProps) {
  return (
    <div className="token-airdrop-wrapper">
      <span>{t("Airdrop.TokenAirdrop.claim-amount")}</span>
      <div className="token-airdrop-wrapper__amount-container">
        {tokenAmount} HATS
      </div>
    </div>
  )
}
