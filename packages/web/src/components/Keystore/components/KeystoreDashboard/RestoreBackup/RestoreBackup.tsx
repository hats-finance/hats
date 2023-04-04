import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, FormJSONFileInput, Modal } from "components";
import { useKeystore } from "../../../KeystoreProvider";
import { IStoredKey, IKeystoreData } from "../../../types";
import { StyledBaseKeystoreContainer } from "../../../styles";
import { formatKeyWithId } from "../../../utils";
import RestoreIcon from "@mui/icons-material/UploadFileOutlined";

type RestoreBackupProps = {
  onClose: () => void;
};

export const RestoreBackup = ({ onClose }: RestoreBackupProps) => {
  const { t } = useTranslation();

  const { keystore, setKeystore } = useKeystore();
  const [keysToImport, setKeysToImport] = useState<IStoredKey[] | undefined>();

  const handleChangeJsonFile = (jsonString: string) => {
    const keystoreOnBackup = JSON.parse(jsonString) as IKeystoreData | undefined;
    const keysOnBackup = keystoreOnBackup?.storedKeys;

    if (!keysOnBackup) return setKeysToImport([]);

    const validKeysOnBackup = keysOnBackup?.filter((key) => key.alias && key.privateKey && key.publicKey);
    const nonExistentAndValidKeysOnBackup = validKeysOnBackup?.filter(
      (key) => !keystore?.storedKeys.find((k) => k.privateKey === key.privateKey)
    );

    // If some key doesn't have an id, add one
    const nonExistentAndValidKeysOnBackupWithIds = nonExistentAndValidKeysOnBackup?.map((key) => formatKeyWithId(key));

    setKeysToImport(nonExistentAndValidKeysOnBackupWithIds);
  };

  const handleRestoreKeystoreBackup = () => {
    if (!keysToImport || keysToImport.length === 0) return;

    setKeystore((prev) => ({
      ...prev,
      storedKeys: [...keysToImport, ...prev!.storedKeys],
      isBackedUp: prev?.storedKeys.length === 0,
    }));
    onClose();
  };

  return (
    <Modal
      removeAnimation
      titleIcon={<RestoreIcon className="mr-2" fontSize="large" />}
      title={t("PGPTool.uploadBackup")}
      pgpKeystoreStyles
      capitalizeTitle
      isShowing={true}
      onHide={onClose}
    >
      <StyledBaseKeystoreContainer>
        <p className="mb-4">{t("PGPTool.restoreBackupDescription")}</p>

        <FormJSONFileInput label={t("PGPTool.selectBackupFile")} onChange={(e) => handleChangeJsonFile(e.target.value)} />

        {keysToImport && keysToImport.length > 0 && (
          <p
            className="mt-4"
            dangerouslySetInnerHTML={{ __html: t("PGPTool.youAreAboutToImportNumKeys", { numKeys: keysToImport.length }) }}
          ></p>
        )}

        {keysToImport && keysToImport.length === 0 && (
          <p className="error mt-4">{t("PGPTool.backupDoesNotHaveValidOrNewKeys")}</p>
        )}

        <Button
          className="mt-4"
          disabled={!keysToImport || keysToImport.length === 0}
          expanded
          onClick={handleRestoreKeystoreBackup}
        >
          <RestoreIcon className="mr-3" fontSize="small" />
          {keysToImport && keysToImport.length > 0
            ? t("PGPTool.restoreNumKeys", { numKeys: keysToImport.length })
            : t("PGPTool.uploadBackup")}
        </Button>
      </StyledBaseKeystoreContainer>
    </Modal>
  );
};
