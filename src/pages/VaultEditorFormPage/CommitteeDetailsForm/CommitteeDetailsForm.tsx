import { useTranslation } from "react-i18next";
import { FormInput } from "components";
import { useFormContext } from "react-hook-form";
import { IEditedVaultDescription } from "../types";

export function CommitteeDetailsForm() {
  const { t } = useTranslation();
  const { register } = useFormContext<IEditedVaultDescription>();

  return (
    <>
      <FormInput
        {...register("committee.multisig-address")}
        label={t("VaultEditor.multisig-address")}
        pastable
        colorable
        placeholder={t("VaultEditor.vault-details.multisig-address-placeholder")}
      />
    </>
  );
}
