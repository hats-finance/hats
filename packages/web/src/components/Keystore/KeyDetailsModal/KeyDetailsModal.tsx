import { useTranslation } from "react-i18next";
import { Modal, CopyToClipboard } from "components";
import { IStoredKey } from "../types";
import { StyledKeyDetailsModal } from "./styles";

type KeyDetailsModalProps = {
  isShowing: boolean;
  onHide?: () => void;
  keyToShow: IStoredKey;
};

function KeyDetailsModal({ isShowing, onHide, keyToShow }: KeyDetailsModalProps) {
  const { t } = useTranslation();

  return (
    <Modal isShowing={isShowing} title={t("CommitteeTools.KeyDetails.title")} onHide={onHide} withTitleDivider>
      <StyledKeyDetailsModal>
        <p className="description">{t("CommitteeTools.KeyDetails.description")}</p>
        <div className="result__copy">
          <span className="result__label">{t("CommitteeTools.KeyDetails.private-key")}</span>
          <CopyToClipboard valueToCopy={keyToShow.privateKey} />
        </div>
        {keyToShow.passphrase && (
          <div className="result__copy">
            <span className="result__label">{t("CommitteeTools.KeyDetails.passphrase")}</span>
            <CopyToClipboard valueToCopy={keyToShow.passphrase} />
          </div>
        )}
        <div className="result__copy">
          <span className="result__label">{t("CommitteeTools.KeyDetails.public-key")}</span>
          <CopyToClipboard valueToCopy={keyToShow.publicKey} />
        </div>
      </StyledKeyDetailsModal>
    </Modal>
  );
}

export { KeyDetailsModal };
