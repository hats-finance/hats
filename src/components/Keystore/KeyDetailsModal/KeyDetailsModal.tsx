import { useTranslation } from "react-i18next";
import { Modal } from "components";
import CopyToClipboard from "components/CopyToClipboard";
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
          <CopyToClipboard value={keyToShow.privateKey} />
        </div>
        {keyToShow.passphrase && (
          <div className="result__copy">
            <span className="result__label">{t("CommitteeTools.KeyDetails.passphrase")}</span>
            <CopyToClipboard value={keyToShow.passphrase} />
          </div>
        )}
        <div className="result__copy">
          <span className="result__label">{t("CommitteeTools.KeyDetails.public-key")}</span>
          <CopyToClipboard value={keyToShow.publicKey} />
        </div>
      </StyledKeyDetailsModal>
    </Modal>
  );
}

export { KeyDetailsModal };
