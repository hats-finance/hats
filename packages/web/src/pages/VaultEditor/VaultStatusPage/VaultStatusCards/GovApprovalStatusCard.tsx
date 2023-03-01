import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Pill } from "components";
import { VaultStatusContext } from "../store";

export const GovApprovalStatusCard = () => {
  const { t } = useTranslation();

  const { vaultData } = useContext(VaultStatusContext);

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
    </div>
  );
};
