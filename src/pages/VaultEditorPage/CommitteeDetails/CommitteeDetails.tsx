import { useTranslation } from "react-i18next";
import { IVaultDescription } from "types/types";
import { EditableContent } from "components";

type VaultDetailsProps = {
  committee: IVaultDescription["committee"];
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export function CommitteeDetails({ committee, onChange }: VaultDetailsProps) {
  const { t } = useTranslation();

  return (
    <>
      <label>{t("VaultEditor.multisig-address")}</label>
      <EditableContent
        name="committee.multisig-address"
        value={committee["multisig-address"]}
        pastable
        textInput
        colorable
        onChange={onChange}
        placeholder={t("VaultEditor.vault-details.multisig-address-placeholder")}
      />
    </>
  );
}
