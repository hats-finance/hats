import { useTranslation } from "react-i18next";
import { Modal } from "components";
import { StyledBaseKeystoreContainer } from "../../../styles";
import UploadIcon from "@mui/icons-material/FileUploadOutlined";

type ImportKeyProps = {
  onClose: () => void;
};

export const ImportKey = ({ onClose }: ImportKeyProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      titleIcon={<UploadIcon className="mr-2" fontSize="large" />}
      title={t("PGPTool.importKey")}
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
