import { useTranslation } from "react-i18next";
import EditableContent from "components/CommitteeTools/components/EditableContent/EditableContent";

export default function VaultSign() {
  const { t } = useTranslation();
  return (
    <>
      <label>{t("VaultEditor.sign-message")}</label>
      <EditableContent removable name="sign_message" />
      <label>{t("VaultEditor.signees")}</label>
      <div className="signees">
        <div className="signees__signee">
          <div className="signees__signee-number">1</div>
          <div className="signees__signee-content">
            2345fhgf345678909087654kjghfdssdfg
          </div>
        </div>
        <div className="signees__signee">
          <div className="signees__signee-number">2</div>
          <div className="signees__signee-content">
            2345fhgf345678909087654kjghfdssdfg
          </div>
        </div>
      </div>
    </>
  );
}
