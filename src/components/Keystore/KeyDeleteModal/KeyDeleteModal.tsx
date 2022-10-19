import { useTranslation } from "react-i18next";
import { Modal } from "components";
import { IStoredKey } from "../types";
import { StyledKeyDeleteModal } from "./styles";
import { useContext } from "react";
import { KeystoreContext } from "../store";

type KeyDeleteModalProps = {
  isShowing: boolean;
  onHide: () => void;
  keyToDelete: IStoredKey;
};

function KeyDeleteModal({ isShowing, onHide, keyToDelete }: KeyDeleteModalProps) {
  const { t } = useTranslation();
  const keystoreContext = useContext(KeystoreContext);

  return (
    <Modal isShowing={isShowing} title={t("CommitteeTools.keymodal.delete-keypair")} onHide={onHide} withTitleDivider>
      <StyledKeyDeleteModal>
        <p className="description">{t("CommitteeTools.keymodal.delete-text")}</p>
        <div className="button-container">
          <button
            className="fill"
            onClick={() => {
              keystoreContext.deleteKey(keyToDelete);
              onHide();
            }}>
            {t("Shared.yes")}
          </button>
          <button className="button-cancel" onClick={() => onHide()}>
            {t("Shared.cancel")}
          </button>
        </div>
      </StyledKeyDeleteModal>
    </Modal>
  );
}

export { KeyDeleteModal };
