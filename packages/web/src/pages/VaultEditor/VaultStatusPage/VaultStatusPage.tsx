import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { StyledVaultStatusPage } from "./styles";
import {
  OnChainDataStatusCard,
  CongratsStatusCard,
  EditVaultStatusCard,
  CheckInStatusCard,
  DepositStatusCard,
  GovApprovalStatusCard,
} from "./VaultStatusCards";

export const VaultStatusPage = () => {
  const { t } = useTranslation();
  const { vaultAddress } = useParams();
  if (!vaultAddress) return null;

  console.log(vaultAddress);

  return (
    <StyledVaultStatusPage className="content-wrapper">
      <div className="status-title">
        {t("vaultCreator")}
        <span>/{t("vaultStatus")}</span>
      </div>

      <div className="status-cards">
        <CongratsStatusCard />
        <EditVaultStatusCard />
        <OnChainDataStatusCard />
        <CheckInStatusCard />
        <DepositStatusCard />
        <GovApprovalStatusCard />
      </div>
    </StyledVaultStatusPage>
  );
};
