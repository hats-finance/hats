import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useWatch } from "react-hook-form";
import { FormInput, FormSelectInput } from "components";
import { ChainsConfig } from "config/chains";
import { useEnhancedFormContext, getCustomIsDirty } from "hooks/useEnhancedFormContext";
import { getPath } from "utils/objects.utils";
import { IEditedVaultDescription } from "types";
import { StyledCommitteeDetailsForm } from "./styles";

export function CommitteeDetailsForm() {
  const { t } = useTranslation();

  const { register, control, trigger } = useEnhancedFormContext<IEditedVaultDescription>();
  const committeeChainId = useWatch({ control, name: "committee.chainId" });

  const isEditingVault = !!useWatch({ control, name: "vaultCreatedInfo.vaultAddress" });

  const supportedNetworksOptions = Object.values(ChainsConfig).map((chainConf) => ({
    label: chainConf.chain.name,
    value: `${chainConf.chain.id}`,
  }));

  useEffect(() => {
    if (committeeChainId) trigger("committee.multisig-address");
  }, [committeeChainId, trigger]);

  return (
    <StyledCommitteeDetailsForm>
      <div className="helper-text" dangerouslySetInnerHTML={{ __html: t("vaultEditorCommitteeDetailsSafeExplanation") }} />

      <div className="half">
        <Controller
          control={control}
          name={`committee.chainId`}
          render={({ field, formState: { errors, dirtyFields, defaultValues } }) => {
            return (
              <FormSelectInput
                isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                error={getPath(errors, field.name)}
                label={t("VaultEditor.vault-details.chain")}
                placeholder={t("VaultEditor.vault-details.chain-placeholder")}
                colorable
                disabled={isEditingVault}
                options={supportedNetworksOptions}
                {...field}
                value={field.value ?? ""}
              />
            );
          }}
        />
      </div>

      <FormInput
        {...register("committee.multisig-address")}
        label={t("VaultEditor.multisig-address")}
        disabled={!committeeChainId}
        pastable
        colorable
        placeholder={t("VaultEditor.vault-details.multisig-address-placeholder")}
      />
    </StyledCommitteeDetailsForm>
  );
}
