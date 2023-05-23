import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/DeleteOutlineOutlined";
import UploadIcon from "@mui/icons-material/FileUploadOutlined";
import SaveIcon from "@mui/icons-material/SaveAltOutlined";
import RestoreIcon from "@mui/icons-material/UploadFileOutlined";
import { Button, Modal, WithTooltip } from "components";
import useConfirm from "hooks/useConfirm";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateBackup, CreateKey, ImportKey, KeyDetails, RestoreBackup } from ".";
import { useKeystore } from "../../KeystoreProvider";
import { StyledBaseKeystoreContainer } from "../../styles";
import { IStoredKey } from "../../types";
import { PgpKeyCard } from "./components";
import { StyledBackupOption, StyledKeystoreActions, StyledStoredKeys } from "./styles";

type KeystoreDashboardAction = "create" | "import" | "create_backup" | "restore_backup" | "key_details";

type KeystoreDashboardProps = {
  onClose?: () => void;
  onPublicKeySelected?: (publickey: string) => Promise<void> | undefined;
};

export const KeystoreDashboard = ({ onClose, onPublicKeySelected }: KeystoreDashboardProps) => {
  const { t } = useTranslation();
  const confirm = useConfirm();

  const [selectedKey, setSelectedKey] = useState<IStoredKey | undefined>();

  const { keystore, setKeystore } = useKeystore();
  const userHasKeys = keystore && keystore.storedKeys.length > 0;

  const [activeAction, setActiveAction] = useState<KeystoreDashboardAction | undefined>();
  const removeActiveAction = () => {
    setActiveAction(undefined);
    setSelectedKey(undefined);
  };

  useEffect(() => {
    if (!keystore?.isBackedUp) setActiveAction("create_backup");
  }, [keystore?.isBackedUp]);

  const handleDeleteKey = async (keyToDelete: IStoredKey) => {
    const wantsToDelete = await confirm({
      title: t("PGPTool.deleteKey"),
      titleIcon: <RemoveIcon className="mr-2" fontSize="large" />,
      description: t("PGPTool.deleteKeyDescription"),
      cancelText: t("no"),
      confirmText: t("delete"),
      bodyComponent: <PgpKeyCard expanded pgpKey={keyToDelete} viewOnly />,
    });

    if (!wantsToDelete) return;

    setKeystore((prev) => ({
      ...prev,
      storedKeys: [...prev!.storedKeys.filter((key) => key.id !== keyToDelete.id)],
      isBackedUp: false,
    }));
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
                key={id}
                expanded
                onClick={() => onPublicKeySelected && (selectedKey === key ? setSelectedKey(undefined) : setSelectedKey(key))}
                pgpKey={key}
                selected={selectedKey && (selectedKey?.id === key.id || selectedKey?.alias === key.alias)}
                onSelectedDetails={() => {
                  setActiveAction("key_details");
                  setSelectedKey(key);
                }}
                onSelectedDelete={() => handleDeleteKey(key)}
              />
            );
          })
        ) : (
          <PgpKeyCard expanded />
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
      <Modal removeAnimation title={t("PGPTool.title")} capitalizeTitle isShowing={true} onHide={onClose}>
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
    </>
  );
};
