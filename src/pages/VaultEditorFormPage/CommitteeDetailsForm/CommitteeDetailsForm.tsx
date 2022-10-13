import { useTranslation } from "react-i18next";
import { HatsFormInput } from "components";
import { useFormContext } from "react-hook-form";

export function CommitteeDetailsForm() {
  const { t } = useTranslation();
  const { register } = useFormContext();

  return (
    <>
      <label>{t("VaultEditor.multisig-address")}</label>
      <HatsFormInput
        {...register("committee.multisig-address")}
        pastable
        colorable
        placeholder={t("VaultEditor.vault-details.multisig-address-placeholder")}
      />
    </>
  );
}
