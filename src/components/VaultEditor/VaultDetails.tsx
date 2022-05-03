import { useTranslation } from "react-i18next";
import EditableContent from "components/CommitteeTools/components/EditableContent/EditableContent";
import IconInput from "./IconEditor";

export default function VaultDetails({ projectMetaData, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="vault-details">
      <div className="field">
        <label>{t("VaultEditor.vault-details.name")}</label>
        <EditableContent
          textInput
          name="project-metadata.name"
          value={projectMetaData.name}
          onChange={onChange}
          colorable
          placeholder={t("VaultEditor.vault-details.name-placeholder")}
        />
        <label>{t("VaultEditor.vault-details.website")}</label>
        <EditableContent
          name="project-metadata.website"
          textInput
          value={projectMetaData.website}
          onChange={onChange}
          colorable
          placeholder={t("VaultEditor.vault-details.website-placeholder")}
        />
      </div>
      <div className="field icon-inputs">
        <div>
          <label>{t("VaultEditor.vault-details.icon")}</label>
          <IconInput
            name="project-metadata.icon"
            value={projectMetaData?.icon}
            onChange={onChange}
            colorable
          />
        </div>
        <div>
          <label>{t("VaultEditor.vault-details.token-icon")}</label>
          <IconInput
            name="project-metadata.tokenIcon"
            value={projectMetaData?.tokenIcon}
            onChange={onChange}
            colorable
          />
        </div>
      </div>
    </div>
  );
}
