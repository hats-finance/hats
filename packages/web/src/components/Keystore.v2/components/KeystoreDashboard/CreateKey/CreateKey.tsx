import { useTranslation } from "react-i18next";
import { Modal } from "components";
import { StyledBaseKeystoreContainer } from "../../../styles";
import AddIcon from "@mui/icons-material/Add";

type CreateKeyProps = {
  onClose: () => void;
};

export const CreateKey = ({ onClose }: CreateKeyProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      titleIcon={<AddIcon className="mr-2" fontSize="large" />}
      title={t("PGPTool.createNewKeyPair")}
      pgpKeystoreStyles
      capitalizeTitle
      isShowing={true}
      onHide={onClose}
    >
      <StyledBaseKeystoreContainer>
        <p className="mb-4">{t("PGPTool.createNewKeyPairDescription")}</p>
      </StyledBaseKeystoreContainer>
    </Modal>
  );
};
