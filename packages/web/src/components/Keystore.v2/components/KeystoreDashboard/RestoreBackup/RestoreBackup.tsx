import { useTranslation } from "react-i18next";
import { Modal } from "components";
import { StyledBaseKeystoreContainer } from "../../../styles";
import RestoreIcon from "@mui/icons-material/UploadFileOutlined";

type RestoreBackupProps = {
  onClose: () => void;
};

export const RestoreBackup = ({ onClose }: RestoreBackupProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      titleIcon={<RestoreIcon className="mr-2" fontSize="large" />}
      title={t("PGPTool.uploadBackup")}
      pgpKeystoreStyles
      capitalizeTitle
      isShowing={true}
      onHide={onClose}
    >
      <StyledBaseKeystoreContainer>
        {/* <p className="mb-4">{t("PGPTool.createNewKeyPairDescription")}</p> */}
      </StyledBaseKeystoreContainer>
    </Modal>
  );
};
