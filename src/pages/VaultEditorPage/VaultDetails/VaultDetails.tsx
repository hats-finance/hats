import { useTranslation } from "react-i18next";
import { IVaultDescription } from "types/types";
import EditableContent from "components/EditableContent/EditableContent";
import IconInput from "components/IconEditor/IconEditor";
import { StyledVaultDetails } from "./styles";

type VaultDetailsProps = {
  projectMetaData: IVaultDescription["project-metadata"];
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export default function VaultDetails({ projectMetaData, onChange }: VaultDetailsProps) {
  const { t } = useTranslation();

  return (
    <StyledVaultDetails>
      <div className="inputs">
        <label>{t("VaultEditor.vault-details.name")}</label>
        <EditableContent
          textInput
          name="project-metadata.name"
          value={projectMetaData.name}
          onChange={onChange}
          colorable
          placeholder={t("VaultEditor.vault-details.name-placeholder")}
        />
        <label>{t("VaultEditor.vault-details.type")}</label>
        <EditableContent
          textInput
          name="project-metadata.type"
          value={projectMetaData.type}
          onChange={onChange}
          colorable
          placeholder={t("VaultEditor.vault-details.type-placeholder")}
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

      <div className="icons">
        <div className="icons__input">
          <label>{t("VaultEditor.vault-details.icon")}</label>
          <IconInput
            name="project-metadata.icon"
            value={projectMetaData?.icon}
            onChange={onChange}
            colorable
          />
        </div>
        <div className="icons__input">
          <label>{t("VaultEditor.vault-details.token-icon")}</label>
          <IconInput
            name="project-metadata.tokenIcon"
            value={projectMetaData?.tokenIcon}
            onChange={onChange}
            colorable
          />
        </div>
      </div>
    </StyledVaultDetails>
  );
}
