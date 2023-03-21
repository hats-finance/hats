import { useTranslation } from "react-i18next";
import { Modal } from "components";
import { IStoredKey } from "../../types";
import { StyledKeystoreContainer } from "../../styles";

type KeysDashboardProps = {
  onClose?: () => void;
  onSelectKey?: (key: IStoredKey) => Promise<void> | undefined;
};

export const KeysDashboard = ({ onClose, onSelectKey }: KeysDashboardProps) => {
  const { t } = useTranslation();

  return (
    <Modal title={t("PGPTool.title")} pgpKeystoreStyles capitalizeTitle isShowing={true} onHide={onClose}>
      <StyledKeystoreContainer>
        <div className="description mb-4">{t("PGPTool.usePgpToolFor")}</div>
      </StyledKeystoreContainer>
    </Modal>
  );
};
