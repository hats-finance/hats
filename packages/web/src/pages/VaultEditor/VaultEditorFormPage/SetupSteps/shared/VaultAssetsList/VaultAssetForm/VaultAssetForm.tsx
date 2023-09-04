import { IEditedVaultAsset, IEditedVaultDescription } from "@hats-finance/shared";
import { FormIconInput, FormInput, FormSelectInput } from "components";
import { getCustomIsDirty, useEnhancedFormContext } from "hooks/form";
import { useContext, useEffect, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { appChains } from "settings";
import { isAddress } from "utils/addresses.utils";
import { getTokenInfo } from "utils/tokens.utils";
import { useAccount, useNetwork } from "wagmi";
import { VaultEditorFormContext } from "../../../../store";
import { StyledVaultAssetForm } from "./styles";

type VaultAssetFormProps = {
  index: number;
  assetsCount: number;
  append: (data: IEditedVaultAsset) => void;
  remove: (index: number) => void;
};

export function VaultAssetForm({ index, append, remove, assetsCount }: VaultAssetFormProps) {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [assetInfo, setAssetInfo] = useState<string | undefined>(undefined);
  const { register, control, setValue } = useEnhancedFormContext<IEditedVaultDescription>();

  const { allFormDisabled, isEditingExistingVault } = useContext(VaultEditorFormContext);

  const vaultChainId = useWatch({ control, name: "committee.chainId" });
  const tokenAddress = useWatch({ control, name: `assets.${index}.address` });

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
    if (tokenAddress && vaultChainId) {
      setAssetInfo(undefined);
      setValue(`assets.${index}.symbol`, "");

      const isAdd = isAddress(tokenAddress);
      if (!isAdd) return;

      getTokenInfo(tokenAddress, +vaultChainId)
        .then((tokenInfo) => {
          if (tokenInfo.isValidToken) {
            setAssetInfo(`${tokenInfo.name} (${tokenInfo.symbol})`);
            setValue(`assets.${index}.symbol`, tokenInfo.symbol);
          } else {
            setAssetInfo(undefined);
            setValue(`assets.${index}.symbol`, "");
          }
        })
        .catch(() => {
          setAssetInfo(undefined);
          setValue(`assets.${index}.symbol`, "");
        });
    }
  }, [tokenAddress, vaultChainId, index, setValue]);

  return (
    <StyledVaultAssetForm>
      <p className="section-title">{t("assetsInVault")}</p>
      <div className="helper-text mb-3">{t("vaultEditorAssetInformation")}</div>

      <div className="w-25 chain">
        <Controller
          control={control}
          name={`committee.chainId`}
          render={({ field, fieldState: { error }, formState: { dirtyFields, defaultValues } }) => {
            return (
              <FormSelectInput
                isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                error={error}
                label={t("VaultEditor.vault-assets.chain")}
                placeholder={t("VaultEditor.vault-assets.chain-placeholder")}
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
      <div className="inputs">
        <FormInput
          {...register(`assets.${index}.address`)}
          disabled={allFormDisabled}
          label={t("VaultEditor.vault-assets.address")}
          placeholder={t("VaultEditor.vault-assets.address-placeholder")}
          colorable
          helper={assetInfo}
        />
        <FormIconInput
          {...register("project-metadata.tokenIcon")}
          disabled={allFormDisabled}
          colorable
          label={t("VaultEditor.vault-details.token-icon")}
        />
      </div>
    </StyledVaultAssetForm>
  );
}
