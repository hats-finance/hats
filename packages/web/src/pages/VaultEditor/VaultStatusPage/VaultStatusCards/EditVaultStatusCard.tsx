import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import moment from "moment";
import { Alert, Button, Loading, Pill, PillProps } from "components";
import { RoutePaths } from "navigation";
import { IEditedSessionResponse } from "types";
import { checkIfAddressIsPartOfComitteOnStatus } from "../utils";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { VaultStatusContext } from "../store";
import * as VaultEditorService from "../../vaultEditorService";
import ViewIcon from "@mui/icons-material/VisibilityOutlined";

export const EditVaultStatusCard = () => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const navigate = useNavigate();
  const { vaultAddress, vaultChainId, vaultData } = useContext(VaultStatusContext);

  const { signIn, logout, profileData, isSigningIn } = useSiweAuth();

  console.log("profileData", profileData);
  console.log("isSigningIn", isSigningIn);

  const isMemberOrMultisig = checkIfAddressIsPartOfComitteOnStatus(address, vaultData);

  const [loading, setLoading] = useState(false);
  const [loadingEditSessions, setLoadingEditSessions] = useState(false);
  const [editSessions, setEditSessions] = useState<IEditedSessionResponse[]>([]);
  const [deployedEditSession, setDeployedEditSession] = useState<IEditedSessionResponse>();

  const lastEditSession = editSessions.length > 0 ? editSessions[0] : undefined;
  const lastEditionIsWaitingApproval = lastEditSession?.vaultEditionStatus === "pendingApproval";
  const lastEditionIsEditing = lastEditSession?.vaultEditionStatus === "editing";

  useEffect(() => {
    fetchEditSessions(vaultAddress, vaultChainId, vaultData.descriptionHash);
  }, [vaultAddress, vaultChainId, vaultData.descriptionHash]);

  const fetchEditSessions = async (vaultAddress: string, vaultChainId: number, descriptionHash: string) => {
    setLoadingEditSessions(true);
    const editSessions = await VaultEditorService.getEditionEditSessions(vaultAddress, vaultChainId);
    setEditSessions(editSessions);

    const currentEditSession = await VaultEditorService.getCurrentValidEditSession(descriptionHash, vaultAddress, vaultChainId);
    setDeployedEditSession(currentEditSession);
    setLoadingEditSessions(false);
  };

  const handleEditVault = async () => {
    signIn();
    return;
    // // If last edition is waiting approval or editing, don't create a new edit session
    // if (lastEditionIsEditing || lastEditionIsWaitingApproval) {
    //   navigate(`${RoutePaths.vault_editor}/${lastEditSession._id}`);
    // } else {
    //   setLoading(true);
    //   const editSessionId = await VaultEditorService.createEditSessionOffChain(vaultAddress, vaultChainId);
    //   navigate(`${RoutePaths.vault_editor}/${editSessionId}`);
    //   setLoading(false);
    // }
  };

  const handleViewCurrentDescription = () => {
    if (!deployedEditSession) return;
    navigate(`${RoutePaths.vault_editor}/${deployedEditSession._id}`);
  };

  const goToEditSession = (editSessionData: IEditedSessionResponse) => {
    navigate(`${RoutePaths.vault_editor}/${editSessionData._id}`);
  };

  const getPillColorAndText = (editSessionData: IEditedSessionResponse): { color: PillProps["color"]; text: string } => {
    if (editSessionData.vaultEditionStatus === "pendingApproval") {
      return { color: "yellow", text: `${t("waitingApproval")}..` };
    } else if (editSessionData.vaultEditionStatus === "editing") {
      return { color: "yellow", text: `${t("editing")}..` };
    } else if (editSessionData.vaultEditionStatus === "approved") {
      return { color: "blue", text: t("approved") };
    } else {
      return { color: "red", text: t("rejected") };
    }
  };

  const getEditSessionActions = (editSessionData: IEditedSessionResponse) => {
    const isEditing = editSessionData.vaultEditionStatus === "editing";
    return (
      <Button onClick={() => goToEditSession(editSessionData)} styleType="invisible">
        <ViewIcon className="mr-2" /> {isEditing ? t("continueEdition") : t("viewEdit")}
      </Button>
    );
  };

  const getInfoText = (isLastPendingApproval: boolean) => {
    if (!isMemberOrMultisig) {
      return <p className="status-card__text mb-5">{t("setupCompleted")}</p>;
    }

    if (editSessions.length === 0) {
      return (
        <>
          <p className="status-card__text">{t("setupCompleted")}</p>
          <p className="status-card__text">{t("editVaultHelp")}</p>
        </>
      );
    } else {
      return (
        <>
          <p className="status-card__text">{t("youVaultIsLive")}</p>
          <p className="status-card__text">
            {isLastPendingApproval
              ? t("existingEditSessionsHelperPendingApproval")
              : t("existingEditSessionsHelperNoPendingApproval")}
          </p>
        </>
      );
    }
  };

  const getEditSessions = () => {
    if (editSessions.length === 0) return null;

    return (
      <div className="status-card__edit-sessions">
        <p className="edit-sessions-title">{t("editionRequests")}:</p>

        {editSessions.map((editSession) => (
          <div className="edit-session" key={editSession._id}>
            <div className="box">
              <div className="title">{editSession._id}</div>
              <div className="createdAt">{moment(editSession.createdAt).format("MMM Do YY, h:mm a")}</div>
            </div>
            <div className="status">
              <Pill transparent color={getPillColorAndText(editSession).color} text={getPillColorAndText(editSession).text} />
            </div>
            <div className="actions">{getEditSessionActions(editSession)}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="status-card">
      <div className="status-card__title">
        <div className="leftSide">
          <span>{t("setup")}</span>
          <Pill
            color={lastEditionIsWaitingApproval ? "yellow" : "blue"}
            text={lastEditionIsWaitingApproval ? t("waitingApproval") : t("completed")}
          />
        </div>
      </div>

      {getInfoText(lastEditionIsWaitingApproval)}

      {loadingEditSessions ? <p>{t("loadingInformation")}...</p> : getEditSessions()}

      {!isMemberOrMultisig && <Alert content={t("connectWithCommitteeMultisigOrBeAMember")} type="warning" />}

      {isMemberOrMultisig && (
        <div className="status-card__buttons">
          <Button disabled={!deployedEditSession} onClick={handleViewCurrentDescription} styleType="outlined">
            <ViewIcon className="mr-2" />
            {t("viewCurrentDescription")}
          </Button>
          <Button onClick={handleEditVault}>{t("editVault")}</Button>
        </div>
      )}

      {loading && <Loading fixed extraText={`${t("loading")}...`} />}
    </div>
  );
};
