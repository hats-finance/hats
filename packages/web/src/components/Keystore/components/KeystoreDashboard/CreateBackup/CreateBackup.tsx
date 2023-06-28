import SaveIcon from "@mui/icons-material/SaveAltOutlined";
import { Alert, Button, CollapsableTextContent, Modal } from "components";
import { LocalStorage } from "constants/constants";
import { useTranslation } from "react-i18next";
import { useKeystore } from "../../../KeystoreProvider";
import { StyledBaseKeystoreContainer } from "../../../styles";

type CreateBackupProps = {
  onClose: () => void;
};

export const CreateBackup = ({ onClose }: CreateBackupProps) => {
  const { t } = useTranslation();

  const { keystore, setKeystore } = useKeystore();
  const validKeystore = !!localStorage.getItem(LocalStorage.Keystore);

  const handleDownloadKeystoreBackup = () => {
    const decryptedKeystore = keystore;
    if (!decryptedKeystore) return;

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(decryptedKeystore))}`;
    const actualTime = new Date().toJSON().split(".")[0].replaceAll(":", "").replaceAll("-", "");
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `hatsKeysBackup-${actualTime}.json`;
    link.click();

    setKeystore({ ...decryptedKeystore, isBackedUp: true });
    onClose();
  };

  return (
    <Modal
      removeAnimation
      titleIcon={<SaveIcon className="mr-2" fontSize="large" />}
      title={t("PGPTool.pgpKeysBackup")}
      capitalizeTitle
      isShowing={true}
      onHide={onClose}
    >
      <StyledBaseKeystoreContainer>
        {!keystore?.isBackedUp && (
          <Alert className="mb-3" type="warning">
            <span>{t("PGPTool.yourKeystoreIsNotBackedUp")}</span>
          </Alert>
        )}
        <p className="mb-4">{t("PGPTool.backupDescription")}</p>

        <CollapsableTextContent title={t("PGPTool.whyABackup")}>{t("PGPTool.whyABackupExplanation")}</CollapsableTextContent>

        <div className="mt-5">
          {!validKeystore && <p className="error mb-2">{t("PGPTool.youDontHaveKeystore")}</p>}
          <Button disabled={!validKeystore} expanded onClick={handleDownloadKeystoreBackup}>
            <SaveIcon className="mr-3" fontSize="small" />
            {t("PGPTool.downloadBackup")}
          </Button>
        </div>
      </StyledBaseKeystoreContainer>
    </Modal>
  );
};
