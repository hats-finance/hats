import SyncIcon from "@mui/icons-material/Sync";
import { Alert, Pill } from "components";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { VaultDepositsSection } from "pages/Honeypots/VaultDetailsPage/Sections";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { VaultStatusContext } from "../store";

export const DepositStatusCard = () => {
  const { t } = useTranslation();

  const { vaultData, vaultAddress, refreshVaultData } = useContext(VaultStatusContext);

  const { allVaults } = useVaults();
  const selectedVault = vaultAddress ? allVaults?.find((v) => v.id.toLowerCase() === vaultAddress.toLowerCase()) : undefined;

  const isVaultDeposited = vaultData.depositedAmount.gt(0);

  return (
    <>
      <div className="status-card">
        <div className="status-card__title">
          <div className="leftSide">
            <h3>{t("deposit")}</h3>
            <Pill
              dotColor={isVaultDeposited ? "blue" : "red"}
              text={
                isVaultDeposited ? t("completed") : vaultData.isCommitteeCheckedIn ? t("awaitingAction") : t("awaitingCheckin")
              }
            />
          </div>
          <div className="reload" onClick={refreshVaultData}>
            <SyncIcon />
          </div>
        </div>
        {selectedVault && <VaultDepositsSection vault={selectedVault} greyBorders />}
        {vaultData.isCommitteeCheckedIn && !isVaultDeposited && (
          <p className="status-card__text mb-5">{t("depositOnVaultExplanation")}</p>
        )}
        {!vaultData.isCommitteeCheckedIn && <Alert content={t("committeeMustCheckInFirst")} type="warning" />}
      </div>
    </>
  );
};
