import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Pill, Vault } from "components";
import { useVaults } from "hooks/vaults/useVaults";
import { VaultStatusContext } from "../store";

export const GovApprovalStatusCard = () => {
  const { t } = useTranslation();

  const { vaultData, vaultAddress } = useContext(VaultStatusContext);
  const { allVaults } = useVaults();
  const vault = allVaults?.find((vault) => vault.id === vaultAddress);

  const isApprovedByGov = vaultData.isRegistered;

  return (
    <div className="status-card">
      <div className="status-card__title">
        <div className="leftSide">
          <span>{t("govApproval")}</span>
          <Pill color={isApprovedByGov ? "blue" : "red"} text={isApprovedByGov ? t("live") : t("pendingApproval")} />
        </div>
      </div>

      {isApprovedByGov ? (
        <p className="status-card__text">{t("vautlLiveExplanation")}</p>
      ) : (
        <>
          <p className="status-card__text">{t("pendingApprovalExplanation")}</p>
          {/* <Button className="status-card__button">{t("checkIn")}</Button> */}
        </>
      )}

      {vault && (
        <div className="preview-vault">
          <table>
            <tbody>
              <Vault expanded={true} vault={vault} noActions />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
