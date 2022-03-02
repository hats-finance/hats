import { t } from "i18next";
import "./VaultAction.scss";

export default function VaultAction() {
  return (
    <div className="vault-action-wrapper">
      <button className="deposit-withdraw" disabled>
        {t("VaultEditor.review-vault.deposit-withdraw")}
      </button>
    </div>
  )
}
