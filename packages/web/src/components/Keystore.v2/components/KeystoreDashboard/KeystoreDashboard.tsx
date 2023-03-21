import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "components";
import { IStoredKey } from "../../types";
import { StyledBaseKeystoreContainer } from "../../styles";
import { CreateKey, ImportKey, CreateBackup, RestoreBackup } from "./";

type KeystoreDashboardAction = "create" | "import" | "create_backup" | "restore_backup";

type KeystoreDashboardProps = {
  onClose?: () => void;
  onSelectKey?: (key: IStoredKey) => Promise<void> | undefined;
};

export const KeystoreDashboard = ({ onClose, onSelectKey }: KeystoreDashboardProps) => {
  const { t } = useTranslation();

  const [activeAction, setActiveAction] = useState<KeystoreDashboardAction | undefined>();
  const removeActiveAction = () => setActiveAction(undefined);

  return (
    <>
      <Modal title={t("PGPTool.title")} pgpKeystoreStyles capitalizeTitle isShowing={true} onHide={onClose}>
        <StyledBaseKeystoreContainer bigger>
          <div className="mb-4">{t("PGPTool.usePgpToolFor")}</div>
        </StyledBaseKeystoreContainer>
      </Modal>

      {activeAction === "create" && <CreateKey onClose={removeActiveAction} />}
      {activeAction === "import" && <ImportKey onClose={removeActiveAction} />}
      {activeAction === "create_backup" && <CreateBackup onClose={removeActiveAction} />}
      {activeAction === "restore_backup" && <RestoreBackup onClose={removeActiveAction} />}
    </>
  );
};
