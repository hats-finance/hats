import { useTranslation } from "react-i18next";
import { FormInput } from "components";
import { useFormContext } from "react-hook-form";
import { IEditedVaultDescription } from "../types";

export function CommitteeDetailsForm() {
  const { t } = useTranslation();
  const { register, formState, getFieldState } = useFormContext<IEditedVaultDescription>();

  return (
    <>
      <FormInput
        {...register("committee.multisig-address")}
        isDirty={getFieldState("committee.multisig-address", formState).isDirty}
        label={t("VaultEditor.multisig-address")}
        pastable
        colorable
        placeholder={t("VaultEditor.vault-details.multisig-address-placeholder")}
      />
    </>
  );
}
