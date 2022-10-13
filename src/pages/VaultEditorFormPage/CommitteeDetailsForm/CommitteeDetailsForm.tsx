import { useTranslation } from "react-i18next";
import { IVaultDescription } from "types/types";
import { HatsFormInput } from "components";

type VaultDetailsProps = {
  committee: IVaultDescription["committee"];
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export function CommitteeDetailsForm({ committee, onChange }: VaultDetailsProps) {
  const { t } = useTranslation();

  return (
    <>
      <label>{t("VaultEditor.multisig-address")}</label>
      <HatsFormInput
        name="committee.multisig-address"
        value={committee["multisig-address"]}
        pastable
        colorable
        onChange={onChange}
        placeholder={t("VaultEditor.vault-details.multisig-address-placeholder")}
      />
    </>
  );
}
