import { useTranslation } from "react-i18next";
import EditableContent from "components/CommitteeTools/components/EditableContent/EditableContent";

export default function VaultSign({ signatures, onChange, message }) {
  const { t } = useTranslation();
  return (
    <>
      <label>{t("VaultEditor.sign-message")}</label>
      <EditableContent onChange={onChange} value={message} removable name="sign_message" />
      <label>{t("VaultEditor.signees")}</label>
      <div className="signees">
        {signatures.map((signature, index) => (
          <div className="signees__signee">
            <div className="signees__signee-number">{index + 1}</div>
            <div className="signees__signee-content">
              {signature}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
