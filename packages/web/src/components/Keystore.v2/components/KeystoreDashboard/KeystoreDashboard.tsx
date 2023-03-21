import { useState } from "react";
import { useTranslation } from "react-i18next";
import Identicon from "react-identicons";
import moment from "moment";
import { Modal, WithTooltip } from "components";
import { CreateKey, ImportKey, CreateBackup, RestoreBackup } from "./";
import { IStoredKey } from "../../types";
import { StyledBaseKeystoreContainer } from "../../styles";
import { useKeystore } from "../../KeystoreProvider";
import { StyledKeystoreActions, StyledStoredKeys, StyledKey, StyledBackupOption } from "./styles";

import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/FileUploadOutlined";
import RestoreIcon from "@mui/icons-material/UploadFileOutlined";
import ViewIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import SaveIcon from "@mui/icons-material/SaveAltOutlined";

type KeystoreDashboardAction = "create" | "import" | "create_backup" | "restore_backup";

type KeystoreDashboardProps = {
  onClose?: () => void;
  onSelectKey?: (key: IStoredKey) => Promise<void> | undefined;
};

export const KeystoreDashboard = ({ onClose, onSelectKey }: KeystoreDashboardProps) => {
  const { t } = useTranslation();

  const { keystore } = useKeystore();
  const userHasKeys = keystore && keystore.storedKeys.length > 0;

  const [activeAction, setActiveAction] = useState<KeystoreDashboardAction | undefined>();
  const removeActiveAction = () => setActiveAction(undefined);

  const _getActions = (): JSX.Element => {
    return (
      <StyledKeystoreActions>
        <WithTooltip placement="bottom" text={t("PGPTool.createNewKey")}>
          <div className="action" onClick={() => setActiveAction("create")}>
            <div className="icon">
              <AddIcon fontSize="inherit" />
            </div>
            <p>{t("create")}</p>
          </div>
        </WithTooltip>
        <WithTooltip placement="bottom" text={t("PGPTool.importKeyUsingPrivateKey")}>
          <div className="action" onClick={() => setActiveAction("import")}>
            <div className="icon">
              <UploadIcon fontSize="inherit" />
            </div>
            <p>{t("import")}</p>
          </div>
        </WithTooltip>
        <WithTooltip placement="bottom" text={t("PGPTool.uploadBackup")}>
          <div className="action" onClick={() => setActiveAction("restore_backup")}>
            <div className="icon">
              <RestoreIcon fontSize="inherit" />
            </div>
            <p>{t("uploadBackup")}</p>
          </div>
        </WithTooltip>
      </StyledKeystoreActions>
    );
  };

  const _getStoredKeys = (): JSX.Element => {
    return (
      <StyledStoredKeys>
        {userHasKeys ? (
          keystore.storedKeys.map((key) => {
            const id = key.id ?? key.alias;
            return (
              <StyledKey key={id}>
                <div className="info">
                  <Identicon string={id} size={24} bg="#fff" />
                  <div className="text">
                    <p>{key.alias}</p>
                    {key.createdAt && <p className="createdAt">{moment(key.createdAt).fromNow()}</p>}
                  </div>
                </div>

                <div className="actions">
                  <WithTooltip placement="left" text={t("PGPTool.viewKeyDetails")}>
                    <ViewIcon className="icon" fontSize="inherit" />
                  </WithTooltip>
                  <WithTooltip placement="right" text={t("PGPTool.deleteKey")}>
                    <DeleteIcon className="icon" fontSize="inherit" />
                  </WithTooltip>
                </div>
              </StyledKey>
            );
          })
        ) : (
          <StyledKey noSelectable>
            <div className="info">
              <CloseIcon color="error" />
              <p>{t("PGPTool.noKeysInStore")}</p>
            </div>
          </StyledKey>
        )}
      </StyledStoredKeys>
    );
  };

  const _getBackupOption = (): JSX.Element => {
    return (
      <StyledBackupOption onClick={() => setActiveAction("create_backup")}>
        <div className="mb-4">{t("PGPTool.downloadBackup")}</div>
        <SaveIcon className="icon" />
      </StyledBackupOption>
    );
  };

  return (
    <>
      <Modal title={t("PGPTool.title")} pgpKeystoreStyles capitalizeTitle isShowing={true} onHide={onClose}>
        <StyledBaseKeystoreContainer bigger>
          <div className="mb-4">{t("PGPTool.usePgpToolFor")}</div>
          {_getActions()}

          <div className="mb-4">{t("PGPTool.yourKeys")}</div>
          {_getStoredKeys()}

          {userHasKeys && _getBackupOption()}
        </StyledBaseKeystoreContainer>
      </Modal>

      {activeAction === "create" && <CreateKey onClose={removeActiveAction} />}
      {activeAction === "import" && <ImportKey onClose={removeActiveAction} />}
      {activeAction === "create_backup" && <CreateBackup onClose={removeActiveAction} />}
      {activeAction === "restore_backup" && <RestoreBackup onClose={removeActiveAction} />}
    </>
  );
};
