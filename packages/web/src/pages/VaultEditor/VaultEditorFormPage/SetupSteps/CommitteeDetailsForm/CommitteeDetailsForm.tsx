import { ChainsConfig } from "@hats-finance/shared";
import { useContext, useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";
import { useTranslation } from "react-i18next";
import { Controller, useWatch } from "react-hook-form";
import { FormInput, FormSelectInput } from "components";
import { useEnhancedFormContext, getCustomIsDirty } from "hooks/useEnhancedFormContext";
import { getPath } from "utils/objects.utils";
import { IEditedVaultDescription } from "types";
import { VaultEditorFormContext } from "../../store";
import { StyledCommitteeDetailsForm } from "./styles";

export function CommitteeDetailsForm() {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { chain } = useNetwork();

  const { register, control, trigger } = useEnhancedFormContext<IEditedVaultDescription>();
  const committeeChainId = useWatch({ control, name: "committee.chainId" });

  const { isEditingExitingVault, allFormDisabled } = useContext(VaultEditorFormContext);

  const showTestnets = address && chain?.testnet;
  const supportedNetworksOptions = Object.values(ChainsConfig)
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
          render={({ field, formState: { errors, dirtyFields, defaultValues } }) => {
            return (
              <FormSelectInput
                isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                error={getPath(errors, field.name)}
                label={t("VaultEditor.vault-details.chain")}
                placeholder={t("VaultEditor.vault-details.chain-placeholder")}
                colorable
                disabled={isEditingExitingVault || allFormDisabled}
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
        disabled={!committeeChainId || allFormDisabled}
        pastable
        colorable
        placeholder={t("VaultEditor.vault-details.multisig-address-placeholder")}
      />
    </StyledCommitteeDetailsForm>
  );
}
