import { IEditedVaultDescription } from "@hats.finance/shared";
import { FormInput, FormSelectInput } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { useContext, useEffect } from "react";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { appChains } from "settings";
import { useAccount, useNetwork } from "wagmi";
import { VaultEditorFormContext } from "../../store";
import { StyledCommitteeDetailsForm } from "./styles";

export function CommitteeDetailsForm() {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { chain } = useNetwork();

  const { register, control, trigger } = useEnhancedFormContext<IEditedVaultDescription>();
  const vaultChainId = useWatch({ control, name: "committee.chainId" });

  const { isEditingExistingVault, allFormDisabled } = useContext(VaultEditorFormContext);

  const showTestnets = address && chain?.testnet;
  const supportedNetworksOptions = Object.values(appChains)
    .filter(
      (chainInfo) =>
        Number(vaultChainId) === chainInfo.chain.id || (showTestnets ? chainInfo.chain.testnet : !chainInfo.chain.testnet)
    )
    .map((chainConf) => ({
      label: chainConf.chain.name,
      value: `${chainConf.chain.id}`,
    }));

  useEffect(() => {
    if (vaultChainId) trigger("committee.multisig-address");
  }, [vaultChainId, trigger]);

  return (
    <StyledCommitteeDetailsForm>
      <div className="helper-text" dangerouslySetInnerHTML={{ __html: t("vaultEditorCommitteeDetailsSafeExplanation") }} />

      <div className="half">
        <FormSelectInput
          disabled
          name="chainId"
          onChange={() => {}}
          label={t("VaultEditor.vault-details.chain")}
          placeholder={t("VaultEditor.vault-details.chain-placeholder")}
          options={supportedNetworksOptions}
          value={vaultChainId ?? ""}
        />
      </div>

      <FormInput
        {...register("committee.multisig-address")}
        label={t("VaultEditor.multisig-address")}
        disabled={!vaultChainId || isEditingExistingVault || allFormDisabled}
        pastable
        colorable
        placeholder={t("VaultEditor.vault-details.multisig-address-placeholder")}
      />
    </StyledCommitteeDetailsForm>
  );
}
