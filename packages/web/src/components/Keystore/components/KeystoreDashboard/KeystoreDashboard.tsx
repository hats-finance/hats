import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal, WithTooltip } from "components";
import { PgpKeyCard } from "./components";
import { CreateKey, ImportKey, CreateBackup, RestoreBackup, KeyDetails, KeyDelete } from ".";
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
  onPublicKeySelected?: (publickey: string) => Promise<void> | undefined;
};

export const KeystoreDashboard = ({ onClose, onPublicKeySelected }: KeystoreDashboardProps) => {
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
              <PgpKeyCard
                onClick={() => onPublicKeySelected && (selectedKey === key ? setSelectedKey(undefined) : setSelectedKey(key))}
                key={id}
                pgpKey={key}
                selected={selectedKey && (selectedKey?.id === key.id || selectedKey?.alias === key.alias)}
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
          <PgpKeyCard />
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
      <Modal removeAnimation title={t("PGPTool.title")} pgpKeystoreStyles capitalizeTitle isShowing={true} onHide={onClose}>
        <StyledBaseKeystoreContainer size="medium">
          <div className="mb-4">{t("PGPTool.usePgpToolFor")}</div>
          {_getActions()}

          <div className="mb-4">{`${t("PGPTool.yourKeys")} ${onPublicKeySelected ? `(${t("PGPTool.selectOne")})` : ""}`}</div>
          {_getStoredKeys()}

          {userHasKeys && _getBackupOption()}

          {onPublicKeySelected && (
            <Button
              className="mt-4"
              disabled={!selectedKey}
              expanded
              onClick={() => selectedKey && onPublicKeySelected(selectedKey.publicKey)}
            >
              {t("PGPTool.selectKey")}
            </Button>
          )}
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
