import { useTranslation } from "react-i18next";
import { Button, CollapsableTextContent, Modal } from "components";
import { LocalStorage } from "constants/constants";
import { StyledBaseKeystoreContainer } from "../../../styles";
import SaveIcon from "@mui/icons-material/SaveAltOutlined";

type CreateBackupProps = {
  onClose: () => void;
};

export const CreateBackup = ({ onClose }: CreateBackupProps) => {
  const { t } = useTranslation();

  const handleDownloadKeystoreBackup = () => {
    const encryptedKeystore = localStorage.getItem(LocalStorage.Keystore);
    if (!encryptedKeystore) return;

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(encryptedKeystore)}`;
    const actualTime = new Date().toJSON().split(".")[0].replaceAll(":", "").replaceAll("-", "");
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `hatsKeysBackup-${actualTime}.json`;
    link.click();
  };

  return (
    <Modal
      titleIcon={<SaveIcon className="mr-2" fontSize="large" />}
      title={t("PGPTool.pgpKeysBackup")}
      pgpKeystoreStyles
      capitalizeTitle
      isShowing={true}
      onHide={onClose}
    >
      <StyledBaseKeystoreContainer>
        <p className="mb-4">{t("PGPTool.backupDescription")}</p>

        <CollapsableTextContent title={t("PGPTool.whyABackup")}>{t("PGPTool.whyABackupExplanation")}</CollapsableTextContent>

        <Button expanded className="mt-5" onClick={handleDownloadKeystoreBackup}>
          <SaveIcon className="mr-3" fontSize="small" />
          {t("PGPTool.downloadBackup")}
        </Button>
      </StyledBaseKeystoreContainer>
    </Modal>
  );
};
