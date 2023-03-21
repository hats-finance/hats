import { useTranslation } from "react-i18next";
import { Modal } from "components";
import { StyledBaseKeystoreContainer } from "../../../styles";
import SaveIcon from "@mui/icons-material/SaveAltOutlined";

type CreateBackupProps = {
  onClose: () => void;
};

export const CreateBackup = ({ onClose }: CreateBackupProps) => {
  const { t } = useTranslation();

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
        {/* <p className="mb-4">{t("PGPTool.createNewKeyPairDescription")}</p> */}
      </StyledBaseKeystoreContainer>
    </Modal>
  );
};
