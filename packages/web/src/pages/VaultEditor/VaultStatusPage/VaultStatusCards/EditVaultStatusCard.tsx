import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Loading, Pill } from "components";
import { RoutePaths } from "navigation";
import { IEditedSessionResponse } from "types";
import { VaultStatusContext } from "../store";
import * as VaultStatusService from "../vaultStatusService";
import ViewIcon from "@mui/icons-material/VisibilityOutlined";

export const EditVaultStatusCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [editSessions, setEditSessions] = useState<IEditedSessionResponse[]>([]);
  const [deployedEditSession, setDeployedEditSession] = useState<IEditedSessionResponse>();

  const { vaultAddress, vaultChainId, vaultData } = useContext(VaultStatusContext);

  useEffect(() => {
    fetchEditSessions(vaultAddress, vaultChainId, vaultData.descriptionHash);
  }, [vaultAddress, vaultChainId, vaultData.descriptionHash]);

  const fetchEditSessions = async (vaultAddress: string, vaultChainId: number, descriptionHash: string) => {
    const editSessions = await VaultStatusService.getEditionEditSessions(vaultAddress, vaultChainId);
    setEditSessions(editSessions);
    console.log("editSessions", editSessions);

    console.log(descriptionHash, vaultAddress, vaultChainId);
    const currentEditSession = await VaultStatusService.getCurrentValidEditSession(descriptionHash, vaultAddress, vaultChainId);
    setDeployedEditSession(currentEditSession);
    console.log("currentEditSession", currentEditSession);
  };

  const handleEditVault = async () => {
    setLoading(true);
    const editSessionId = await VaultStatusService.createEditSessionOffChain(vaultAddress, vaultChainId);
    navigate(`${RoutePaths.vault_editor}/${editSessionId}`);
    setLoading(false);
  };

  const handleViewCurrentDescription = () => {
    if (!deployedEditSession) return;
    navigate(`${RoutePaths.vault_editor}/${deployedEditSession._id}`);
  };

  const getInfoText = () => {
    if (editSessions.length === 0) {
      return (
        <>
          <p className="status-card__text">{t("setupCompleted")}</p>
          <p className="status-card__text">{t("editVaultHelp")}</p>
        </>
      );
    } else {
      const lastEdition = editSessions[0];
    }
  };

  return (
    <div className="status-card">
      <div className="status-card__title">
        <div className="leftSide">
          <span>{t("setup")}</span>
          <Pill color="blue" text={t("completed")} />
        </div>
      </div>

      {getInfoText()}

      <div className="status-card__buttons">
        <Button disabled={!deployedEditSession} onClick={handleViewCurrentDescription} styleType="outlined">
          <ViewIcon className="mr-2" />
          {t("viewCurrentDescription")}
        </Button>
        <Button onClick={handleEditVault}>{t("editVault")}</Button>
      </div>

      {loading && <Loading fixed extraText={`${t("loading")}...`} />}
    </div>
  );
};
