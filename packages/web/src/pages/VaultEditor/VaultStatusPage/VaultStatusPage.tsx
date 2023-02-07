import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { StyledVaultStatusPage } from "./styles";
import { CongratsStatusCard } from "./VaultStatusCards/CongratsStatusCard";
import { EditVaultStatusCard } from "./VaultStatusCards/EditVaultStatusCard";

export const VaultStatusPage = () => {
  const { t } = useTranslation();
  const { vaultAddress } = useParams();
  if (!vaultAddress) return null;

  return (
    <StyledVaultStatusPage className="content-wrapper">
      <div className="status-title">
        {t("vaultCreator")}
        <span>/{t("vaultStatus")}</span>
      </div>

      <div className="status-cards">
        <CongratsStatusCard />
        <EditVaultStatusCard />
      </div>
    </StyledVaultStatusPage>
  );
};
