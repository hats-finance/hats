import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, WithTooltip } from "components";
import { PgpKey } from "./components";
import { CreateKey, ImportKey, CreateBackup, RestoreBackup, KeyDetails, KeyDelete } from "./";
import { IStoredKey } from "../../types";
import { StyledBaseKeystoreContainer } from "../../styles";
import { useKeystore } from "../../KeystoreProvider";
import { StyledKeystoreActions, StyledStoredKeys, StyledBackupOption } from "./styles";

import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/FileUploadOutlined";
import RestoreIcon from "@mui/icons-material/UploadFileOutlined";
import SaveIcon from "@mui/icons-material/SaveAltOutlined";

type KeystoreDashboardAction = "create" | "import" | "create_backup" | "restore_backup" | "key_details" | "delete_key";

type KeystoreDashboardProps = {
  onClose?: () => void;
  onSelectKey?: (key: IStoredKey) => Promise<void> | undefined;
};

export const KeystoreDashboard = ({ onClose, onSelectKey }: KeystoreDashboardProps) => {
  const { t } = useTranslation();

  const [selectedKey, setSelectedKey] = useState<IStoredKey | undefined>();

  const { keystore } = useKeystore();
  const userHasKeys = keystore && keystore.storedKeys.length > 0;

  const [activeAction, setActiveAction] = useState<KeystoreDashboardAction | undefined>();
  const removeActiveAction = () => {
    setActiveAction(undefined);
    setSelectedKey(undefined);
  };

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
              <PgpKey
                key={id}
                pgpKey={key}
                onSelectedDetails={() => {
                  setActiveAction("key_details");
                  setSelectedKey(key);
                }}
                onSelectedDelete={() => {
                  setActiveAction("delete_key");
                  setSelectedKey(key);
                }}
              />
            );
          })
        ) : (
          <PgpKey />
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
        <StyledBaseKeystoreContainer size="medium">
          <div className="mb-4">{t("PGPTool.usePgpToolFor")}</div>
          {_getActions()}

          <div className="mb-4">{t("PGPTool.yourKeys")}</div>
          {_getStoredKeys()}

          {userHasKeys && _getBackupOption()}
        </StyledBaseKeystoreContainer>
      </Modal>

      {activeAction === "create" && (
        <CreateKey onClose={removeActiveAction} onCreatedSuccess={() => setActiveAction("create_backup")} />
      )}
      {activeAction === "import" && (
        <ImportKey onClose={removeActiveAction} onImportedSuccess={() => setActiveAction("create_backup")} />
      )}
      {activeAction === "create_backup" && <CreateBackup onClose={removeActiveAction} />}
      {activeAction === "restore_backup" && <RestoreBackup onClose={removeActiveAction} />}
      {activeAction === "key_details" && selectedKey && <KeyDetails pgpKey={selectedKey} onClose={removeActiveAction} />}
      {activeAction === "delete_key" && selectedKey && <KeyDelete pgpKey={selectedKey} onClose={removeActiveAction} />}
    </>
  );
};
