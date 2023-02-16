import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Loading, Pill } from "components";
import { RoutePaths } from "navigation";
import { VaultStatusContext } from "../store";
import * as VaultStatusService from "../vaultStatusService";

export const EditVaultStatusCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { vaultAddress, vaultChainId } = useContext(VaultStatusContext);

  const handleEditVault = async () => {
    setLoading(true);
    const editSessionId = await VaultStatusService.createEditSessionOffChain(vaultAddress, vaultChainId);
    navigate(`${RoutePaths.vault_editor}/${editSessionId}`);
    setLoading(false);
  };

  return (
    <div className="status-card">
      <div className="status-card__title">
        <div className="leftSide">
          <span>{t("setup")}</span>
          <Pill color="blue" text={t("completed")} />
        </div>
      </div>
      <p className="status-card__text">{t("setupCompleted")}</p>
      <p className="status-card__text">{t("editVaultHelp")}</p>

      <Button onClick={handleEditVault} className="status-card__button">
        {t("editVault")}
      </Button>

      {loading && <Loading fixed extraText={`${t("loading")}...`} />}
    </div>
  );
};
