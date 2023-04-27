import { useContext, useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";
import { IEditedVaultDescription } from "@hats-finance/shared";
import { useTranslation } from "react-i18next";
import { Controller, useWatch } from "react-hook-form";
import { FormInput, FormSelectInput } from "components";
import { appChains } from "settings";
import { useEnhancedFormContext, getCustomIsDirty } from "hooks/form";
import { VaultEditorFormContext } from "../../store";
import { StyledCommitteeDetailsForm } from "./styles";

export function CommitteeDetailsForm() {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { chain } = useNetwork();

  const { register, control, trigger } = useEnhancedFormContext<IEditedVaultDescription>();
  const committeeChainId = useWatch({ control, name: "committee.chainId" });

  const { isEditingExistingVault, allFormDisabled } = useContext(VaultEditorFormContext);

  const showTestnets = address && chain?.testnet;
  const supportedNetworksOptions = Object.values(appChains)
    .filter(
      (chainInfo) =>
        Number(committeeChainId) === chainInfo.chain.id || (showTestnets ? chainInfo.chain.testnet : !chainInfo.chain.testnet)
    )
    .map((chainConf) => ({
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
          render={({ field, fieldState: { error }, formState: { dirtyFields, defaultValues } }) => {
            return (
              <FormSelectInput
                isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                error={error}
                label={t("VaultEditor.vault-details.chain")}
                placeholder={t("VaultEditor.vault-details.chain-placeholder")}
                colorable
                disabled={isEditingExistingVault || allFormDisabled}
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
        disabled={!committeeChainId || isEditingExistingVault || allFormDisabled}
        pastable
        colorable
        placeholder={t("VaultEditor.vault-details.multisig-address-placeholder")}
      />
    </StyledCommitteeDetailsForm>
  );
}
